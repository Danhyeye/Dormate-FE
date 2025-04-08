"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Booking, Room, getBookingById, getRoomById } from "@/app/services/RequestManager";
import BookingDetails from "./components/BookingDetails";
import PaymentDetails from "./components/PaymentDetails";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

export default function PaymentPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        const bookingData = await getBookingById(bookingId);
        
        if (bookingData) {
          setBooking(bookingData);
          
          const roomData = await getRoomById(bookingData.roomId);
          
          if (roomData) {
            setRoom(roomData);
          }
        } else {
          setError("Không tìm thấy thông tin đặt phòng");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Không thể tải thông tin đặt phòng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !booking || !room) {
    return <ErrorState message={error || "Không tìm thấy thông tin đặt phòng"} />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="w-3/4 mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Thanh toán đặt phòng</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <BookingDetails booking={booking} room={room} />
          </div>
          <div className="md:col-span-2">
            <PaymentDetails 
              booking={booking} 
              setBooking={setBooking} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
