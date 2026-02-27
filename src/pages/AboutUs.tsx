import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Code, GraduationCap, Lightbulb, Rocket, Users, Target } from "lucide-react";

const AboutUs = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const containerStagger = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 py-20 lg:py-32">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-6">
                                <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent font-black text-xl uppercase tracking-wider">
                                    Về chúng tôi
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                                Scratch Kid <span className="text-primary">TQU</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                                Nền tảng học tập trực tuyến hỗ trợ dạy học STEM và tư duy lập trình cho học sinh tiểu học.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Introduction Section */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div {...fadeIn}>
                                <h2 className="text-3xl font-bold mb-6 text-slate-800">Khởi nguồn & Sứ mệnh</h2>
                                <div className="prose prose-lg text-slate-600">
                                    <p className="mb-4">
                                        <strong>Scratch Kid TQU</strong> là một nền tảng học tập trực tuyến được xây dựng nhằm hỗ trợ dạy học STEM và làm quen với tư duy lập trình cho học sinh tiểu học thông qua phần mềm Scratch 3.0.
                                    </p>
                                    <p>
                                        Website được phát triển bởi nhóm khởi nghiệp đến từ <strong>Trường Đại học Tân Trào</strong>, với mục tiêu mang công nghệ giáo dục hiện đại đến gần hơn với nhà trường phổ thông, đặc biệt là các cơ sở giáo dục tiểu học.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="aspect-video bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-2xl shadow-xl flex items-center justify-center p-8">
                                    <div className="grid grid-cols-2 gap-4 w-full h-full">
                                        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
                                            <Rocket className="w-10 h-10 text-primary mb-3" />
                                            <span className="font-bold text-slate-700">Khởi nghiệp</span>
                                        </div>
                                        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
                                            <GraduationCap className="w-10 h-10 text-blue-500 mb-3" />
                                            <span className="font-bold text-slate-700">Giáo dục STEM</span>
                                        </div>
                                        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
                                            <Code className="w-10 h-10 text-green-500 mb-3" />
                                            <span className="font-bold text-slate-700">Lập trình Scratch 3.0</span>
                                        </div>
                                        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
                                            <Users className="w-10 h-10 text-purple-500 mb-3" />
                                            <span className="font-bold text-slate-700">ĐH Tân Trào</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="py-16 md:py-24 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="text-center max-w-3xl mx-auto mb-16"
                            {...fadeIn}
                        >
                            <h2 className="text-3xl font-bold mb-4 text-slate-800">Phương pháp tiếp cận</h2>
                            <p className="text-slate-600 text-lg">
                                Nội dung được thiết kế dựa trên tài liệu "Hướng dẫn dạy học STEM với Scratch", tập trung vào trải nghiệm thực tế.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={containerStagger}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <Target className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">Trực quan & Sinh động</h3>
                                <p className="text-slate-600">
                                    Phù hợp với đặc điểm tâm lý lứa tuổi tiểu học. Thay vì đặt nặng lý thuyết, chúng tôi chú trọng hình ảnh và tương tác.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">Học theo chủ đề</h3>
                                <p className="text-slate-600">
                                    Các bài học được xây dựng theo chủ đề, có tính liên kết và nâng cao dần, giúp học sinh tiếp thu kiến thức một cách tự nhiên.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                    <Lightbulb className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">Trải nghiệm & Thực hành</h3>
                                <p className="text-slate-600">
                                    Học sinh học thông qua việc tự tay làm ra sản phẩm, giúp ghi nhớ kiến thức sâu sắc và hứng thú hơn.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Educational Value */}
                <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>


                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">
                            <motion.div {...fadeIn}>
                                <h2 className="text-3xl font-bold mb-8 text-slate-800">Giá trị Giáo dục</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-bold text-primary">1</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">Phát triển tư duy</h4>
                                            <p className="text-slate-600">Hình thành tư duy logic, tư duy sáng tạo và kỹ năng giải quyết vấn đề từ sớm.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-bold text-primary">2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">Hiểu biết công nghệ</h4>
                                            <p className="text-slate-600">Hiểu cách máy tính hoạt động dựa trên các lệnh, tạo nền tảng cho việc học Tin học sau này.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-bold text-primary">3</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">Quy trình STEM khoa học</h4>
                                            <p className="text-slate-600">Xác định vấn đề → Nghiên cứu kiến thức → Đề xuất giải pháp → Thực hành → Trình bày & Đánh giá.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-slate-50 p-8 rounded-3xl border border-slate-100"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-xl font-bold mb-6 text-slate-800">Đối tượng sử dụng</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <span className="font-medium text-slate-700">Giáo viên tiểu học</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                        <Users className="w-5 h-5 text-indigo-500" />
                                        <span className="font-medium text-slate-700">Giáo viên không chuyên Tin học</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                        <Users className="w-5 h-5 text-purple-500" />
                                        <span className="font-medium text-slate-700">Giáo viên phụ trách STEM</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                                        <Users className="w-5 h-5 text-orange-500" />
                                        <span className="font-medium text-slate-700">Các nhà trường triển khai giáo dục STEM</span>
                                    </li>
                                </ul>
                                <p className="mt-6 text-sm text-slate-500 italic">
                                    "Giúp giáo viên có thể tổ chức tiết học một cách thuận lợi mà không yêu cầu nền tảng lập trình chuyên sâu."
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Footer Note */}
                <section className="py-20 bg-gradient-to-br from-primary to-orange-600 text-white text-center">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Target className="w-16 h-16 mx-auto mb-6 text-white/90" />
                            <h2 className="text-2xl md:text-3xl font-black mb-6 max-w-4xl mx-auto leading-normal">
                                "Scratch Kid TQU không chỉ mang ý nghĩa học thuật mà còn thể hiện tinh thần đổi mới sáng tạo, gắn nghiên cứu với thực tiễn giáo dục."
                            </h2>
                            <p className="text-lg text-white/90">
                                Đồng hành cùng giáo dục Việt Nam trong kỷ nguyên số
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;
