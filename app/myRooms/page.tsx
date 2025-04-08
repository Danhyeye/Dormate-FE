"use client";

import React, { useEffect, useState } from "react";
import { Booking, getUserBookings } from "@/app/services/RequestManager";
import { formatDateTime, formatCurrency } from "@/app/services/RequestManager";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  CreditCardIcon,
} from "lucide-react";

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
        setError("Failed to load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Bạn chưa có đặt phòng nào
        </h3>
        <p className="text-gray-600 mb-6">
          Hãy khám phá các phòng của chúng tôi và đặt phòng ngay hôm nay.
        </p>
        <Link href="/post">
          <span className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center">
            Khám phá phòng ngay
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container w-3/4 mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Lịch sử đặt phòng của bạn
      </h2>

      <div className="grid gap-6 md:gap-8">
        {bookings.map((booking: Booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative h-48 md:h-full">
                {booking.room?.images && booking.room.images.length > 0 ? (
                  <Image
                    src={booking.room.images[0]}
                    alt={booking.room?.name || "Room image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              <div className="p-6 md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {booking.room?.name || "Phòng đã đặt"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-3">
                      {booking.room?.bedType && (
                        <span>{booking.room.bedType}</span>
                      )}
                      {booking.room?.size && <span>{booking.room.size}</span>}
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày nhận phòng</p>
                      <p className="font-medium text-gray-500">
                        {booking.checkInDate ||
                          (booking.checkInDateTime
                            ? formatDateTime(
                                booking.checkInDateTime as string | Date,
                                "EEEE, dd/MM/yyyy"
                              )
                            : "N/A")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.checkInTime ||
                          (booking.checkInDateTime
                            ? formatDateTime(
                                booking.checkInDateTime as string | Date,
                                "HH:mm"
                              )
                            : "14:00")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày trả phòng</p>
                      <p className="font-medium text-gray-500">
                        {booking.checkOutDate ||
                          (booking.checkOutDateTime
                            ? formatDateTime(
                                booking.checkOutDateTime as string | Date,
                                "EEEE, dd/MM/yyyy"
                              )
                            : "N/A")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.checkOutTime ||
                          (booking.checkOutDateTime
                            ? formatDateTime(
                                booking.checkOutDateTime as string | Date,
                                "HH:mm"
                              )
                            : "12:00")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <span className="block text-sm text-gray-500">
                        Số khách
                      </span>
                      <span className="block font-medium text-gray-500">
                        {booking.numberOfGuests} người
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-500 mr-2">Tổng tiền:</span>
                    <span className="font-bold text-xl text-red-600">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;
