import { usePackageHistory } from "@/app/hooks/useProfile";
import { PackageHistory } from "@/app/types/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/app/services/RequestManager";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Package } from "lucide-react";

export function PackageHistoryTab() {
  const { data: packageHistoryResponse, isLoading, error } = usePackageHistory();

  if (isLoading) {
    return <PackageHistorySkeleton />;
  }

  if (error || !packageHistoryResponse?.data || packageHistoryResponse.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lịch sử gói đăng ký
          </CardTitle>
          <CardDescription>
            Xem lịch sử các gói dịch vụ bạn đã đăng ký
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-1">Chưa có lịch sử gói</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              {error ? "Có lỗi khi tải dữ liệu. Vui lòng thử lại sau." : "Bạn chưa đăng ký gói nào. Hãy đăng ký gói để bắt đầu đăng tin."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const packageHistory = packageHistoryResponse.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Package className="h-5 w-5" />
          Lịch sử gói đăng ký
        </CardTitle>
        <CardDescription>
          Xem lịch sử các gói dịch vụ bạn đã đăng ký
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã gói</TableHead>
              <TableHead>Số lượng bài đăng</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packageHistory.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.packageId}</TableCell>
                <TableCell>{pkg.postTime}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Đang hoạt động
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PackageHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );
} 