import { useAllProducts } from "@/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Users, TrendingUp, FileText } from "lucide-react";

const Dashboard = () => {
    const { data: products = [] } = useAllProducts();

    const { data: profiles = [] } = useQuery({
        queryKey: ["admin-profiles"],
        queryFn: async () => {
            const { data, error } = await supabase.from("profiles").select("id, role");
            if (error) throw error;
            return data || [];
        },
    });

    const stats = [
        {
            label: "Tổng sản phẩm",
            value: products.length,
            icon: Package,
            color: "bg-blue-500",
            bgLight: "bg-blue-50",
        },
        {
            label: "Đã xuất bản",
            value: products.filter((p) => p.is_published).length,
            icon: FileText,
            color: "bg-green-500",
            bgLight: "bg-green-50",
        },
        {
            label: "Tổng tài khoản",
            value: profiles.length,
            icon: Users,
            color: "bg-purple-500",
            bgLight: "bg-purple-50",
        },
        {
            label: "Giảng viên",
            value: profiles.filter((p: any) => p.role === "teacher").length,
            icon: TrendingUp,
            color: "bg-orange-500",
            bgLight: "bg-orange-50",
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-black text-slate-800 mb-6">Tổng quan hệ thống</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`${stat.bgLight} rounded-2xl p-6 border border-slate-100 shadow-sm`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-800">{stat.value}</div>
                        <div className="text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Sản phẩm gần đây</h2>
                {products.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Chưa có sản phẩm nào trong database.</p>
                ) : (
                    <div className="space-y-3">
                        {products.slice(0, 5).map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {product.type.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800 line-clamp-1">{product.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Lớp {product.grade} • {product.type}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                        product.is_published
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {product.is_published ? "Xuất bản" : "Nháp"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
