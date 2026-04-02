import { createClient } from "@supabase/supabase-js";

// Cung cấp giá trị mặc định để tránh lỗi trắng trang khi chưa cấu hình file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
