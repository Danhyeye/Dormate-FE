"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Room, RoomStatus } from "../../../types/room"
import { formatCurrency } from "@/app/services/RequestManager"

interface RoomDialogProps {
  room: Room
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomDialog({
  room,
  open,
  onOpenChange,
}: RoomDialogProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Add console logs when the dialog opens
  useEffect(() => {
    if (open) {
      console.log('Room Dialog opened with data:', room);
      console.log('Main Picture URL:', room.mainPictureUrl);
      console.log('Sub Images:', room.subPictureUrl);
    }
  }, [open, room]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{room.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 rounded text-sm">Room ID: {room.id}</span>
            <span className={`px-2 py-1 rounded text-sm ${
              room.status === RoomStatus.Available ? 'bg-green-100 text-green-700' : 
              room.status === RoomStatus.Rented ? 'bg-blue-100 text-blue-700' : 
              room.status === RoomStatus.Hide ? 'bg-gray-100 text-gray-700' :
              room.status === RoomStatus.Pending ? 'bg-yellow-100 text-yellow-700' :
              room.status === RoomStatus.Approved ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>{RoomStatus[room.status]}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Large Image Preview */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-[95%] max-h-[95%]">
              <button 
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                }}
              >
                ✕
              </button>
              <img 
                src={selectedImage} 
                alt="Large preview" 
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}

        <div className="grid gap-6 py-4">
          {/* Main Image */}
          {room.mainPictureUrl && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Main Image</h3>
              <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm" onClick={() => setSelectedImage(room.mainPictureUrl ?? null)}>
                <img 
                  src={room.mainPictureUrl || ''} 
                  alt="Main room image" 
                  className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
                  <span className="text-white text-sm font-medium px-3 py-1 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Images */}
          {room.subPictureUrl && room.subPictureUrl.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Additional Images</h3>
              <div className="grid grid-cols-3 gap-3">
                {room.subPictureUrl.map((image, index) => (
                  <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm" onClick={() => setSelectedImage(image.imageUrl ?? null)}>
                    <img 
                      src={image.imageUrl || ''} 
                      alt={`Room image ${index + 1}`} 
                      className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
                      <span className="text-white text-sm font-medium px-3 py-1 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{room.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p>{RoomStatus[room.status]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Area</p>
                <p>{room.area}m²</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p>{formatCurrency(room.price)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
                Description
              </h3>
              <p className="text-sm">{room.description}</p>
            </div>
          )}

          {/* Location */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-6 bg-blue-600 rounded mr-2"></span>
              Location
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Province</p>
                <p>{room.province}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">District</p>
                <p>{room.district}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ward</p>
                <p>{room.ward}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{room.address}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 