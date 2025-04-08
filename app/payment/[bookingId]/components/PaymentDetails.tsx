import React, { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, Download, Upload } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import {
  Booking,
  formatCurrency,
  updatePaymentStatus,
} from "@/app/services/RequestManager";
import Link from "next/link";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

interface PaymentDetailsProps {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
}

export default function PaymentDetails({
  booking,
  setBooking,
}: PaymentDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState<
    "banking" | "cash" | "transfer"
  >("banking");
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const generateVietQRString = (amount: number, content: string) => {
    const bankBin = process.env.NEXT_PUBLIC_BANK_BIN;
    const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT;
    const bankHolder = process.env.NEXT_PUBLIC_BANK_HOLDER;
    
    return `https://img.vietqr.io/image/${bankBin}-${bankAccount}-compact2.png?amount=${amount}&addInfo=${content}&accountName=${encodeURIComponent(bankHolder || '')}`;
  };

  // Thay thế các hardcoded values trong component
  const bankInfo = {
    name: process.env.NEXT_PUBLIC_BANK_NAME,
    account: process.env.NEXT_PUBLIC_BANK_ACCOUNT,
    holder: process.env.NEXT_PUBLIC_BANK_HOLDER
  };

  const formatPaymentReference = (booking: Booking) => {
    // Format dates for better readability
    const checkInDate = booking.checkInDate 
      ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') 
      : '';
    const checkOutDate = booking.checkOutDate 
      ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') 
      : '';
    
    // Extract room type (executive or studio)
    const roomName = booking.room?.name || '';
    const roomType = roomName.toLowerCase().includes('executive') 
      ? 'executive' 
      : 'studio';
    
    // Format time with proper checks
    const checkInTime = booking.checkInTime || '';
    const checkOutTime = booking.checkOutTime || '';
    
    // Create the payment reference string in the requested format
    return `Thanh toan ${roomType} ${checkInDate} ${checkInTime} - ${checkOutDate} ${checkOutTime}`;
  };

  // Use the formatted reference in the QR generation
  const qrValue = generateVietQRString(
    booking.totalPrice,
    formatPaymentReference(booking)
  );

  const handleCopyPaymentInfo = () => {
    const paymentInfo = `
      Ngân hàng: ${bankInfo.name}
      Số tài khoản: ${bankInfo.account}
      Chủ tài khoản: ${bankInfo.holder}
      Số tiền: ${booking?.totalPrice ? formatCurrency(booking.totalPrice) : ""}
      Nội dung: ${formatPaymentReference(booking)}
    `;

    navigator.clipboard.writeText(paymentInfo.trim());
    setToastMessage("Thông tin thanh toán đã được sao chép vào clipboard");
    setShowToast(true);
  };

  const handleDownloadQR = async () => {
    try {
      // Tải ảnh QR từ URL
      const response = await fetch(qrValue);
      const blob = await response.blob();
      
      // Tạo URL object từ blob
      const url = window.URL.createObjectURL(blob);
      
      // Tạo link download
      const link = document.createElement('a');
      link.href = url;
      link.download = `payment-qr-${booking?._id || "homestay"}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setToastMessage("Không thể tải mã QR. Vui lòng thử lại sau.");
      setShowToast(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!booking?._id) return;

    try {
      setIsSubmitting(true);

      if (paymentMethod === "transfer" && !receiptImage) {
        setToastMessage("Vui lòng tải lên ảnh biên lai chuyển khoản");
        setShowToast(true);
        return;
      }

      const paymentDetails = {
        paymentStatus: "paid",
        paymentMethod: paymentMethod,
        receiptImage: receiptImage || "",
      };

      const success = await updatePaymentStatus(booking._id, paymentDetails);

      if (success) {
        setBooking({
          ...booking,
          paymentStatus: "paid",
        });
        setToastMessage("Cập nhật trạng thái thanh toán thành công");
      } else {
        setToastMessage("Không thể cập nhật trạng thái thanh toán");
      }
      setShowToast(true);
    } catch (error) {
      console.error("Error updating payment status:", error);
      setToastMessage("Không thể cập nhật trạng thái thanh toán");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết thanh toán</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Giá phòng</span>
            <span className="font-medium">
              {formatCurrency(booking.totalPrice * 0.9)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phí dịch vụ</span>
            <span className="font-medium">
              {formatCurrency(booking.totalPrice * 0.1)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-bold">Tổng cộng</span>
            <span className="font-bold text-lg">
              {formatCurrency(booking.totalPrice)}
            </span>
          </div>

          {booking.paymentStatus !== "paid" && (
            <>
              <Separator />

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Phương thức thanh toán</p>
                  <div className="flex space-x-2">
                    <Button
                      variant={
                        paymentMethod === "banking" ? "default" : "outline"
                      }
                      onClick={() => setPaymentMethod("banking")}
                      className="flex-1 text-xs"
                    >
                      QR Code
                    </Button>
                    <Button
                      variant={
                        paymentMethod === "transfer" ? "default" : "outline"
                      }
                      onClick={() => setPaymentMethod("transfer")}
                      className="flex-1 text-xs"
                    >
                      Chuyển khoản
                    </Button>
                    {/* <Button
                      variant={paymentMethod === "cash" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("cash")}
                      className="flex-1 text-xs"
                    >
                      Tiền mặt
                    </Button> */}
                  </div>
                </div>

                {paymentMethod === "banking" && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center mb-4">
                      <Image 
                        src={qrValue}
                        alt="Payment QR Code"
                        width={180}
                        height={180}
                        className="mx-auto"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={handleDownloadQR}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Tải QR
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngân hàng:</span>
                        <span className="font-medium">{bankInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số tài khoản:</span>
                        <span className="font-medium">{bankInfo.account}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Chủ tài khoản:</span>
                        <span className="font-medium">{bankInfo.holder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số tiền:</span>
                        <span className="font-medium">
                          {formatCurrency(booking.totalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nội dung:</span>
                        <span className="font-medium">
                          {formatPaymentReference(booking)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={handleCopyPaymentInfo}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Sao chép thông tin
                      </Button>

                      <div className="space-y-2">
                        <Label htmlFor="receipt-image">
                          Tải lên biên lai chuyển khoản
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="receipt-image"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Chọn ảnh biên lai
                          </Button>
                        </div>

                        {receiptPreview && (
                          <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden border">
                            <Image
                              src={receiptPreview}
                              alt="Receipt preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "transfer" && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngân hàng:</span>
                        <span className="font-medium">{bankInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số tài khoản:</span>
                        <span className="font-medium">{bankInfo.account}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Chủ tài khoản:</span>
                        <span className="font-medium">{bankInfo.holder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số tiền:</span>
                        <span className="font-medium">
                          {formatCurrency(booking?.totalPrice || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nội dung:</span>
                        <span className="font-medium">
                          {formatPaymentReference(booking)}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mb-4"
                      onClick={handleCopyPaymentInfo}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Sao chép thông tin
                    </Button>

                    <div className="space-y-2">
                      <Label htmlFor="receipt-image">
                        Tải lên biên lai chuyển khoản
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="receipt-image"
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Chọn ảnh biên lai
                        </Button>
                      </div>

                      {receiptPreview && (
                        <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden border">
                          <Image
                            src={receiptPreview}
                            alt="Receipt preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* {paymentMethod === "cash" && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Bạn có thể thanh toán bằng tiền mặt khi nhận phòng. Vui
                      lòng đến sớm 15 phút để hoàn tất thủ tục.
                    </p>
                  </div>
                )} */}

                <Button
                  className="w-full"
                  onClick={handleUpdatePaymentStatus}
                  disabled={
                    isSubmitting ||
                    ((paymentMethod === "transfer" ||
                      paymentMethod === "banking") &&
                      !receiptImage)
                  }
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Xác nhận đã thanh toán
                </Button>
              </div>
            </>
          )}

          {booking.paymentStatus === "paid" && (
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">
                Đã thanh toán thành công
              </p>
              <p className="text-sm text-green-600 mt-1">
                Cảm ơn bạn đã đặt phòng tại Homestay Việt
              </p>
              <Link href="/">
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Quay lại trang chủ
                </Button>
              </Link>
            </div>
          )}
        </div>
        {showToast && (
          <Toast>
            <ToastTitle>Notification</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
          </Toast>
        )}
      </CardContent>
    </Card>
  );
}
