"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { XCircle, AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { usePackageHistory } from "@/app/hooks/useProfile";

export default function PaymentFailedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Try to get error from URL search params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorMsg = params.get('error');
      if (errorMsg) {
        setError(decodeURIComponent(errorMsg));
      }
    }
    
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
          <h1 className="text-base font-medium">Thanh toán không thành công</h1>
        </div>
      </header>

      <div className="container max-w-lg mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-red-100">
            <CardHeader className="pb-6 pt-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <XCircle className="h-16 w-16 text-red-500" strokeWidth={1.5} />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-red-700">Thanh toán không thành công</CardTitle>
              <CardDescription className="text-base mt-2">
                Đã xảy ra lỗi trong quá trình thanh toán.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-6">
              <div className="bg-red-50 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800">Thông tin lỗi</h3>
                    <p className="text-sm text-red-700 mt-1">
                      {error || "Giao dịch thanh toán không thành công. Nguyên nhân có thể do vấn đề về cổng thanh toán hoặc tài khoản của bạn."}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-red-700 mt-3">
                  <p>Vui lòng thử lại sau hoặc chọn phương thức thanh toán khác.</p>
                </div>
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
                <Link href="/packages">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </Link>
              </Button>
              <Button 
                asChild 
                className="w-full sm:w-1/2 bg-red-600 hover:bg-red-700"
              >
                <Link href="/packages">
                  <RefreshCw className="mr-2 h-4 w-4" /> Thử lại
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </SidebarInset>
  );
} 