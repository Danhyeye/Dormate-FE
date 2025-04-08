"use client";

import React from "react";
import { useParams } from "next/navigation";
import PostDetail from "@/app/components/postDetail/PostDetail";
import { usePostDetail } from "@/app/hooks/usePost";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { 
    data: postResponse, 
    isLoading, 
    isError, 
    error 
  } = usePostDetail(id);

  // Extract the error message if available
  const errorMessage = error instanceof Error ? error.message : "Không thể tải thông tin phòng";

  return (
    <PostDetail 
      post={postResponse?.data} 
      isLoading={isLoading} 
      isError={isError}
      errorMessage={errorMessage}
    />
  );
} 