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
import { LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserNav() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const handleLogout = async () => {
        if (isAdmin) {
            localStorage.removeItem("isAdmin");
            navigate("/");
            window.location.reload(); // Refresh to clear state properly
            return;
        }
        await signOut();
        navigate("/");
    };

    if (!user && !isAdmin) {
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

    const email = isAdmin ? "adminidgostem" : (user?.email || "");
    const initials = isAdmin ? "AD" : (email.slice(0, 2).toUpperCase() || "U");
    const fullName = isAdmin ? "Quản trị viên" : (user?.user_metadata?.full_name || "User");
    const avatarUrl = isAdmin ? "" : user?.user_metadata?.avatar_url;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={email} />}
                        <AvatarFallback className={isAdmin ? "bg-primary text-white" : ""}>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/ho-so")} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Hồ sơ</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
