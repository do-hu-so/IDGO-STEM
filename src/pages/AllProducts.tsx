
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Download, Eye, Filter, Search, ShoppingCart, Star } from "lucide-react";
import { products, ProductType, GradeLevel } from "@/data/products";
import { useCart } from "@/context/CartContext";

const AllProducts = () => {
    const [sortOrder, setSortOrder] = useState<"default" | "price-asc" | "price-desc">("default");
    const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
    const [selectedGrades, setSelectedGrades] = useState<GradeLevel[]>([]);

    // Check admin status
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    // --- Constants ---
    const typeLabels: Record<ProductType, string> = {
        book: "Tài liệu",
        video: "Video khóa học",
        code: "Source Code",
        ppt: "PowerPoint",
        video_demo: "Video ứng dụng",
        robotics: "Robotics",
    };

    const gradeLabels: Record<GradeLevel, string> = {
        3: "Lớp 3",
        4: "Lớp 4",
        5: "Lớp 5",
    };

    // --- Helpers from Resources.tsx ---
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('docs.google.com') && url.includes('/edit')) {
            return url.replace(/\/edit.*$/, '/embed?start=false&loop=false&delayms=3000');
        }
        if (url.includes('drive.google.com/file/d/') && url.includes('/view')) {
            return url.replace(/\/view.*$/, '/preview');
        }
        if (url.includes('drive.google.com') && !url.includes('preview') && !url.includes('embed')) {
            if (url.endsWith('/')) return url + 'preview';
            return url + '/preview';
        }
        return url;
    };

    const getDriveImageSrc = (url: string) => {
        if (!url) return '';
        if (url.includes('drive.google.com/file/d/') && url.includes('/view')) {
            const idMatch = url.match(/\/d\/(.+?)\//);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
            }
        }
        return url;
    };

    // --- Handlers ---
    const toggleType = (type: ProductType) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const toggleGrade = (grade: GradeLevel) => {
        setSelectedGrades((prev) =>
            prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
        );
    };

    // --- Hooks ---
    const { addToCart } = useCart();

    // --- Handlers ---
    const handleAddToCart = (product: any) => {
        addToCart(product);
    };

    // --- Filtering & Sorting Logic ---
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by Type
        if (selectedTypes.length > 0) {
            result = result.filter((p) => p.type.some(t => selectedTypes.includes(t)));
        }

        // Filter by Grade
        if (selectedGrades.length > 0) {
            result = result.filter((p) => selectedGrades.includes(p.grade));
        }

        // Sort by Price
        if (sortOrder === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [selectedTypes, selectedGrades, sortOrder]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                        Tất cả <span className="text-primary">Sản phẩm</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Khám phá kho học liệu khổng lồ dành cho Scratch và STEM
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* --- Sidebar Filters --- */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        {/* Filter Group: Loại tài liệu */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Loại tài liệu
                            </h3>
                            <div className="space-y-3">
                                {(Object.keys(typeLabels) as ProductType[]).map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`type-${type}`}
                                            checked={selectedTypes.includes(type)}
                                            onCheckedChange={() => toggleType(type)}
                                        />
                                        <Label
                                            htmlFor={`type-${type}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {typeLabels[type]}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filter Group: Lớp */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Lớp học
                            </h3>
                            <div className="space-y-3">
                                {[3, 4, 5].map((grade) => (
                                    <div key={grade} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`grade-${grade}`}
                                            checked={selectedGrades.includes(grade as GradeLevel)}
                                            onCheckedChange={() => toggleGrade(grade as GradeLevel)}
                                        />
                                        <Label
                                            htmlFor={`grade-${grade}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {gradeLabels[grade as GradeLevel]}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* --- Main Content --- */}
                    <div className="flex-grow">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-sm text-muted-foreground font-medium">
                                Hiển thị <span className="text-foreground font-bold">{filteredProducts.length}</span> sản phẩm
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold whitespace-nowrap">Sắp xếp theo:</span>
                                <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Mặc định" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Mặc định</SelectItem>
                                        <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
                                        <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="space-y-12">
                                {(Object.keys(typeLabels) as ProductType[]).map((type) => {
                                    const groupProducts = filteredProducts.filter(p => p.type.includes(type));
                                    if (groupProducts.length === 0) return null;

                                    return (
                                        <div key={type} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="h-8 w-1 bg-primary rounded-full"></div>
                                                <h2 className="text-2xl font-bold text-slate-800">
                                                    {typeLabels[type]}
                                                    <span className="ml-2 text-base font-medium text-slate-400">
                                                        ({groupProducts.length})
                                                    </span>
                                                </h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {groupProducts.map((product, index) => (
                                                    <motion.div
                                                        key={`${type}-${product.id}`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                                    >
                                                        {/* Thumbnail */}
                                                        <div className="relative aspect-video bg-white overflow-hidden border-b border-slate-100">
                                                            <img
                                                                src={getDriveImageSrc(product.image)}
                                                                alt={product.title}
                                                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute top-2 right-2 bg-slate-900/10 px-2 py-1 rounded text-xs font-bold shadow-sm backdrop-blur-sm">
                                                                {gradeLabels[product.grade]}
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="p-4 flex flex-col flex-grow">
                                                            <div className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">
                                                                {product.type.map(t => typeLabels[t]).join(" + ")}
                                                            </div>
                                                            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2" title={product.title}>
                                                                {product.title}
                                                            </h3>

                                                            {product.description && (
                                                                <p className="text-sm text-slate-500 mb-3 line-clamp-3">
                                                                    {product.description}
                                                                </p>
                                                            )}

                                                            <div className="flex items-center gap-1 mb-4">
                                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="font-semibold text-sm">{product.rating}</span>
                                                                <span className="text-xs text-muted-foreground">({product.reviews} đánh giá)</span>
                                                            </div>

                                                            <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-shrink-0">
                                                                        <div className="text-lg font-black text-red-500">
                                                                            {product.price.toLocaleString('vi-VN')}đ
                                                                        </div>
                                                                        {product.originalPrice && (
                                                                            <div className="text-xs text-muted-foreground line-through">
                                                                                {product.originalPrice.toLocaleString('vi-VN')}đ
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {isAdmin ? (
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-muted-foreground hover:text-primary"
                                                                                >
                                                                                    <Eye className="w-4 h-4 mr-1" /> Xem trước
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-black/95 border-none">
                                                                                <div className="p-4 flex justify-between items-center text-white bg-white/10 backdrop-blur-sm z-10 absolute w-full top-0 left-0">
                                                                                    <h3 className="font-semibold truncate pr-8">{product.title}</h3>
                                                                                </div>
                                                                                <div className="flex-grow w-full h-full pt-14 pb-4 px-4 flex items-center justify-center">
                                                                                    <iframe
                                                                                        src={getEmbedUrl(product.previewUrl)}
                                                                                        className="w-full h-full rounded-lg bg-white"
                                                                                        allow="autoplay"
                                                                                        title="Preview"
                                                                                    ></iframe>
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    ) : (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-muted-foreground hover:text-primary"
                                                                            onClick={() => toast.error("Vui lòng thanh toán trước khi xem")}
                                                                        >
                                                                            <Eye className="w-4 h-4 mr-1" /> Xem trước
                                                                        </Button>
                                                                    )}
                                                                </div>

                                                                <Button
                                                                    size="sm"
                                                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                                                    onClick={() => handleAddToCart(product)}
                                                                >
                                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                                    Thêm vào giỏ
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-700">Không tìm thấy sản phẩm nào</h3>
                                <p className="text-muted-foreground">Vui lòng thử bỏ chọn các bộ lọc để xem nhiều kết quả hơn.</p>
                                <Button
                                    variant="link"
                                    className="mt-2 text-primary"
                                    onClick={() => { setSelectedTypes([]); setSelectedGrades([]); }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main >
            <Footer />
        </div >
    );
};

export default AllProducts;
