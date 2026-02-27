import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, MapPin, Package, Phone, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
}

interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
}

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        full_name: "",
        avatar_url: "",
        email: "",
        phone: "",
        address: ""
    });
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchProfile();
        fetchOrders();
    }, [user, navigate]);

    const fetchProfile = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            if (data) {
                setProfile({
                    full_name: data.full_name,
                    avatar_url: data.avatar_url,
                    email: data.email, // Read from profile table as configured
                    phone: data.phone || "",
                    address: data.address || ""
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Không thể tải thông tin cá nhân");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        if (!user) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    phone: profile.phone,
                    address: profile.address
                })
                .eq('id', user.id);

            if (error) throw error;
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Lỗi khi cập nhật hồ sơ");
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const initials = profile.full_name?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || "U";

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="w-24 h-24 border-4 border-primary/10">
                            <AvatarImage src={profile.avatar_url || ""} />
                            <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-2xl font-bold text-slate-800">{profile.full_name || "Chưa đặt tên"}</h1>
                            <p className="text-muted-foreground">{profile.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                                <span className="inline-flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                    <Package className="w-3 h-3 mr-1" /> {orders.length} Đơn hàng
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                        </Button>
                    </div>

                    <Tabs defaultValue="info" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                            <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
                            <TabsTrigger value="orders">Lịch sử mua hàng</TabsTrigger>
                        </TabsList>

                        {/* INFO TAB */}
                        <TabsContent value="info">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin cá nhân</CardTitle>
                                    <CardDescription>
                                        Cập nhật thông tin liên hệ của bạn để việc giao hàng thuận tiện hơn.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Họ và tên</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="name"
                                                        value={profile.full_name || ""}
                                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Số điện thoại</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="phone"
                                                        value={profile.phone || ""}
                                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                        placeholder="0912..."
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Địa chỉ giao hàng</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="address"
                                                    value={profile.address || ""}
                                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                                    placeholder="Số nhà, đường, phường/xã..."
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={updating}>
                                                {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                Lưu thay đổi
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ORDERS TAB */}
                        <TabsContent value="orders">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Đơn hàng đã mua</CardTitle>
                                    <CardDescription>Danh sách các sản phẩm bạn đã đặt mua.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Bạn chưa có đơn hàng nào.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                                    <div>
                                                        <p className="font-semibold text-sm text-slate-900">Mã đơn: {order.id.slice(0, 8).toUpperCase()}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-primary">{Math.floor(order.total_amount).toLocaleString('vi-VN')}đ</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status === 'paid' ? 'Đã thanh toán' :
                                                                order.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
