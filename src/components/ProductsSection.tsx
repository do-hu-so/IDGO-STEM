import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Star, Play, Eye, Loader2 } from "lucide-react";
import { useProducts, typeLabels, gradeLabels } from "@/hooks/useProducts";
import { useCanPreview } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { downloadFile } from "@/lib/download";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const ProductsSection = () => {
    const navigate = useNavigate();
    const canPreview = useCanPreview();
    const { data: products = [], isLoading } = useProducts({ publishedOnly: true });

    // Lấy tối đa 4 sản phẩm nổi bật
    const featuredProducts = products.slice(0, 4);

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

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('docs.google.com') && url.includes('/edit')) {
            return url.replace(/\/edit.*$/, '/embed?start=false&loop=false&delayms=3000');
        }
        if (url.includes('drive.google.com/file/d/') && url.includes('/view')) {
            return url.replace(/\/view.*$/, '/preview');
        }
        return url;
    };

    return (
        <section id="products" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        Sản phẩm <span className="text-primary">nổi bật</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Sách, video và tài liệu học lập trình Scratch chất lượng cao
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : featuredProducts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Chưa có sản phẩm nào.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                                    {/* Image */}
                                    <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                                        <img
                                            src={getDriveImageSrc(product.thumbnail_url)}
                                            alt={product.title}
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x500?text=STEM';
                                            }}
                                        />
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-primary-foreground text-xs font-bold rounded-full">
                                            Hot
                                        </div>
                                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            {(product.preview_url || product.file_url) ? (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="secondary" size="icon" className="rounded-full">
                                                            <Play className="w-5 h-5" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-black/95 border-none">
                                                        <div className="p-4 text-white bg-white/10 backdrop-blur-sm z-10 absolute w-full top-0 left-0">
                                                            <h3 className="font-semibold truncate pr-8">{product.title}</h3>
                                                        </div>
                                                        <div className="flex-grow w-full h-full pt-14 pb-4 px-4">
                                                            <iframe src={getEmbedUrl(product.preview_url || product.file_url)} className="w-full h-full rounded-lg bg-white" title="Preview"></iframe>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
                                                <Button variant="secondary" size="icon" className="rounded-full" onClick={() => toast.info("Sản phẩm này chưa có bản xem trước")}>
                                                    <Play className="w-5 h-5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-grow flex flex-col">
                                        <p className="text-xs text-muted-foreground mb-1">
                                            {typeLabels[product.type]}
                                        </p>
                                        <h3 className="font-bold mb-2 line-clamp-2">{product.title}</h3>

                                        <div className="flex items-center gap-1 mb-3">
                                            <Star className="w-4 h-4 fill-accent text-accent" />
                                            <span className="font-semibold text-sm">{product.rating}</span>
                                            <span className="text-muted-foreground text-sm">({product.reviews_count})</span>
                                        </div>

                                        <div className="mt-auto"></div>

                                        <div className="flex gap-2">
                                            {(product.download_url || product.file_url) ? (
                                                <Button 
                                                    className="flex-1 cursor-pointer" 
                                                    size="sm" 
                                                    onClick={() => downloadFile(product.download_url || product.file_url!, product.title)}
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Tải xuống
                                                </Button>
                                            ) : (
                                                <Button className="flex-1" size="sm" onClick={() => navigate("/tat-ca-san-pham")}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Xem chi tiết
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Button variant="outline" size="lg" onClick={() => navigate('/tat-ca-san-pham')}>
                        Xem tất cả sản phẩm
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default ProductsSection;
