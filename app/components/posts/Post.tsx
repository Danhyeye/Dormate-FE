"use client";

import React, { useState } from "react";
import { usePosts } from "@/app/hooks/usePost";
import { PostSearchParams } from "@/app/types/post";
import PostList from "./components/PostList";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostsProps {
  initialSearchParams?: Partial<PostSearchParams>;
}

export default function Posts({ initialSearchParams }: PostsProps = {}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);

  const searchParams: PostSearchParams = {
    ...initialSearchParams,
    defaultSearch: {
      perPage: perPage,
      currentPage: currentPage,
    },
  };

  const { data, isLoading, error, refetch } = usePosts(searchParams);

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error instanceof Error ? error.message : String(error)} onRetry={() => refetch()} />;
  }

  if (!posts?.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      
      <PostList posts={posts} />
      
      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: Math.ceil(pagination.total / pagination.perPage) }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i)}
              className="w-8 h-8 p-0"
            >
              {i + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.min(Math.ceil(pagination.total / pagination.perPage) - 1, currentPage + 1))}
            disabled={currentPage === Math.ceil(pagination.total / pagination.perPage) - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
