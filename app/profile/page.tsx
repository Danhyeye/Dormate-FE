"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/app/hooks/useProfile";
import ProfileLoadingState from "@/app/components/profile/LoadingState";
import dynamic from "next/dynamic";

// Dynamically import ProfileForm with SSR disabled
const ProfileForm = dynamic(
  () => import("@/app/components/profile/ProfileForm"),
  { ssr: false }
);

export default function ProfilePage() {
  const router = useRouter();
  const { data: profileResponse, isLoading, isError, error } = useProfile();
  const [isMounted, setIsMounted] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isMounted) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router, isMounted]);

  // Show loading state
  if (isLoading || !isMounted) {
    return <ProfileLoadingState />;
  }

  // Show error state
  if (isError || !profileResponse?.data) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <h2 className="text-red-600 text-lg font-medium mb-2">Lỗi tải thông tin hồ sơ</h2>
          <p className="text-gray-700">{error instanceof Error ? error.message : "Vui lòng thử lại sau"}</p>
        </div>
      </div>
    );
  }

  const profile = profileResponse.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Hồ sơ người dùng</h1>
        <p className="text-gray-500">
          Quản lý thông tin hồ sơ và mật khẩu của bạn
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Thông tin hồ sơ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileForm profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 