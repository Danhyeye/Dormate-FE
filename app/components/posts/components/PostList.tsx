"use client";

import React from "react";
import { Post } from "@/app/types/post";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 mx-auto w-full">
      <h1 className="text-6xl font-bold mb-0 ml-8">Danh sách phòng</h1>
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
} 