import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LessonPlans from "./pages/LessonPlans";
import PowerPointSlides from "./pages/PowerPointSlides";
import TutorialVideos from "./pages/TutorialVideos";
import AllResources from "./pages/AllResources";
import AllProducts from "./pages/AllProducts";
import Resources from "./pages/Resources";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/gio-hang" element={<Cart />} />
              <Route path="/ho-so" element={<Profile />} />
              <Route path="/giao-an" element={<LessonPlans />} />
              <Route path="/slide-powerpoint" element={<PowerPointSlides />} />
              <Route path="/video-huong-dan" element={<TutorialVideos />} />
              <Route path="/tai-lieu-tong-hop" element={<AllResources />} />
              <Route path="/tat-ca-san-pham" element={<AllProducts />} />
              <Route path="/tai-nguyen/:category/:type" element={<Resources />} />
              <Route path="/gioi-thieu" element={<AboutUs />} />
              <Route path="/lien-he" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
