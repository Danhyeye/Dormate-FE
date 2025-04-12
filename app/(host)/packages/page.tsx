"use client";

import { useState } from "react";
import { usePackagesList, usePackageCheckout } from "@/app/hooks/usePackage";
import { Package } from "@/app/types/package";
import { formatCurrency } from "@/app/services/RequestManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Loader2, PackageCheck, PackageOpen, PanelRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { data, isLoading, error } = usePackagesList();
  const { initiateCheckout, isLoading: isCheckoutLoading, error: checkoutError } = usePackageCheckout();
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <PackageOpen className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load packages</h2>
        <p className="text-muted-foreground mb-4">There was an error loading the available packages.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    toast.success("Gói đã được chọn", {
      description: `Bạn đã chọn ${pkg.title}`,
    });
  };
  
  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error("Vui lòng chọn gói trước khi thanh toán");
      return;
    }
    
    toast.info("Đang xử lý thanh toán...", {
      description: "Vui lòng chờ trong giây lát",
    });
    
    try {
      const redirectUrl = await initiateCheckout(selectedPackage.id);
      
      if (redirectUrl) {
        console.log("Payment URL received:", redirectUrl);
        
        // Force navigation to payment page
        toast.success("Chuyển hướng đến trang thanh toán...");
        window.open(redirectUrl, "_blank") || window.location.replace(redirectUrl);
      } else {
        // Handle case where no URL is returned but there's no error
        const errorMessage = checkoutError || "Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.";
        toast.error("Không thể tạo giao dịch", {
          description: errorMessage
        });
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      toast.error("Đã xảy ra lỗi", {
        description: "Không thể xử lý thanh toán. Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Gói dịch vụ</h1>
        <p className="text-muted-foreground max-w-2xl">
          Chọn gói dịch vụ phù hợp với nhu cầu của bạn để đăng tin hiệu quả và tiếp cận nhiều khách hàng hơn.
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-14 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <PanelRight className="h-4 w-4" />
                <span>Dạng lưới</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4" />
                <span>So sánh</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`overflow-hidden h-full flex flex-col transition-all hover:shadow-lg ${selectedPackage?.id === pkg.id ? 'ring-2 ring-primary' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{pkg.title}</CardTitle>
                        <Badge variant="outline" className="bg-primary/10">
                          {pkg.duration} tháng
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-3xl font-bold mb-4 text-primary">
                        {formatCurrency(pkg.price)}
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Thời hạn: {pkg.duration} tháng</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Số lần đăng bài: {pkg.postTime} lần</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={selectedPackage?.id === pkg.id ? "default" : "outline"}
                        onClick={() => handleSelectPackage(pkg)}
                      >
                        {selectedPackage?.id === pkg.id ? "Đã chọn" : "Chọn gói"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {selectedPackage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-8"
              >
                <Button 
                  size="lg" 
                  onClick={handlePurchase}
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Đang xử lý...
                    </>
                  ) : (
                    <>Thanh toán {formatCurrency(selectedPackage.price)}</>
                  )}
                </Button>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="compare">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-4 bg-muted text-left">Tính năng</th>
                    {data?.packages.map((pkg) => (
                      <th key={pkg.id} className="border p-4 bg-muted text-center">{pkg.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-4 font-medium">Giá</td>
                    {data?.packages.map((pkg) => (
                      <td key={pkg.id} className="border p-4 text-center font-bold text-primary">
                        {formatCurrency(pkg.price)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border p-4 font-medium">Thời hạn</td>
                    {data?.packages.map((pkg) => (
                      <td key={pkg.id} className="border p-4 text-center">
                        {pkg.duration} tháng
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border p-4 font-medium">Số lần đăng bài</td>
                    {data?.packages.map((pkg) => (
                      <td key={pkg.id} className="border p-4 text-center">
                        {pkg.postTime} lần
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border p-4 font-medium">Mô tả</td>
                    {data?.packages.map((pkg) => (
                      <td key={pkg.id} className="border p-4 text-center">
                        {pkg.description}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border p-4"></td>
                    {data?.packages.map((pkg) => (
                      <td key={pkg.id} className="border p-4 text-center">
                        <Button 
                          variant={selectedPackage?.id === pkg.id ? "default" : "outline"}
                          onClick={() => handleSelectPackage(pkg)}
                          className="w-full"
                        >
                          {selectedPackage?.id === pkg.id ? "Đã chọn" : "Chọn gói"}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            {selectedPackage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-8"
              >
                <Button 
                  size="lg" 
                  onClick={handlePurchase}
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Đang xử lý...
                    </>
                  ) : (
                    <>Thanh toán {formatCurrency(selectedPackage.price)}</>
                  )}
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
