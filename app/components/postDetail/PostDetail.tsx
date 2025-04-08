"use client";

import React from "react";
import { formatCurrency, formatDateTime } from "@/app/services/RequestManager";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, ArrowLeft, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import EmptyState from "./components/EmptyState";
import CarouselComponent from "./components/Carousel";
import { Post } from "@/app/types/post";
import LoadingState from "./components/LoadingState";

interface PaginationProps {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface PostDetailProps {
  post: Post | null | undefined;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  pagination?: {
    total: number;
    perPage: number;
    currentPage: number;
  };
  onPageChange?: (page: number) => void;
}

function Pagination({ total, perPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  
  if (totalPages <= 1) return null;
  
  const pages = Array.from({ length: totalPages }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pages.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className="w-8 h-8 p-0"
        >
          {page + 1}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function PostDetail({ 
  post, 
  isLoading = false, 
  isError = false, 
  errorMessage,
  pagination, 
  onPageChange 
}: PostDetailProps) {

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (isError) {
    return (
      <EmptyState />
    );
  }

  if (!post) {
    return <EmptyState />;
  }

  const fullAddress = `${post.address || ''}, ${post.ward || ''}, ${post.district || ''}, ${post.province || ''}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/posts" 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={16} />
        <span>Quay lại danh sách phòng</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left column - Images */}
        <div className="lg:col-span-2">
          <CarouselComponent 
            mainPictureUrl={post.mainPictureUrl} 
            subPictureUrl={post.subPictureUrl || []} 
            roomName={post.name}
          />
        </div>

        {/* Right column - Info */}
        <div className="space-y-6 mt-6 lg:mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">{post.name}</CardTitle>
              <CardDescription className="flex items-start gap-1">
                <MapPin size={14} className="text-gray-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-500">{fullAddress}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Giá thuê:</span>
                  <span className="text-emerald-600 font-bold text-xl">{formatCurrency(post.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Diện tích:</span>
                  <span className="text-gray-900">{post.area}m²</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} className="flex-shrink-0" />
                  <span>Đăng ngày: {formatDateTime(post.createdAt, 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={14} className="flex-shrink-0" />
                  <span>Người đăng: {post.owner}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full gap-2">
                <Phone size={16} />
                <span>Liên hệ ngay</span>
              </Button>
            </CardFooter>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mô tả chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Pagination */}
      {pagination && onPageChange && (
        <Pagination
          total={pagination.total}
          perPage={pagination.perPage}
          currentPage={pagination.currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
