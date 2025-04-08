"use client"
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";
import { SubPicture } from "@/app/types/post";
import ImageDialog from "./ImageDialog";

interface GalleryProps {
  mainPictureUrl: string;
  subPictureUrl: SubPicture[];
  roomName: string;
}

const CarouselComponent: React.FC<GalleryProps> = ({ mainPictureUrl, subPictureUrl = [], roomName }) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Convert mainPictureUrl and subPictureUrl into a flat array of image URLs
  const images = [mainPictureUrl, ...subPictureUrl.map(pic => pic.imageUrl)];

  // Return early if no images
  if (!mainPictureUrl && !subPictureUrl.length) {
    return (
      <div className="w-full h-[20rem] md:h-[40rem] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  // Only display first 3 images (main + 2 sub)
  const displayImages = images.slice(0, 3);
  // If less than 3 images, pad with empty slots
  while (displayImages.length < 3) {
    displayImages.push("");
  }
  
  const openImageDialog = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageDialog(true);
  };

  return (
    <>
      {/* Main Gallery Layout - 3 Images */}
      <div className="relative w-full mb-8 rounded-xl overflow-hidden group">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-[20rem] md:h-[40rem]">
          {/* Main Large Image */}
          <div 
            className="col-span-1 md:col-span-8 relative cursor-zoom-in overflow-hidden" 
            onClick={() => {
              setCurrentImageIndex(0);
              setShowImageDialog(true);
            }}
          >
            <Image
              src={displayImages[0]}
              alt={`${roomName} - Main View`}
              fill
              className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none transition-transform duration-300 group-hover:scale-105"
              sizes="(max-inline-size: 768px) 100vw, 66vw"
              priority
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Right Side Column - 2 Images */}
          <div className="hidden md:flex md:col-span-4 flex-col gap-2">
            {displayImages.slice(1, 3).map((image, index) => (
              <motion.div 
                key={index} 
                className={`relative flex-1 cursor-zoom-in overflow-hidden ${
                  index === 0 ? "rounded-tr-xl" : 
                  index === 1 ? "rounded-br-xl" : ""
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  if (image) {
                    setCurrentImageIndex(index + 1);
                    setShowImageDialog(true);
                  }
                }}
              >
                {image ? (
                  <>
                    <Image
                      src={image}
                      alt={`${roomName} - View ${index + 2}`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-inline-size: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Show All Photos Button */}
        {images.length > 3 && (
          <Button
            variant="outline"
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-black font-medium rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 opacity-90 group-hover:opacity-100"
            onClick={() => setShowAllImages(true)}
          >
            <Camera className="w-4 h-4 mr-2" />
            Xem tất cả ảnh
          </Button>
        )}

        {/* Image Counter Badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {images.length} ảnh
        </div>
      </div>

      {/* Full Gallery Modal (Airbnb Style) */}
      {showAllImages && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Gallery Header */}
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white border-b">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
              onClick={() => setShowAllImages(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-medium">{roomName} ảnh</h2>
            <div className="w-10" /> {/* Empty div for balance */}
          </div>
          
          {/* Gallery Grid */}
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className="relative cursor-pointer aspect-[9/16] rounded-lg overflow-hidden"
                  onClick={() => openImageDialog(index)}
                >
                  <Image
                    src={image}
                    alt={`${roomName} - View ${index + 1}`}
                    fill
                    className="object-cover hover:opacity-95 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog for viewing individual images */}
      <ImageDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        images={images}
        initialIndex={currentImageIndex}
        title={roomName}
      />
    </>
  );
};

export default CarouselComponent;