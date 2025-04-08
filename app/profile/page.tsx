"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/app/hooks/useProfile";
import ProfileForm from "@/app/components/profile/ProfileForm";
import ProfileLoadingState from "@/app/components/profile/LoadingState";

export default function ProfilePage() {
  const router = useRouter();
  const { data: profileResponse, isLoading, isError, error } = useProfile();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Show loading state
  if (isLoading) {
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