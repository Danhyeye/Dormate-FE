"use client";

import * as React from "react";
import { addDays, isWeekend } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { DateRange } from "react-day-picker";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Booking, formatDate } from "@/app/services/RequestManager";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BUFFER_TIME_HOURS = 1; // Match with API

// Thêm hàm helper để kiểm tra cuối tuần và hiển thị thông báo
const getWeekendSurcharge = (date: Date | undefined, mode: "day" | "hour" | undefined) => {
  if (!date) return null;
  if (!isWeekend(date)) return null;
  
  return (
    <div className="text-xs text-orange-600 font-medium mt-1">
      {mode === "day" ? "Phụ thu cuối tuần: +100.000đ/đêm" : "Phụ thu cuối tuần: +50.000đ/giờ"}
    </div>
  );
};

export function DatePickerWithRange({
  className,
  onChange,
  existingBookings = [],
}: {
  className?: string;
  onChange?: (
    range: DateRange | undefined,
    time?: string,
    bookingMode?: string
  ) => void;
  existingBookings?: Booking[];
}) {
  const [bookingMode, setBookingMode] = React.useState<
    "day" | "hour" | undefined
  >(undefined);
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [startTime, setStartTime] = React.useState<string>("00h");
  const [endTime, setEndTime] = React.useState<string>("00h");
  const [showCheckoutTime, setShowCheckoutTime] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(true);
  const [duration, setDuration] = React.useState<number | null>(null);

  // Function to check if a date is already booked
  const isDateBooked = React.useCallback(
    (date: Date) => {
      return existingBookings.some((booking) => {
        // For day bookings
        if (
          booking.bookingMode === "day" &&
          booking.checkInDate &&
          booking.checkOutDate
        ) {
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);
          
          // If it's the checkout date and we're in hour booking mode
          if (
            bookingMode === "hour" &&
            format(date, "yyyy-MM-dd") === format(checkOut, "yyyy-MM-dd")
          ) {
            return false; // Don't disable the checkout date for hourly bookings
          }
          
          return date >= checkIn && date < checkOut; // Changed <= to <
        }

        // For hourly bookings
        if (booking.bookingMode === "hour") {
          return false;
        }

        return false;
      });
    },
    [existingBookings, bookingMode]
  );

  // Function to check if a time slot is already booked
  const isTimeBooked = React.useCallback(
    (date: Date, timeSlot: string) => {
      if (!date) return false;

      const dateStr = format(date, "yyyy-MM-dd");
      const slotHour = parseInt(timeSlot.replace("h", ""));

      // Add check for after 21h
      if (bookingMode === "hour" && slotHour >= 21) {
        return true; // Disable all slots after 21h
      }

      return existingBookings.some((booking) => {
        // For day bookings
        if (booking.bookingMode === "day") {
          const checkIn = new Date(booking.checkInDate || "");
          const checkOut = new Date(booking.checkOutDate || "");
          const currentDate = new Date(dateStr);
          
          if (format(currentDate, "yyyy-MM-dd") === format(checkOut, "yyyy-MM-dd")) {
            const checkOutHour = parseInt((booking.checkOutTime || "12:00").split(":")[0]);
            // Block until checkout time + buffer time
            return slotHour < (checkOutHour + BUFFER_TIME_HOURS);
          }
          
          if (format(currentDate, "yyyy-MM-dd") === format(checkIn, "yyyy-MM-dd")) {
            const checkInHour = parseInt((booking.checkInTime || "14:00").split(":")[0]);
            return slotHour >= checkInHour;
          }
          
          return currentDate > checkIn && currentDate < checkOut;
        }

        // For hourly bookings
        if (booking.bookingMode === "hour" && booking.checkInDate === dateStr) {
          if (!booking.checkInTime || !booking.checkOutTime) return false;

          const checkInHour = parseInt(booking.checkInTime.split(":")[0]);
          const checkOutHour = parseInt(booking.checkOutTime.split(":")[0]);
          
          // Add buffer time to checkout hour
          const effectiveCheckOutHour = checkOutHour + BUFFER_TIME_HOURS;

          if (booking.checkInDate === booking.checkOutDate) {
            if (effectiveCheckOutHour > checkInHour) {
              return slotHour >= checkInHour && slotHour < effectiveCheckOutHour;
            } else {
              return slotHour >= checkInHour || slotHour < effectiveCheckOutHour;
            }
          }

          if (booking.checkInDate === dateStr) {
            return slotHour >= checkInHour;
          }
          if (booking.checkOutDate === dateStr) {
            return slotHour < checkOutHour;
          }
        }

        return false;
      });
    },
    [existingBookings, bookingMode]
  );

  const handleSelect = (rangeOrDate: DateRange | Date | undefined) => {
    if (bookingMode === "hour" && rangeOrDate instanceof Date) {
      const singleDate = rangeOrDate;
      let toDate = new Date(singleDate);
      
      setStartTime("00h");
      setEndTime("00h");
      setShowCheckoutTime(false);
      setShowCalendar(false);
      
      setDate({ from: singleDate, to: toDate });
      onChange?.(
        { from: singleDate, to: toDate },
        `${startTime} to ${endTime}`,
        "hour"
      );
    } else if (bookingMode === "day" && rangeOrDate) {
      const range = rangeOrDate as DateRange;
      if (range.from && range.to) {
        setDate(range);
        onChange?.(range, "14h to 12h", "day");
      } else if (range.from) {
        setDate(range);
      }
    }
  };

  const handleBookingModeChange = (value: "day" | "hour") => {
    setBookingMode(value);
    setShowCalendar(true);
    const fromDate = new Date();
    if (value === "day") {
      setDate(undefined);
      onChange?.(undefined, "14h to 12h", "day");
    } else {
      // For hourly booking
      setDate(undefined);
      onChange?.(undefined, `${startTime} to ${endTime}`, "hour");
    }
  };

  const handleDurationSelect = (hours: number) => {
    if (!date?.from || startTime === "00h") return;
    
    const startHour = parseInt(startTime);
    let endHour = startHour + hours;
    
    // Handle overflow to next day
    if (endHour >= 24) {
      endHour = endHour % 24;
    }
    
    const newEndTime = `${endHour.toString().padStart(2, "0")}h`;
    setEndTime(newEndTime);
    setDuration(hours);
    
    if (date?.from) {
      const fromDate = new Date(date.from);
      let toDate = new Date(date.from);
      
      if (endHour < startHour) {
        toDate = addDays(toDate, 1);
      }
      
      setDate({ from: fromDate, to: toDate });
      onChange?.(
        { from: fromDate, to: toDate },
        `${startTime} to ${newEndTime}`,
        "hour"
      );
    }
  };

  const getTimeBlocks = () => {
    // Return time blocks from 7:00 to 21:00 in 2-hour increments
    const blocks = [];
    for (let i = 7; i <= 21; i += 2) {
      blocks.push({
        hour: i,
        label: `${i.toString().padStart(2, "0")}:00`,
        value: `${i.toString().padStart(2, "0")}h`
      });
    }
    return blocks;
  };

  const timeBlocks = getTimeBlocks();

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex gap-2 items-center mb-2">
        <Select
          onValueChange={(value) =>
            handleBookingModeChange(value as "day" | "hour")
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn phương thức đặt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Đặt theo ngày</SelectItem>
            <SelectItem value="hour">Đặt theo giờ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {bookingMode && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {bookingMode === "day" ? (
                <CalendarIcon className="mr-2 h-4 w-4" />
              ) : (
                <Clock className="mr-2 h-4 w-4" />
              )}
              {date?.from ? (
                bookingMode === "day" && date.to ? (
                  <>
                    {formatDate(date.from)} - {formatDate(date.to)}
                  </>
                ) : bookingMode === "hour" ? (
                  <>
                    {formatDate(date.from)}
                    {startTime !== "00h" && `, ${startTime.replace('h', ':00')}`}
                    {endTime !== "00h" && ` - ${endTime.replace('h', ':00')}`}
                    {duration && ` (${duration} giờ)`}
                  </>
                ) : (
                  formatDate(date.from)
                )
              ) : (
                <span>Chọn ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          
          {/* Hiển thị thông báo phụ thu cuối tuần nếu ngày đã chọn là cuối tuần */}
          {getWeekendSurcharge(date?.from, bookingMode)}
          
          <PopoverContent className="w-auto p-0" align="start">
            {bookingMode === "day" ? (
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={2}
                locale={vi}
                disabled={isDateBooked}
                footer={
                  <p className="text-sm text-center text-muted-foreground font-bold text-red-500">
                    {!date?.to && "Vui lòng chọn ngày check-out"}
                  </p>
                }
              />
            ) : bookingMode === "hour" && showCalendar ? (
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={date?.from}
                selected={date?.from}
                onSelect={handleSelect}
                locale={vi}
                disabled={isDateBooked}
              />
            ) : bookingMode === "hour" ? (
              <div className="p-4 w-[340px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold">
                    Ngày: {date?.from ? formatDate(date.from) : ""}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCalendar(true);
                      setDate(undefined);
                      setStartTime("00h");
                      setEndTime("00h");
                      setShowCheckoutTime(false);
                      setDuration(null);
                    }}
                  >
                    Đổi ngày
                  </Button>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Giờ bắt đầu</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {timeBlocks.map((block) => {
                      const isDisabled = date?.from ? isTimeBooked(date.from, block.value) : false;
                      
                      return (
                        <Button
                          key={`start-${block.hour}`}
                          className={cn(
                            "h-10",
                            startTime === block.value &&
                              "bg-red-500 text-white hover:bg-red-600 hover:text-white",
                            isDisabled && "opacity-50 cursor-not-allowed bg-red-100"
                          )}
                          variant="outline"
                          size="sm"
                          disabled={isDisabled || !date?.from}
                          onClick={() => {
                            setStartTime(block.value);
                            setShowCheckoutTime(true);
                            setEndTime("00h");
                            setDuration(null);
                            
                            if (date?.from) {
                              const fromDate = new Date(date.from);
                              const toDate = new Date(date.from);
                              setDate({ from: fromDate, to: toDate });
                              onChange?.(
                                { from: fromDate, to: toDate },
                                `${block.value} to ${endTime}`,
                                "hour"
                              );
                            }
                          }}
                        >
                          {block.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                {showCheckoutTime && startTime !== "00h" && (
                  <>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Thời gian đặt phổ biến</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 4, 6, 8].map((hours) => (
                          <Button
                            key={`duration-${hours}`}
                            variant={duration === hours ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "h-9",
                              duration === hours && 
                              "bg-red-500 hover:bg-red-600"
                            )}
                            onClick={() => handleDurationSelect(hours)}
                          >
                            {hours} giờ
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-2">
                      <h4 className="text-sm font-medium mb-2">Giờ kết thúc</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {timeBlocks.map((block) => {
                          const isDisabled = date?.from
                            ? isTimeBooked(date.from, block.value) || parseInt(block.value) <= parseInt(startTime)
                            : false;
                          
                          return (
                            <Button
                              key={`end-${block.hour}`}
                              className={cn(
                                "h-10",
                                endTime === block.value &&
                                  "bg-red-500 text-white hover:bg-red-600 hover:text-white",
                                isDisabled && "opacity-50 cursor-not-allowed bg-red-100"
                              )}
                              variant="outline"
                              size="sm"
                              disabled={
                                isDisabled || 
                                block.value === startTime || 
                                parseInt(block.value) <= parseInt(startTime)
                              }
                              onClick={() => {
                                setEndTime(block.value);
                                setDuration(parseInt(block.value) - parseInt(startTime));
                                
                                if (date?.from) {
                                  const fromDate = new Date(date.from);
                                  let toDate = new Date(date.from);

                                  if (parseInt(block.value) < parseInt(startTime)) {
                                    toDate = addDays(toDate, 1);
                                  }

                                  setDate({ from: fromDate, to: toDate });
                                  onChange?.(
                                    { from: fromDate, to: toDate },
                                    `${startTime} to ${block.value}`,
                                    "hour"
                                  );
                                }
                              }}
                            >
                              {block.label}
                            </Button>
                          );
                        })}
                      </div>
                      {startTime !== "00h" && endTime !== "00h" && (
                        <div className="mt-4 p-3 bg-red-50 rounded-md text-sm">
                          <p className="font-medium text-red-800">
                            Thời gian đã chọn: {startTime.replace('h', ':00')} - {endTime.replace('h', ':00')}
                            {duration && ` (${duration} giờ)`}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
