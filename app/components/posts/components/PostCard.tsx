"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/app/services/RequestManager";
import { Card } from "@/components/ui/card";
import { Post } from "@/app/types/post";
import { MapPin, Home, Square } from "lucide-react";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  // For odd indexes (1, 3, 5...), show image on the right
  // For even indexes (0, 2, 4...), show image on the left
  const imageOnRight = index % 2 === 1;
  
  return (
    <Link href={`/postDetail/${post.id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 w-full border border-gray-200 rounded-xl h-full flex flex-col group">
        <div className={`flex flex-col ${imageOnRight ? 'sm:flex-row-reverse' : 'sm:flex-row'} flex-1`}>
          <div className="relative sm:w-2/5 min-h-[250px] sm:min-h-full">
            {post.mainPictureUrl && (
              <Image
                src={post.mainPictureUrl}
                alt={post.name}
                fill
                priority={index < 4} // Only prioritize the first 4 images
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
              />
            )}
          </div>
          <div className="w-full sm:w-3/5 flex flex-col p-5 sm:p-6">
            <div className="flex-grow space-y-4">
              <h3 className="font-bold text-xl sm:text-2xl text-gray-800 line-clamp-2">
                {post.name}
              </h3>
              
              <div className="flex items-center text-gray-500 space-x-4 flex-wrap">
                <div className="flex items-center mr-4">
                  <Square className="h-4 w-4 mr-1 text-emerald-500" />
                  <span className="font-medium">{post.area}m²</span>
                </div>
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-1 text-emerald-500" />
                  <span className="font-medium">{post.description ? (post.description.includes('phòng') ? 'Phòng trọ' : 'Căn hộ') : 'Phòng trọ'}</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-emerald-500" />
                <span className="line-clamp-1 font-medium">
                  {post.district}, {post.province}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.description}
              </p>
            </div>
            
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <span className="text-emerald-600 font-bold text-xl">
                  {formatCurrency(post.price)}
                </span>
                <span className="text-sm text-gray-600 font-normal ml-1">/tháng</span>
              </div>
              {post.owner && (
                <div className="text-sm text-gray-600 font-medium truncate max-w-[150px]">
                  {post.owner}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 