import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Download, Star, Play } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

// Select top products to show (e.g., first 4 or specific IDs)
// Select top products to show (one from each grade + robotics)
const p3 = products.find(p => p.grade === 3 && p.type.includes('book'));
const p4 = products.find(p => p.grade === 4 && p.type.includes('book'));
const p5 = products.find(p => p.grade === 5 && p.type.includes('book'));
const pRobo = products.find(p => p.type.includes('robotics'));

const featuredProducts = [p3, p4, p5, pRobo].filter((p): p is typeof products[0] => !!p).map(p => ({
  ...p,
  badge: p.id.includes('combo') ? "Tiết kiệm" : "Hot",
  badgeColor: p.id.includes('combo') ? "bg-purple-500" : "bg-red-500"
}));

const ProductsSection = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyClick = (product: any) => {
    addToCart(product);
  };

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Sản phẩm <span className="text-primary">nổi bật</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sách, video và tài liệu học lập trình Scratch chất lượng cao
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                {/* Image */}
                <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-3 left-3 px-3 py-1 ${product.badgeColor} text-primary-foreground text-xs font-bold rounded-full`}>
                    {product.badge}
                  </div>
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="icon" className="rounded-full">
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-grow flex flex-col">
                  <p className="text-xs text-muted-foreground mb-1">
                    {Array.isArray(product.type) ? product.type.join(" + ") : product.type}
                  </p>
                  <h3 className="font-bold mb-2 line-clamp-2">{product.title}</h3>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold text-sm">{product.rating}</span>
                    <span className="text-muted-foreground text-sm">({product.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <span className="text-lg font-black text-primary">{product.price.toLocaleString('vi-VN')}đ</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm" onClick={() => handleBuyClick(product)}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Mua ngay
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '/tat-ca-san-pham'} // Simple navigation for now, or use Link if already imported
          >
            Xem tất cả sản phẩm
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
