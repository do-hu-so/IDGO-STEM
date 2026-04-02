import { useParams, useNavigate } from "react-router-dom";
import { useProducts, typeLabels, gradeLabels, categoryLabels } from "@/hooks/useProducts";
import type { ProductType, CategoryType, GradeLevel, Product } from "@/hooks/useProducts";
import { useCanPreview } from "@/context/AuthContext";
import { downloadFile } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Download, Eye, FileText, Code, Video, Presentation, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Map URL category param to DB category
const categoryMap: Record<string, CategoryType> = {
    "6-8": "6-8",
    "9-11": "9-11",
    "12-14": "12-14",
    "teacher": "teacher",
};

// Map URL type param to DB type
const typeMap: Record<string, ProductType> = {
    books: "book",
    code: "code",
    videos: "video",
    ppt: "ppt",
    video_demo: "video_demo",
    robotics: "robotics",
};

const sidebarTypeLabels: Record<string, string> = {
    books: "Tài liệu",
    code: "Code mẫu",
    videos: "Video kết quả",
    ppt: "PowerPoint bài giảng",
};

const GRADES: { id: GradeLevel; label: string; color: string; bg: string }[] = [
    { id: 3, label: "Lớp 3 - Khởi động tư duy", color: "text-pink-600", bg: "bg-pink-100" },
    { id: 4, label: "Lớp 4 - Phát triển kỹ năng", color: "text-blue-600", bg: "bg-blue-100" },
    { id: 5, label: "Lớp 5 - Dự án sáng tạo", color: "text-purple-600", bg: "bg-purple-100" },
];

