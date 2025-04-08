"use client"

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  title: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const handleNextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 text-white">
        <span className="text-sm">{currentIndex + 1} / {images.length}</span>
        <h2 className="text-lg font-medium text-white">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-white hover:bg-gray-800"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Focused Image */}
      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full h-full flex items-center justify-center ${
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={toggleZoom}
          >
            <div className={`relative ${isZoomed ? "w-full h-full" : "w-4/5 h-4/5"}`}>
              <Image
                src={images[currentIndex]}
                alt={`${title} - View ${currentIndex + 1}`}
                fill
                className={`object-contain transition-transform duration-300 ${
                  isZoomed ? "scale-125" : "scale-100"
                }`}
                sizes="100vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevImage();
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={(e) => {
            e.stopPropagation();
            handleNextImage();
          }}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Zoom Control */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
        >
          {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default ImageDialog; 