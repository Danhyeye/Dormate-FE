import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Booking, formatDateTime, Room } from "@/app/services/RequestManager";

interface BookingDetailsProps {
  booking: Booking;
  room: Room;
}

export default function BookingDetails({ booking, room }: BookingDetailsProps) {
  const checkInDate = booking.checkInDate 
    ? new Date(booking.checkInDate) 
    : (booking.checkInDateTime ? new Date(booking.checkInDateTime) : null);
    
  const checkOutDate = booking.checkOutDate 
    ? new Date(booking.checkOutDate) 
    : (booking.checkOutDateTime ? new Date(booking.checkOutDateTime) : null);

  return (
    <Card>
      <CardHeader>
        <div className="mb-2">
          <Link href={`/phong/${room.id}`} className="inline-flex items-center text-red-600 hover:text-red-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại thông tin phòng
          </Link>
        </div>
        <CardTitle>Thông tin đặt phòng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-20 h-20 relative rounded-md overflow-hidden">
              <Image 
                src={room.images[0] || "/placeholder-room.jpg"} 
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-lg">{room.name}</h3>
              <p className="text-gray-500 text-sm">{room.bedType} · {room.size}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ngày nhận phòng</p>
              <p className="font-medium">
                {checkInDate ? formatDateTime(checkInDate, "EEEE, dd/MM/yyyy") : "N/A"}
              </p>
              <p className="text-sm text-gray-500">
               {booking.checkInTime || (booking.checkInDateTime ? formatDateTime(new Date(booking.checkInDateTime), "HH:mm") : "14:00")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày trả phòng</p>
              <p className="font-medium">
                {checkOutDate ? formatDateTime(checkOutDate, "EEEE, dd/MM/yyyy") : "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {booking.checkOutTime || (booking.checkOutDateTime ? formatDateTime(new Date(booking.checkOutDateTime), "HH:mm") : "12:00")}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500">Loại đặt phòng</p>
            <p className="font-medium">
              {booking.bookingMode === "day" ? "Theo ngày" : 
               booking.bookingMode === "hour" ? "Theo giờ" : "Qua đêm"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Số lượng khách</p>
            <p className="font-medium">{booking.numberOfGuests} người</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
            <p className={`font-medium ${booking.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
              {booking.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Mã đặt phòng</p>
            <p className="font-medium">{booking._id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}