import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    requireAuth?: boolean;
}

/**
 * Bảo vệ route theo role.
 * - requireAuth = true (default): yêu cầu đăng nhập
 * - allowedRoles: chỉ cho phép các role trong danh sách
 */
const ProtectedRoute = ({
    children,
    allowedRoles,
    requireAuth = true,
}: ProtectedRouteProps) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Check authentication
    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    // Check role authorization
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        Không có quyền truy cập
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Tài khoản của bạn không có quyền truy cập trang này.
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                        Về trang chủ
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
