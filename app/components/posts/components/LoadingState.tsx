"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <div className="flex flex-col gap-10 p-6 max-w-4xl mx-auto">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="overflow-hidden w-full p-0 shadow-md">
          <div className="flex h-96">
            {/* Left side (image) */}
            <div className="w-1/2 bg-gray-100">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
            
            {/* Right side (content) */}
            <div className="w-1/2 flex flex-col p-8 space-y-6">
              {/* Title */}
              <Skeleton className="h-8 w-3/4" />
              
              {/* Description lines */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              
              {/* Location info */}
              <div className="flex items-center gap-2 mt-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-36" />
              </div>
              
              {/* Empty space */}
              <div className="flex-grow" />
              
              {/* Footer section */}
              <div className="flex justify-between items-center pt-6">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
