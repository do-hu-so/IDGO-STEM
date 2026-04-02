import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AllProducts from "./pages/AllProducts";
import AllResources from "./pages/AllResources";
import Resources from "./pages/Resources";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import TeacherUpload from "./pages/TeacherUpload";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProducts";
import ProductForm from "./pages/admin/ProductForm";
import ProtectedRoute from "./components/ProtectedRoute";
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
                            {/* Public Routes */}
                            <Route path="/" element={<Index />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/verify-email" element={<VerifyEmail />} />
                            <Route path="/tat-ca-san-pham" element={<AllProducts />} />
                            <Route path="/tai-lieu-tong-hop" element={<AllResources />} />
                            <Route path="/tai-nguyen/:category/:type" element={<Resources />} />
                            <Route path="/gioi-thieu" element={<AboutUs />} />
                            <Route path="/lien-he" element={<Contact />} />

                            {/* Auth-required Routes */}
                            <Route path="/gio-hang" element={<Cart />} />
                            <Route path="/ho-so" element={<Profile />} />

                            {/* Teacher Routes */}
                            <Route
                                path="/giang-vien/upload"
                                element={
                                    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                                        <TeacherUpload />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <AdminLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Dashboard />} />
                                <Route path="users" element={<ManageUsers />} />
                                <Route path="products" element={<ManageProducts />} />
                                <Route path="products/new" element={<ProductForm />} />
                                <Route path="products/:id/edit" element={<ProductForm />} />
                            </Route>

                            {/* Catch-all */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
