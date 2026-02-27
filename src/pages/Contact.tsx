import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Building2 } from "lucide-react";
import imgTQU from "@/assets/DH_TAN_TRAO.jpg";
import imgXuanQuynh from "@/assets/Xuan_Quynh.jpg";
import imgThanh from "@/assets/Thanh.jpg";

const Contact = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-orange-50 to-yellow-50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                                Liên hệ <span className="text-primary">với chúng tôi</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 font-medium italic max-w-3xl mx-auto">
                                "Học lập trình sớm - mở rộng cánh cửa tương lai"
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-16 space-y-20">
                    {/* Organization Section */}
                    <motion.section {...fadeIn} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="bg-slate-50 p-8 md:p-12 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-bold w-fit mb-6">
                                    <Building2 className="w-4 h-4" />
                                    <span>Tổ chức</span>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">Trường Đại học Tân Trào</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Địa chỉ</p>
                                            <p className="text-slate-600">KM6 - Trung Môn - Yên Sơn - Tuyên Quang</p>
                                        </div>
                                    </div>
                                    {/* Additional info placeholder if needed */}
                                </div>
                            </div>
                            <div className="h-64 md:h-auto">
                                <img
                                    src={imgTQU}
                                    alt="Trường Đại học Tân Trào"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Founders Section */}
                    <section>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Đội ngũ sáng lập</h2>
                            <p className="text-slate-600">Những người tâm huyết xây dựng nền tảng Scratch Kid TQU</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Personal 1: Xuan Quynh */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
                                        <img src={imgXuanQuynh} alt="Xuân Quỳnh" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-1">Xuân Quỳnh</h3>
                                        <p className="text-primary font-medium mb-4">Người sáng lập</p>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                                                <Phone className="w-4 h-4" />
                                                <span>0901234567</span>
                                            </div>
                                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                                                <Mail className="w-4 h-4" />
                                                <a href="mailto:XQ-Scratch@TQU.vn" className="hover:text-primary transition-colors">
                                                    XQ-Scratch@TQU.vn
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Personal 2: Hua Thanh */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
                                        <img src={imgThanh} alt="Hứa Thành" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-1">Hứa Thành</h3>
                                        <p className="text-blue-600 font-medium mb-4">Người sáng lập</p>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                                                <Phone className="w-4 h-4" />
                                                <span>0987654321</span>
                                            </div>
                                            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                                                <Mail className="w-4 h-4" />
                                                <a href="mailto:HT-Scratch@TQU.vn" className="hover:text-primary transition-colors">
                                                    HT-Scratch@TQU.vn
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
