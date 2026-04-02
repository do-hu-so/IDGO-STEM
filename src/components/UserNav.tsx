import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, LayoutDashboard, Upload, Shield, GraduationCap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roleBadge: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    admin: { label: "Admin", color: "bg-red-100 text-red-700", icon: <Shield className="w-3 h-3" /> },
    teacher: { label: "Giảng viên", color: "bg-blue-100 text-blue-700", icon: <GraduationCap className="w-3 h-3" /> },
    student: { label: "Học sinh", color: "bg-green-100 text-green-700", icon: <BookOpen className="w-3 h-3" /> },
};

export function UserNav() {
    const { user, role, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                    Đăng nhập
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                    Đăng ký
                </Button>
            </div>
        );
    }

    const email = user.email || "";
    const initials = email.slice(0, 2).toUpperCase() || "U";
    const fullName = user.user_metadata?.full_name || "User";
    const avatarUrl = user.user_metadata?.avatar_url;
    const badge = roleBadge[role || "student"];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={email} />}
                        <AvatarFallback className={role === "admin" ? "bg-red-500 text-white" : role === "teacher" ? "bg-blue-500 text-white" : ""}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none">{fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                        {badge && (
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${badge.color}`}>
                                {badge.icon}
                                {badge.label}
                            </span>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/ho-so")} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Hồ sơ</span>
                    </DropdownMenuItem>

                    {role === "admin" && (
                        <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                    )}

                    {(role === "teacher" || role === "admin") && (
                        <DropdownMenuItem onClick={() => navigate("/giang-vien/upload")} className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Upload sản phẩm</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
