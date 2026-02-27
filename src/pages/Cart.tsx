import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Trash2, ShoppingBag, Minus, Plus, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
    const { items, removeFromCart, updateQuantity, itemCount, totalAmount, clearCart, loading } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        if (!user && !loading) {
            navigate("/login");
        } else if (user) {
            // Fetch profile for phone number
            const fetchProfile = async () => {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setUserProfile(data);
            };
            fetchProfile();
        }
    }, [user, navigate, loading]);

    const handleCheckoutClick = () => {
        if (items.length === 0) return;
        setIsPaymentOpen(true);
    };

    const handleConfirmPayment = async () => {
        setProcessing(true);
        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user?.id,
                    total_amount: totalAmount,
                    status: 'pending' // Chờ xác nhận
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                price: item.price,
                quantity: item.quantity
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Clear Cart
            await clearCart();
            setIsPaymentOpen(false);

            toast.success("Đã tạo đơn hàng thành công!", {
                description: "Chúng tôi sẽ kiểm tra thanh toán và kích hoạt tài liệu cho bạn sớm nhất."
            });

            navigate("/ho-so");
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
        } finally {
            setProcessing(false);
        }
    };

    // Helper to extract image safely (handles local assets vs strings)
    const getProductImage = (item: any) => {
        if (typeof item.image === 'string') return item.image;
        return ''; // Handle imports if they are objects, but typically handled by Vite imports as strings
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Đang tải...</div>;
    }

    const transferContent = `${userProfile?.phone || "SDT"} ${userProfile?.full_name || "TEN"}`;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                    Giỏ hàng của bạn
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <ShoppingBag className="w-20 h-20 mx-auto text-slate-200 mb-6" />
                        <h2 className="text-2xl font-bold text-slate-700 mb-2">Giỏ hàng trống</h2>
                        <p className="text-muted-foreground mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                        <Link to="/tat-ca-san-pham">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Khám phá sản phẩm ngay
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
                                    <div className="w-24 h-24 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 relative">
                                        <img
                                            src={getProductImage(item)}
                                            alt={item.title}
                                            className="w-full h-full object-contain p-1"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 line-clamp-2">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">{Array.isArray(item.type) ? item.type[0] : item.type}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-md bg-white shadow-sm hover:scale-105 transition-transform"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-md bg-white shadow-sm hover:scale-105 transition-transform"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <div className="font-black text-lg text-primary">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 border-slate-200 shadow-md">
                                <CardHeader className="bg-slate-50/50 pb-4">
                                    <CardTitle>Tổng đơn hàng</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Số lượng sản phẩm:</span>
                                        <span className="font-bold">{itemCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Tạm tính:</span>
                                        <span className="font-medium">{totalAmount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-bold text-slate-800">Thành tiền:</span>
                                        <span className="font-black text-2xl text-primary">{totalAmount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                        onClick={handleCheckoutClick}
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" /> Thanh toán ngay
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </main>

            {/* Payment Dialog */}
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center">Thông tin thanh toán</DialogTitle>
                        <DialogDescription className="text-center">
                            Vui lòng chuyển khoản theo thông tin dưới đây để hoàn tất đơn hàng.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        {/* Bank Info */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-sm">Ngân hàng:</span>
                                <span className="font-bold text-slate-800">MB Bank (Quân Đội)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-sm">Số tài khoản:</span>
                                <span className="font-black text-xl text-primary tracking-widest">0901234567</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-sm">Chủ tài khoản:</span>
                                <span className="font-bold text-slate-800 text-uppercase">NGUYEN VAN A</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Số tiền:</span>
                                <span className="font-black text-xl text-red-500">{totalAmount.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>

                        {/* Transfer Content */}
                        <div className="space-y-2">
                            <p className="text-sm text-center text-slate-500">Nội dung chuyển khoản (Bắt buộc):</p>
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-center font-mono font-bold text-lg text-yellow-800 select-all cursor-text">
                                {transferContent}
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                                Hãy nhập chính xác nội dung này để hệ thống tự động xử lý.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
                            onClick={handleConfirmPayment}
                            disabled={processing}
                        >
                            {processing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {processing ? "Đang xử lý..." : "Tôi đã chuyển khoản"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsPaymentOpen(false)}
                            className="w-full"
                        >
                            Để sau
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Cart;
