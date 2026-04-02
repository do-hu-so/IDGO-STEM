import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct, useCreateProduct, useUpdateProduct, uploadProductFile, typeLabels, gradeLabels, categoryLabels } from "@/hooks/useProducts";
import type { ProductType, GradeLevel, CategoryType } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Upload } from "lucide-react";

const ProductForm = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;
    const navigate = useNavigate();

    const { data: existingProduct, isLoading: loadingProduct } = useProduct(id || "");
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<ProductType>("book");
    const [grade, setGrade] = useState<GradeLevel>(3);
    const [category, setCategory] = useState<CategoryType>("6-8");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [isPublished, setIsPublished] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Populate form when editing
    useEffect(() => {
        if (existingProduct) {
            setTitle(existingProduct.title);
            setDescription(existingProduct.description || "");
            setType(existingProduct.type);
            setGrade(existingProduct.grade);
            setCategory(existingProduct.category);
            setThumbnailUrl(existingProduct.thumbnail_url || "");
            setPreviewUrl(existingProduct.preview_url || "");
            setDownloadUrl(existingProduct.download_url || "");
            setFileUrl(existingProduct.file_url || "");
            setIsPublished(existingProduct.is_published);
        }
    }, [existingProduct]);

    // Auto-set category based on grade
    useEffect(() => {
        if (grade === 3) setCategory("6-8");
        else if (grade === 4) setCategory("9-11");
        else if (grade === 5) setCategory("12-14");
    }, [grade]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: "product-files" | "product-thumbnails") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadProductFile(file, bucket);
            if (bucket === "product-thumbnails") {
                setThumbnailUrl(url);
            } else {
                setFileUrl(url);
            }
            toast.success("Upload thành công!");
        } catch (error: any) {
            toast.error("Lỗi upload: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Vui lòng nhập tên sản phẩm");
            return;
        }

        const productData = {
            title: title.trim(),
            description: description.trim(),
            type,
            grade,
            category,
            thumbnail_url: thumbnailUrl,
            preview_url: previewUrl,
            download_url: downloadUrl,
            file_url: fileUrl,
            is_published: isPublished,
        };

        try {
            if (isEditing && id) {
                await updateProduct.mutateAsync({ id, ...productData });
            } else {
                await createProduct.mutateAsync(productData);
            }
            navigate("/admin/products");
        } catch (error) {
            // Error handled by mutation
        }
    };

    const isSubmitting = createProduct.isPending || updateProduct.isPending;

    if (isEditing && loadingProduct) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate("/admin/products")}>
                <ArrowLeft className="w-4 h-4" /> Quay lại
            </Button>

            <h1 className="text-2xl font-black text-slate-800 mb-6">
                {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">Thông tin cơ bản</h2>

                    <div className="space-y-2">
                        <Label htmlFor="title">Tên sản phẩm *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="VD: Slide Bài giảng lớp 3 - Bài 1"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn gọn về sản phẩm..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Loại sản phẩm</Label>
                            <Select value={type} onValueChange={(v: ProductType) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(typeLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Lớp</Label>
                            <Select value={String(grade)} onValueChange={(v) => setGrade(Number(v) as GradeLevel)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(gradeLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Danh mục</Label>
                            <Select value={category} onValueChange={(v: CategoryType) => setCategory(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(categoryLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Media & Resources */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-slate-800">Media & Tài liệu đính kèm</h2>

                    {/* Ảnh bìa */}
                    <div className="space-y-2 pb-6 border-b border-slate-100">
                        <Label className="text-base font-semibold">1. Ảnh bìa (Thumbnail)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={thumbnailUrl}
                                onChange={(e) => setThumbnailUrl(e.target.value)}
                                placeholder="https://... hoặc upload file bên dưới"
                                className="flex-grow bg-slate-50"
                            />
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, "product-thumbnails")}
                                    disabled={uploading}
                                />
                                <Button type="button" variant="outline" className="gap-2" asChild>
                                    <span>
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                        Upload
                                    </span>
                                </Button>
                            </label>
                        </div>
                        {thumbnailUrl && (
                            <img src={thumbnailUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border mt-2" />
                        )}
                    </div>

                    {/* Nguồn 1: Upload File */}
                    <div className="space-y-3 pb-6 border-b border-slate-100">
                        <div>
                            <Label className="text-base font-semibold text-primary">2. Nguồn 1: Upload File tĩnh (PDF, PPTX, DOCX, ZIP...)</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                File sẽ được lữu trữ an toàn trên máy chủ. Tự động hỗ trợ chức năng xem trước / tải xuống.
                            </p>
                        </div>
                        <div className="flex gap-2 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <Input
                                value={fileUrl}
                                onChange={(e) => setFileUrl(e.target.value)}
                                placeholder="URL sẽ tự động xuất hiện sau khi bạn upload thành công"
                                className="flex-grow bg-white"
                                readOnly={!!fileUrl}
                            />
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, "product-files")}
                                    disabled={uploading}
                                />
                                <Button type="button" variant="default" className="gap-2" asChild>
                                    <span>
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                        Upload Tệp Từ Máy
                                    </span>
                                </Button>
                            </label>
                        </div>
                    </div>

                    {/* Nguồn 2: Links */}
                    <div className="space-y-3">
                        <div>
                            <Label className="text-base font-semibold text-primary">3. Nguồn 2: Liên kết chia sẻ bên ngoài (Google Drive, YouTube...)</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                Dùng cách này nếu bạn không muốn tải file lên hệ thống mà lấy từ nguồn ngoài. Cần cấp quyền công khai (public) cho link.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="space-y-2">
                                <Label>Bản Xem Trước (VD: YouTube Link, Docs Link)</Label>
                                <Input
                                    value={previewUrl}
                                    onChange={(e) => setPreviewUrl(e.target.value)}
                                    placeholder="https://youtu.be/..."
                                    className="bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Link Tải Về (VD: Google Drive Link)</Label>
                                <Input
                                    value={downloadUrl}
                                    onChange={(e) => setDownloadUrl(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base font-bold">Xuất bản</Label>
                            <p className="text-sm text-muted-foreground">Sản phẩm sẽ hiển thị trên trang web</p>
                        </div>
                        <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting} className="gap-2 px-8">
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isEditing ? "Lưu thay đổi" : "Tạo sản phẩm"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
                        Hủy
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
