import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProductType = "book" | "video" | "code" | "ppt" | "video_demo" | "robotics";
export type GradeLevel = 3 | 4 | 5;
export type CategoryType = "6-8" | "9-11" | "12-14" | "teacher";

export interface Product {
    id: string;
    title: string;
    description: string;
    type: ProductType;
    grade: GradeLevel;
    category: CategoryType;
    thumbnail_url: string;
    preview_url: string;
    download_url: string;
    file_url: string;
    rating: number;
    reviews_count: number;
    is_published: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateProductInput {
    title: string;
    description?: string;
    type: ProductType;
    grade: GradeLevel;
    category: CategoryType;
    thumbnail_url?: string;
    preview_url?: string;
    download_url?: string;
    file_url?: string;
    is_published?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: string;
}

// --- Query Keys ---
const PRODUCTS_KEY = ["products"];

// --- Fetch all products ---
export function useProducts(filters?: {
    type?: ProductType;
    grade?: GradeLevel;
    category?: CategoryType;
    publishedOnly?: boolean;
}) {
    return useQuery({
        queryKey: [...PRODUCTS_KEY, filters],
        queryFn: async () => {
            let query = supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (filters?.type) query = query.eq("type", filters.type);
            if (filters?.grade) query = query.eq("grade", filters.grade);
            if (filters?.category) query = query.eq("category", filters.category);
            if (filters?.publishedOnly !== false) query = query.eq("is_published", true);

            const { data, error } = await query;
            if (error) throw error;
            return (data || []) as Product[];
        },
    });
}

// --- Fetch all products for admin (including unpublished) ---
export function useAllProducts() {
    return useQuery({
        queryKey: [...PRODUCTS_KEY, "all"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return (data || []) as Product[];
        },
    });
}

// --- Fetch single product ---
export function useProduct(id: string) {
    return useQuery({
        queryKey: [...PRODUCTS_KEY, id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            return data as Product;
        },
        enabled: !!id,
    });
}

// --- Fetch products by creator (for teacher) ---
export function useMyProducts(userId: string | undefined) {
    return useQuery({
        queryKey: [...PRODUCTS_KEY, "my", userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("created_by", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return (data || []) as Product[];
        },
        enabled: !!userId,
    });
}

// --- Create product ---
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateProductInput) => {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from("products")
                .insert({
                    ...input,
                    created_by: user?.id,
                })
                .select()
                .single();

            if (error) throw error;
            return data as Product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
            toast.success("Đã thêm sản phẩm mới!");
        },
        onError: (error: Error) => {
            console.error("Create product error:", error);
            toast.error("Lỗi khi tạo sản phẩm: " + error.message);
        },
    });
}

// --- Update product ---
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...input }: UpdateProductInput) => {
            const { data, error } = await supabase
                .from("products")
                .update(input)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data as Product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
            toast.success("Đã cập nhật sản phẩm!");
        },
        onError: (error: Error) => {
            console.error("Update product error:", error);
            toast.error("Lỗi khi cập nhật: " + error.message);
        },
    });
}

// --- Delete product ---
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
            toast.success("Đã xóa sản phẩm!");
        },
        onError: (error: Error) => {
            console.error("Delete product error:", error);
            toast.error("Lỗi khi xóa sản phẩm: " + error.message);
        },
    });
}

// --- Toggle published status ---
export function useTogglePublished() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
            const { error } = await supabase
                .from("products")
                .update({ is_published })
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
        },
        onError: (error: Error) => {
            toast.error("Lỗi: " + error.message);
        },
    });
}

// --- Upload file to storage ---
export async function uploadProductFile(
    file: File,
    bucket: "product-files" | "product-thumbnails"
): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
}

// --- Helper: Type labels ---
export const typeLabels: Record<ProductType, string> = {
    book: "Tài liệu",
    video: "Video khóa học",
    code: "Source Code",
    ppt: "PowerPoint",
    video_demo: "Video ứng dụng",
    robotics: "Robotics",
};

export const gradeLabels: Record<GradeLevel, string> = {
    3: "Lớp 3",
    4: "Lớp 4",
    5: "Lớp 5",
};

export const categoryLabels: Record<CategoryType, string> = {
    "6-8": "Lớp 3",
    "9-11": "Lớp 4",
    "12-14": "Lớp 5",
    teacher: "Giáo viên",
};
