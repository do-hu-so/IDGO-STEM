import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { Product } from "@/data/products";
import { products as allProducts } from "@/data/products";
import { toast } from "sonner";

export interface CartItem extends Product {
    quantity: number;
    cart_item_id?: string; // ID from Supabase table
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    itemCount: number;
    totalAmount: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: async () => { },
    removeFromCart: async () => { },
    updateQuantity: async () => { },
    clearCart: async () => { },
    itemCount: 0,
    totalAmount: 0,
    loading: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch cart from Supabase when user logs in
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .select('*');

            if (error) throw error;

            if (data) {
                // Map Supabase Cart Items to Full Product Details
                const mappedItems: CartItem[] = data.map(dbItem => {
                    const product = allProducts.find(p => p.id === dbItem.product_id);
                    if (!product) return null;
                    return {
                        ...product,
                        quantity: dbItem.quantity,
                        cart_item_id: dbItem.id
                    };
                }).filter((item): item is CartItem => item !== null);

                setItems(mappedItems);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product: Product) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }

        const existingItem = items.find(item => item.id === product.id);

        try {
            if (existingItem) {
                // Update local State
                const newQuantity = existingItem.quantity + 1;
                setItems(prev => prev.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                ));

                // Sync with DB
                const { error } = await supabase
                    .from('cart_items')
                    .update({ quantity: newQuantity })
                    .eq('id', existingItem.cart_item_id);

                if (error) throw error;
                toast.success("Đã cập nhật số lượng trong giỏ hàng");
            } else {
                // Add to DB first to get ID
                const { data, error } = await supabase
                    .from('cart_items')
                    .insert({ user_id: user.id, product_id: product.id, quantity: 1 })
                    .select()
                    .single();

                if (error) throw error;

                // Update local state
                if (data) {
                    setItems(prev => [...prev, { ...product, quantity: 1, cart_item_id: data.id }]);
                    toast.success("Đã thêm vào giỏ hàng");
                }
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Lỗi khi thêm vào giỏ hàng");
            // Revert fetch on error if needed
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
                .eq('id', currentItem.cart_item_id); // Use cart_item_id for deletion

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
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalAmount, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
