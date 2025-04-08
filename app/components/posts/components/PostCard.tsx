"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/app/services/RequestManager";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Post } from "@/app/types/post";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const isEven = index % 2 === 0;
  
  return (
    <>
      <Link href={`/postDetail/${post.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-4xl mx-auto w-full">
        <div className={`flex ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="relative w-1/2 h-96">
            <Image
              src={post.mainPictureUrl}
              alt={post.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="w-1/2 flex flex-col">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-3 line-clamp-1">
                {post.name}
              </h3>
              <p className="text-gray-600 text-base mb-4 line-clamp-3">
                {post.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>{post.area}m²</span>
                <span>•</span>
                <span>
                  {post.district}, {post.province}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center mt-auto">
              <div className="text-emerald-600 font-semibold text-lg">
                {formatCurrency(post.price)}
              </div>
              <div className="text-sm text-gray-500">{post.owner}</div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </Link>
    </>
  );
} 