"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [isMounted, setIsMounted] = useState(false);

  // Get package details from URL if available
  useEffect(() => {
    setIsMounted(true);
    
    // Auto redirect after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/packages");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarInset>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Thanh toán thành công</h1>
        </div>
      </header>

      <div className="container max-w-lg mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-green-100">
            <CardHeader className="pb-6 pt-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <CheckCircle className="h-16 w-16 text-green-500" strokeWidth={1.5} />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-green-700">Thanh toán thành công!</CardTitle>
              <CardDescription className="text-base mt-2">
                Gói dịch vụ của bạn đã được kích hoạt thành công.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-6">
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium text-green-800">Thông tin gói</h3>
                </div>
                <p className="text-sm text-green-700 mb-1">
                  Bạn đã đăng ký gói dịch vụ thành công. Bạn có thể bắt đầu đăng tin ngay.
                </p>
                <p className="text-sm text-green-700">
                  Kiểm tra lịch sử gói trong trang hồ sơ của bạn.
                </p>
              </div>
              
              <p className="text-center text-sm text-muted-foreground">
                Bạn sẽ được chuyển hướng đến trang gói dịch vụ sau {countdown} giây
              </p>
            </CardContent>
            
            <CardFooter className="flex gap-4 pt-2 pb-8 flex-col sm:flex-row">
              <Button 
                asChild 
                variant="outline" 
                className="w-full sm:w-1/2"
              >
                <Link href="/host/profileHost">
                  Xem hồ sơ
                </Link>
              </Button>
              <Button 
                asChild 
                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700"
              >
                <Link href="/rooms">
                  <ArrowRight className="mr-2 h-4 w-4" /> Đăng tin ngay
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </SidebarInset>
  );
} 