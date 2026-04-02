import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMyProducts, useDeleteProduct, useCreateProduct, uploadProductFile, typeLabels, gradeLabels, categoryLabels } from "@/hooks/useProducts";
import type { ProductType, GradeLevel, CategoryType } from "@/hooks/useProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Loader2, Trash2, Upload, Package } from "lucide-react";

const TeacherUpload = () => {
    const { user, role, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { data: myProducts = [], isLoading } = useMyProducts(user?.id);
    const deleteProduct = useDeleteProduct();
    const createProduct = useCreateProduct();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<ProductType>("book");
    const [grade, setGrade] = useState<GradeLevel>(3);
    const [category, setCategory] = useState<CategoryType>("6-8");
    const [previewUrl, setPreviewUrl] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || (role !== "teacher" && role !== "admin"))) {
            navigate("/");
        }
    }, [user, role, authLoading, navigate]);

    useEffect(() => {
        if (grade === 3) setCategory("6-8");
        else if (grade === 4) setCategory("9-11");
        else if (grade === 5) setCategory("12-14");
    }, [grade]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadProductFile(file, "product-thumbnails");
            setThumbnailUrl(url);
            toast.success("Upload ảnh bìa thành công!");
        } catch (error: any) {
            toast.error("Lỗi upload: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Vui lòng nhập tên sản phẩm");
            return;
        }

        try {
            await createProduct.mutateAsync({
                title: title.trim(),
                description: description.trim(),
                type,
                grade,
                category,
                thumbnail_url: thumbnailUrl,
                preview_url: previewUrl,
                download_url: downloadUrl,
                is_published: true,
            });
            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            // Error handled by mutation
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setType("book");
        setGrade(3);
        setCategory("6-8");
        setPreviewUrl("");
        setDownloadUrl("");
        setThumbnailUrl("");
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-slate-800">Sản phẩm của tôi</h1>
                            <p className="text-muted-foreground">Quản lý các tài liệu bạn đã upload</p>
                        </div>
                        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" /> Upload mới
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Upload sản phẩm mới</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Tên sản phẩm *</Label>
                                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Slide Bài giảng lớp 3" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mô tả</Label>
                                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Loại</Label>
                                            <Select value={type} onValueChange={(v: ProductType) => setType(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(typeLabels).map(([k, v]) => (
                                                        <SelectItem key={k} value={k}>{v}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Lớp</Label>
                                            <Select value={String(grade)} onValueChange={(v) => setGrade(Number(v) as GradeLevel)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(gradeLabels).map(([k, v]) => (
                                                        <SelectItem key={k} value={k}>{v}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ảnh bìa</Label>
                                        <div className="flex gap-2">
                                            <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="URL ảnh hoặc upload" className="flex-grow" />
                                            <label className="cursor-pointer">
                                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                                <Button type="button" variant="outline" size="icon" asChild>
                                                    <span>{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</span>
                                                </Button>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Link xem trước (Google Drive)</Label>
                                        <Input value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Link tải xuống</Label>
                                        <Input value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
                                    <Button onClick={handleSubmit} disabled={createProduct.isPending}>
                                        {createProduct.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        Tạo sản phẩm
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* My Products List */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : myProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <Package className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-700">Chưa có sản phẩm nào</h3>
                            <p className="text-muted-foreground mb-4">Hãy upload sản phẩm đầu tiên của bạn!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
                                >
                                    {product.thumbnail_url ? (
                                        <img src={product.thumbnail_url} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {product.type.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-slate-800 line-clamp-1">{product.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {typeLabels[product.type]} • {gradeLabels[product.grade]} •{" "}
                                            <span className={product.is_published ? "text-green-600" : "text-yellow-600"}>
                                                {product.is_published ? "Xuất bản" : "Nháp"}
                                            </span>
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc muốn xóa "{product.title}"?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => deleteProduct.mutate(product.id)}>
                                                    Xóa
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TeacherUpload;
