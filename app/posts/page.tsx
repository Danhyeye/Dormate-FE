"use client";

import { useSearchParams } from "next/navigation";
import Posts from "@/app/components/posts/Post";
import { PostSearchParams } from "@/app/types/post";

export default function PostsPage() {
  const searchParams = useSearchParams();
  
  // Parse search parameters from the URL
  const initialSearchParams: Partial<PostSearchParams> = {};
  
  // Extract common search parameters
  if (searchParams.has('name')) {
    initialSearchParams.name = searchParams.get('name') || undefined;
  }
  
  if (searchParams.has('province')) {
    initialSearchParams.province = searchParams.get('province') || undefined;
  }
  
  if (searchParams.has('district')) {
    initialSearchParams.district = searchParams.get('district') || undefined;
  }
  
  if (searchParams.has('ward')) {
    initialSearchParams.ward = searchParams.get('ward') || undefined;
  }
  
  if (searchParams.has('fromPrice')) {
    const fromPrice = parseInt(searchParams.get('fromPrice') || '0', 10);
    if (!isNaN(fromPrice)) {
      initialSearchParams.fromPrice = fromPrice;
    }
  }
  
  if (searchParams.has('toPrice')) {
    const toPrice = parseInt(searchParams.get('toPrice') || '0', 10);
    if (!isNaN(toPrice)) {
      initialSearchParams.toPrice = toPrice;
    }
  }
  
  return (
    <div className="container mx-auto">
      <Posts initialSearchParams={initialSearchParams} />
    </div>
  );
}
