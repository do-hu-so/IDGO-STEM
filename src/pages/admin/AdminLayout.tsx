import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LayoutDashboard, Users, Package, Plus, Loader2 } from "lucide-react";

const sidebarItems = [
    { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { label: "Quản lý tài khoản", href: "/admin/users", icon: Users },
    { label: "Quản lý sản phẩm", href: "/admin/products", icon: Package },
    { label: "Thêm sản phẩm", href: "/admin/products/new", icon: Plus },
];

const AdminLayout = () => {
    const { user, role, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && (!user || role !== "admin")) {
            navigate("/");
        }
    }, [user, role, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || role !== "admin") return null;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <div className="flex-grow flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 hidden lg:block">
                    <div className="p-6">
                        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-primary" />
                            Admin Panel
                        </h2>
                    </div>
                    <nav className="px-3 space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                                        isActive
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-grow p-6 lg:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminLayout;
