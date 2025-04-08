import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin đặt phòng</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}