import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPackages, getPackageById, checkoutPackage } from "../services/RequestManager";
import { Package, PackageSearchParams } from "../types/package";
import { useState } from "react";

export const usePackagesList = (searchParams?: PackageSearchParams) => {
  return useQuery({
    queryKey: ["packages", searchParams],
    queryFn: () => fetchPackages(searchParams),
  });
};

export const usePackageDetails = (id: string) => {
  return useQuery({
    queryKey: ["package", id],
    queryFn: () => getPackageById(id),
    enabled: !!id,
  });
};

export const usePackageCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = async (packageId: string) => {
    if (!packageId) {
      setError("No package selected");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Initiating checkout for package: ${packageId}`);
      const paymentUrl = await checkoutPackage(packageId);
      
      if (paymentUrl) {
        console.log(`Payment URL received: ${paymentUrl}`);
        // No longer redirecting here, just returning the URL
        return paymentUrl;
      } else {
        console.error("Failed to get payment URL");
        setError("Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.");
        return null;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { initiateCheckout, isLoading, error };
}; 