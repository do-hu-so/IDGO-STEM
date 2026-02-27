import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const VerifyEmail = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gray-50">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-primary-600">Kiểm tra Email của bạn</CardTitle>
                    <CardDescription>
                        Chúng tôi đã gửi một liên kết xác nhận đến địa chỉ email của bạn.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">
                        Vui lòng nhấp vào liên kết trong email để kích hoạt tài khoản của bạn. Sau đó, bạn có thể đăng nhập.
                    </p>
                    <div className="text-sm text-gray-500">
                        Không nhận được email? Kiểm tra thư mục Spam hoặc thử đăng ký lại.
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/login" className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90">
                            Quay lại Đăng nhập
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default VerifyEmail;
