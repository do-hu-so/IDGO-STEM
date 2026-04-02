import { useState } from "react";
import { Link } from "react-router-dom";
import { useAllProducts, useDeleteProduct, useTogglePublished, typeLabels, gradeLabels } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

const ManageProducts = () => {
    const { data: products = [], isLoading } = useAllProducts();
    const deleteProduct = useDeleteProduct();
    const togglePublished = useTogglePublished();
    const [search, setSearch] = useState("");

    const filtered = products.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-black text-slate-800">Quản lý sản phẩm</h1>
                <Link to="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Thêm sản phẩm
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-9 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="mb-4">Chưa có sản phẩm nào.</p>
                        <Link to="/admin/products/new">
                            <Button>Thêm sản phẩm đầu tiên</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Loại</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Lớp</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.thumbnail_url ? (
                                                    <img
                                                        src={product.thumbnail_url}
                                                        alt=""
                                                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {product.type.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-semibold text-sm text-slate-800 line-clamp-1 max-w-[200px]">
                                                    {product.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {typeLabels[product.type] || product.type}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {gradeLabels[product.grade]}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    togglePublished.mutate({
                                                        id: product.id,
                                                        is_published: !product.is_published,
                                                    })
                                                }
                                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full cursor-pointer transition-colors ${
                                                    product.is_published
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                                }`}
                                            >
                                                {product.is_published ? (
                                                    <><Eye className="w-3 h-3" /> Xuất bản</>
                                                ) : (
                                                    <><EyeOff className="w-3 h-3" /> Nháp</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link to={`/admin/products/${product.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-500 hover:bg-blue-50">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
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
                                                                Bạn có chắc muốn xóa "{product.title}"? Hành động này không thể hoàn tác.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-500 hover:bg-red-600"
                                                                onClick={() => deleteProduct.mutate(product.id)}
                                                            >
                                                                Xóa
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProducts;
