-- ============================================================
-- IDGO-STEM: Database Migration Script
-- Chạy file SQL này trên Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Tạo bảng profiles (liên kết với auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tự động tạo profile khi có user mới đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: mỗi khi có user mới → tự tạo profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: User xem profile của chính mình
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: User cập nhật profile của chính mình
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Admin can read all profiles
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Policy: Admin can update any profile (e.g. change role)
CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Policy: Admin can delete profiles
CREATE POLICY "Admin can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 2. Tạo bảng products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('book', 'video', 'code', 'ppt', 'video_demo', 'robotics')),
  grade INTEGER NOT NULL CHECK (grade IN (3, 4, 5)),
  category TEXT NOT NULL CHECK (category IN ('6-8', '9-11', '12-14', 'teacher')),
  thumbnail_url TEXT DEFAULT '',
  preview_url TEXT DEFAULT '',
  download_url TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  rating REAL DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index cho tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_grade ON products(grade);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);

-- Tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON products;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Everyone can read published products (không cần đăng nhập)
CREATE POLICY "Anyone can view published products"
  ON products FOR SELECT
  USING (is_published = true);

-- Admin can do everything on products
CREATE POLICY "Admin full access on products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Teacher can insert products
CREATE POLICY "Teacher can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
  );

-- Teacher can update own products
CREATE POLICY "Teacher can update own products"
  ON products FOR UPDATE
  USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teacher can delete own products"
  ON products FOR DELETE
  USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
  );

-- ============================================================
-- 3. Tạo bảng cart_items
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. Storage Buckets
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-thumbnails', 'product-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Admin and Teacher can upload product files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('product-files', 'product-thumbnails') AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Authenticated users can download product files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'product-files' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Public can view product thumbnails"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'product-thumbnails'
  );

CREATE POLICY "Admin and Teacher can delete product files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('product-files', 'product-thumbnails') AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')
    )
  );
