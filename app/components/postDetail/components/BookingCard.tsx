import React, { useState, useCallback, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bookmark, Clock, User, AlertCircle } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-time-range-picker";
import { Input } from "@/components/ui/input";
import {
  formatCurrency,
  Room,
  Booking,
  createBooking,
} from "@/app/services/RequestManager";
import { differenceInDays, format, isWeekend } from "date-fns";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Post } from "@/app/types/post";

const BookingCard = memo(({ post }: { post: Post }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Add useEffect to handle auto-dismiss
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (errorMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage(null);
      }, 5000); // 5 seconds
    }

    // Cleanup timeout on component unmount or when error message changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [errorMessage]);

  // Do the same for success message
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (successMessage) {
      timeoutId = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000); // 5 seconds
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      };
    };
  }, [successMessage]);

  const handleContact = () => {
    if (!post.phoneNumber) {
      setErrorMessage("Số điện thoại không khả dụng");
      return;
    }

    window.location.href = `tel:${post.phoneNumber}`;
  };

  return (
    <Card className="w-full bg-white border-gray-100 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>{formatCurrency(post.price)}</span>
          <span className="text-sm text-gray-500">/tháng</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {successMessage && (
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Chủ phòng</span>
            <span className="font-medium text-gray-900">{post.owner}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Số điện thoại</span>
            <span className="font-medium text-gray-900">{post.phoneNumber || "Không có"}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Diện tích</span>
            <span className="font-medium text-gray-900">{post.area} m²</span>
          </div>
        </div>

        {/* Contact Button */}
        <Button
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-6"
          onClick={handleContact}
          disabled={isLoading || !post.phoneNumber}
        >
          {isLoading ? (
            "Đang xử lý..."
          ) : (
            <>
              Liên hệ ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        {/* Save Button */}
        <Button
          variant="outline"
          className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold"
          onClick={() => {
            if (!isLoggedIn) {
              setErrorMessage("Vui lòng đăng nhập để lưu phòng");
              return;
            }
            // TODO: Implement save functionality
            setSuccessMessage("Đã lưu phòng vào danh sách yêu thích");
          }}
        >
          <Bookmark className="mr-2 h-5 w-5" />
          Lưu phòng
        </Button>

        {/* Additional Information */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-2">Thông tin thêm</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              Đăng {new Date(post.createdAt).toLocaleDateString("vi-VN")}
            </li>
            <li className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              {post.owner}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
});

BookingCard.displayName = "BookingCard";

export default BookingCard;