const Resources = () => {
    const { category, type } = useParams<{ category: string; type: string }>();
    const navigate = useNavigate();
    const canPreview = useCanPreview();

    const activeCategory = category || "6-8";
    const activeType = type || "books";
    const dbType = typeMap[activeType] || "book";
    const dbCategory = categoryMap[activeCategory] as CategoryType | undefined;

    const [activeTab, setActiveTab] = useState<string>("3");

    // Fetch products from DB
    const { data: allProducts = [], isLoading } = useProducts({
        publishedOnly: true,
    });

    // Filter products
    const filteredProducts = allProducts.filter((p) => {
        if (activeCategory === "teacher") {
            return p.type === dbType; // teacher view: show all grades for this type
        }
        return p.type === dbType && p.category === dbCategory;
    });

    const handleTabChange = (value: string) => {
        if (["3", "4", "5"].includes(value)) {
            setActiveTab(value);
        } else {
            navigate(`/tai-nguyen/${activeCategory}/${value}`);
        }
    };

    const getIcon = (t: string) => {
        switch (t) {
            case "books": return <FileText className="w-4 h-4 mr-2" />;
            case "code": return <Code className="w-4 h-4 mr-2" />;
            case "videos": return <Video className="w-4 h-4 mr-2" />;
            case "ppt": return <Presentation className="w-4 h-4 mr-2" />;
            default: return <FileText className="w-4 h-4 mr-2" />;
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeCategory, activeType]);

    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        if (url.includes("docs.google.com") && url.includes("/edit")) {
            return url.replace(/\/edit.*$/, "/embed?start=false&loop=false&delayms=3000");
        }
        if (url.includes("drive.google.com/file/d/") && url.includes("/view")) {
            return url.replace(/\/view.*$/, "/preview");
        }
        if (url.includes("drive.google.com") && !url.includes("preview") && !url.includes("embed")) {
            if (url.endsWith("/")) return url + "preview";
            return url + "/preview";
        }
        return url;
    };

    const getDriveImageSrc = (url: string) => {
        if (!url) return "";
        if (url.includes("drive.google.com/file/d/") && url.includes("/view")) {
            const idMatch = url.match(/\/d\/(.+?)\//);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
            }
        }
        return url;
    };

    const ResourceCard = ({ item, index }: { item: Product; index: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200 group">
                <div className="aspect-video bg-white relative overflow-hidden border-b">
                    <img
                        src={getDriveImageSrc(item.thumbnail_url)}
                        alt={item.title}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image";
                        }}
                    />
                    <div className="absolute top-2 right-2 bg-slate-100/90 px-2 py-1 rounded text-xs font-bold shadow-sm border">
                        {typeLabels[item.type]}
                    </div>
                </div>

                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg line-clamp-2 leading-tight">{item.title}</CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                </CardContent>

                <CardFooter className="p-4 pt-0 gap-2">
                    {(item.preview_url || item.file_url) ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1 gap-2 hover:border-primary hover:text-primary">
                                    <Eye className="w-4 h-4" /> Xem trước
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-black/95 border-none">
                                <div className="p-4 flex justify-between items-center text-white bg-white/10 backdrop-blur-sm z-10 absolute w-full top-0 left-0">
                                    <h3 className="font-semibold truncate pr-8">{item.title}</h3>
                                </div>
                                <div className="flex-grow w-full h-full pt-14 pb-4 px-4 flex items-center justify-center">
                                    <iframe
                                        src={getEmbedUrl(item.preview_url || item.file_url)}
                                        className="w-full h-full rounded-lg bg-white"
                                        allow="autoplay"
                                        title="Preview"
                                    ></iframe>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Button
                            variant="outline"
                            className="flex-1 gap-2 hover:border-primary hover:text-primary"
                            onClick={() => toast.info("Tài liệu này chưa có bản xem trước")}
                        >
                            <Eye className="w-4 h-4" /> Xem trước
                        </Button>
                    )}

                    {(item.download_url || item.file_url) && (
                        <Button 
                            className="flex-1 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground cursor-pointer" 
                            onClick={() => downloadFile(item.download_url || item.file_url!, item.title)}
                        >
                            <Download className="w-4 h-4" /> Tải xuống
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Button variant="ghost" className="mb-6 hover:bg-slate-200" onClick={() => navigate("/")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại trang chủ
                </Button>

                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                        Kho tài nguyên{" "}
                        <span className={`text-primary ${activeCategory === "teacher" ? "text-purple-600" : ""}`}>
                            {categoryLabels[activeCategory as CategoryType] || activeCategory}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg">Khám phá các tài liệu, bài giảng và video thú vị!</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 px-2">Danh mục</h3>
                            <div className="flex flex-col gap-2">
                                {Object.entries(sidebarTypeLabels).map(([t, label]) => (
                                    <Button
                                        key={t}
                                        variant={activeType === t ? "default" : "ghost"}
                                        className={`justify-start w-full transition-all ${
                                            activeType === t
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "hover:bg-slate-100 hover:pl-6"
                                        }`}
                                        onClick={() => handleTabChange(t)}
                                    >
                                        {getIcon(t)}
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : activeCategory === "teacher" ? (
                            <Tabs defaultValue="3" className="w-full" onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 bg-slate-200/50 rounded-xl">
                                    {GRADES.map((grade) => (
                                        <TabsTrigger
                                            key={grade.id}
                                            value={String(grade.id)}
                                            className="text-md py-3 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all rounded-lg"
                                        >
                                            <span className="hidden md:inline">{grade.label}</span>
                                            <span className="md:hidden">{grade.label.split(" - ")[0]}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {GRADES.map((grade) => (
                                    <TabsContent key={grade.id} value={String(grade.id)} className="mt-0 space-y-6">
                                        <div className={`p-4 rounded-xl ${grade.bg} mb-6 flex items-center`}>
                                            <span className="text-2xl mr-3">📚</span>
                                            <div>
                                                <h3 className={`font-bold text-lg ${grade.color}`}>{grade.label}</h3>
                                                <p className="text-sm opacity-80">Tài liệu chuyên biệt dành cho {grade.label}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredProducts.filter((r) => r.grade === grade.id).length > 0 ? (
                                                filteredProducts
                                                    .filter((r) => r.grade === grade.id)
                                                    .map((item, index) => <ResourceCard key={item.id} item={item} index={index} />)
                                            ) : (
                                                <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed">
                                                    <p className="text-muted-foreground">Chưa có tài liệu cho {grade.label}</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        ) : (
                            <>
                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-20 bg-white rounded-xl border border-dashed text-muted-foreground">
                                        Chưa có tài liệu nào trong mục này.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredProducts.map((item, index) => (
                                            <ResourceCard key={item.id} item={item} index={index} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Resources;
