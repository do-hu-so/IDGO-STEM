import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    DialogDescription,
    DialogFooter,
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
import { Loader2, Plus, Search, Shield, GraduationCap, BookOpen, Trash2 } from "lucide-react";
import type { UserRole } from "@/context/AuthContext";

interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
    created_at: string;
}

const roleConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    admin: { label: "Admin", color: "bg-red-100 text-red-700", icon: <Shield className="w-3 h-3" /> },
    teacher: { label: "Giảng viên", color: "bg-blue-100 text-blue-700", icon: <GraduationCap className="w-3 h-3" /> },
    student: { label: "Học sinh", color: "bg-green-100 text-green-700", icon: <BookOpen className="w-3 h-3" /> },
};

const ManageUsers = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newFullName, setNewFullName] = useState("");
    const [newRole, setNewRole] = useState<UserRole>("teacher");
    const [creating, setCreating] = useState(false);

    // Fetch all profiles
    const { data: profiles = [], isLoading } = useQuery({
        queryKey: ["admin-profiles-list"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return (data || []) as Profile[];
        },
    });

    // Update role mutation
    const updateRole = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            const { error } = await supabase
                .from("profiles")
                .update({ role })
                .eq("id", userId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-profiles-list"] });
            toast.success("Đã cập nhật vai trò!");
        },
        onError: (error: Error) => {
            toast.error("Lỗi: " + error.message);
        },
    });

    // Delete user mutation (chỉ xóa profile, Supabase Auth user cần xóa qua Dashboard)
    const deleteUser = useMutation({
        mutationFn: async (userId: string) => {
            const { error } = await supabase
                .from("profiles")
                .delete()
                .eq("id", userId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-profiles-list"] });
            toast.success("Đã xóa tài khoản!");
        },
        onError: (error: Error) => {
            toast.error("Lỗi: " + error.message);
        },
    });

    // Create teacher account
    const handleCreateAccount = async () => {
        if (!newEmail || !newPassword || !newFullName) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setCreating(true);
        try {
            // Tạo user qua Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: newEmail,
                password: newPassword,
                options: {
                    data: { full_name: newFullName },
                },
            });

            if (error) throw error;

            // Cập nhật role cho user mới
            if (data.user) {
                // Đợi 1 giây để trigger tạo profile
                await new Promise((r) => setTimeout(r, 1500));

                const { error: roleError } = await supabase
                    .from("profiles")
                    .update({ role: newRole })
                    .eq("id", data.user.id);

                if (roleError) {
                    console.error("Role update error:", roleError);
                    toast.warning("Tạo tài khoản thành công nhưng chưa gán được role. Hãy gán role thủ công.");
                }
            }

            queryClient.invalidateQueries({ queryKey: ["admin-profiles-list"] });
            toast.success(`Đã tạo tài khoản ${roleConfig[newRole]?.label} thành công!`);
            setIsCreateOpen(false);
            setNewEmail("");
            setNewPassword("");
            setNewFullName("");
            setNewRole("teacher");
        } catch (error: any) {
            toast.error("Lỗi tạo tài khoản: " + error.message);
        } finally {
            setCreating(false);
        }
    };

    // Filtered profiles
    const filtered = profiles.filter(
        (p) =>
            (p.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
            (p.email || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-black text-slate-800">Quản lý tài khoản</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Tạo tài khoản mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo tài khoản mới</DialogTitle>
                            <DialogDescription>
                                Tạo tài khoản cho giảng viên hoặc admin mới. Học sinh tự đăng ký trên trang web.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Họ và tên</Label>
                                <Input
                                    placeholder="Nguyễn Văn A"
                                    value={newFullName}
                                    onChange={(e) => setNewFullName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Mật khẩu</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vai trò</Label>
                                <Select value={newRole} onValueChange={(v: UserRole) => setNewRole(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="teacher">Giảng viên</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleCreateAccount} disabled={creating}>
                                {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Tạo tài khoản
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="pl-9 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Không tìm thấy tài khoản nào.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((profile) => {
                                    const badge = roleConfig[profile.role] || roleConfig.student;
                                    return (
                                        <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-sm text-slate-800">
                                                    {profile.full_name || "Chưa đặt tên"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{profile.email}</td>
                                            <td className="px-6 py-4">
                                                <Select
                                                    value={profile.role}
                                                    onValueChange={(v) =>
                                                        updateRole.mutate({ userId: profile.id, role: v })
                                                    }
                                                >
                                                    <SelectTrigger className="w-[140px] h-8 text-xs">
                                                        <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                                                            {badge.icon}
                                                            {badge.label}
                                                        </span>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="teacher">Giảng viên</SelectItem>
                                                        <SelectItem value="student">Học sinh</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(profile.created_at).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bạn có chắc muốn xóa tài khoản "{profile.full_name || profile.email}"? Hành động này không thể hoàn tác.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-500 hover:bg-red-600"
                                                                onClick={() => deleteUser.mutate(profile.id)}
                                                            >
                                                                Xóa
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
