"use client";

import React from "react";
import { Post } from "@/app/types/post";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto w-full max-w-7xl">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
} 