"use client";

import { useState, useEffect } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { usePosts } from "../../hooks/usePost"
import { PostDataColumn } from "./components/columns"
import { DataTable } from "./components/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserId } from "@/app/services/authService"

export default function Page() {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  
  // Get the userId using authService
  useEffect(() => {
    const id = getUserId();
    if (id) {
      setUserId(id);
    }
  }, []);
  
  // Use userId to filter posts for this host only
  const { data, isLoading } = usePosts({
    defaultSearch: {
      perPage: pageSize,
      currentPage: pageIndex
    },
    userId: userId
  });
  
  const posts = data?.posts || [];
  const pagination = data?.pagination;

  return (
    <SidebarInset>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Quản lý bài viết</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-1 md:gap-6 md:py-2">
            <div className="md:hidden">
              <Image
                src="/examples/tasks-light.png"
                width={1280}
                height={998}
                alt="Playground"
                className="block dark:hidden"
              />
              <Image
                src="/examples/tasks-dark.png"
                width={1280}
                height={998}
                alt="Playground"
                className="hidden dark:block"
              />
            </div>
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
              <div className="flex items-center justify-between space-y-2">
                <div>
                      <h2 className="text-2xl font-bold tracking-tight">Quản lý bài viết</h2>
                  <p className="text-muted-foreground">
                    Đây là danh sách bài viết của bạn!
                  </p>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  {/* Table header skeleton */}
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <Skeleton className="h-9 w-[250px]" />
                    <Skeleton className="h-9 w-[200px]" />
                  </div>
                  
                  {/* Table rows skeleton */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <DataTable 
                  data={posts} 
                  columns={PostDataColumn}
                  initialPageSize={pageSize}
                  initialPageIndex={pageIndex}
                  pageCount={pagination ? Math.ceil(pagination.total / pagination.perPage) : 0}
                  onPaginationChange={(updatedPagination: { pageIndex: number; pageSize: number }) => {
                    setPageSize(updatedPagination.pageSize);
                    setPageIndex(updatedPagination.pageIndex);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
