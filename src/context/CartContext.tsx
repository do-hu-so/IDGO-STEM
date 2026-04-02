import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface CartItem {
    id: string;
    product_id: string;
    title: string;
    type: string;
    image: string;
    quantity: number;
    cart_item_id?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: { id: string; title: string; type: string; thumbnail_url?: string }) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    itemCount: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: async () => { },
    removeFromCart: async () => { },
    updateQuantity: async () => { },
    clearCart: async () => { },
    itemCount: 0,
    loading: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .select('*');

            if (error) throw error;

            if (data) {
                const mappedItems: CartItem[] = data.map((dbItem: any) => ({
                    id: dbItem.product_id,
                    product_id: dbItem.product_id,
                    title: dbItem.product_id, // Will be resolved later
                    type: '',
                    image: '',
                    quantity: dbItem.quantity,
                    cart_item_id: dbItem.id,
                }));
                setItems(mappedItems);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product: { id: string; title: string; type: string; thumbnail_url?: string }) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }

        const existingItem = items.find(item => item.id === product.id);

        try {
            if (existingItem) {
                const newQuantity = existingItem.quantity + 1;
                setItems(prev => prev.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                ));

                const { error } = await supabase
                    .from('cart_items')
                    .update({ quantity: newQuantity })
                    .eq('id', existingItem.cart_item_id);

                if (error) throw error;
                toast.success("Đã cập nhật số lượng");
            } else {
                const { data, error } = await supabase
                    .from('cart_items')
                    .insert({ user_id: user.id, product_id: product.id, quantity: 1 })
                    .select()
                    .single();

                if (error) throw error;

                if (data) {
                    setItems(prev => [...prev, {
                        id: product.id,
                        product_id: product.id,
                        title: product.title,
                        type: product.type,
                        image: product.thumbnail_url || '',
                        quantity: 1,
                        cart_item_id: data.id,
                    }]);
                    toast.success("Đã thêm vào giỏ hàng");
                }
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Lỗi khi thêm vào giỏ hàng");
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!user) return;
        const currentItem = items.find(item => item.id === productId);
        if (!currentItem) return;

        setItems(prev => prev.filter(item => item.id !== productId));

        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', currentItem.cart_item_id);
            if (error) throw error;
        } catch (error) {
            console.error("Error deleting item", error);
            toast.error("Lỗi khi xóa sản phẩm");
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!user || quantity < 1) return;
        const currentItem = items.find(item => item.id === productId);
        if (!currentItem) return;

        setItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));

        try {
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('id', currentItem.cart_item_id);
            if (error) throw error;
        } catch (error) {
            console.error("Error updating quantity", error);
        }
    };

    const clearCart = async () => {
        if (!user) return;
        setItems([]);
        try {
            await supabase.from('cart_items').delete().eq('user_id', user.id);
        } catch (error) {
            console.error("Error clearing cart", error);
        }
    };

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
