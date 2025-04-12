"use client";

import { useState, useRef, useEffect } from "react";
import { useProfile, useUpdateProfileWithAvatar, useChangePassword } from "@/app/hooks/useProfile";
import { 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Shield, 
  Check, 
  User as LucideUser, 
  Edit, 
  Camera,
  BookOpen,
  Settings,
  LogOut,
  Loader2,
  Lock,
  Package
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ProfileEditForm } from "./components/profile-edit-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { logout } from "@/app/services/authService";
import { PackageHistoryTab } from "./components/package-history";

// Converts timestamp to readable date format
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Password change form schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { data: profileData, isLoading, error, refetch } = useProfile();
  const profile = profileData?.data;
  
  const { mutateAsync: updateProfileWithAvatar, isPending: isUpdatingAvatar } = useUpdateProfileWithAvatar();
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useChangePassword();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };
  
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;
    
    try {
      // Create FormData for avatar update
      const formData = new FormData();
      
      // Add profile info
      formData.append("id", profile.id);
      formData.append("fullName", profile.fullName);
      formData.append("email", profile.email);
      formData.append("phoneNumber", profile.phoneNumber || "");
      formData.append("dob", profile.dob || "");
      
      // Add the avatar file
      formData.append("avatarFile", file);
      
      await updateProfileWithAvatar(formData);
      toast.success("Avatar updated successfully");
      refetch();
    } catch (error) {
      console.error("Failed to update avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
    }
  };

  const onSubmitPasswordChange = async (data: PasswordFormValues) => {
    try {
      const result = await changePassword(data);
      if (result.status === "success") {
        toast.success(result.message || "Password changed successfully");
        setIsPasswordDialogOpen(false);
        passwordForm.reset();
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleLogout = () => {
    if (isMounted) {
      // Use the logout function from authService
      logout();
      
      // Redirect to login
      router.push("/login");
      toast.success("Logged out successfully");
    }
  };

  if (isLoading || !isMounted) {
    return (
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium">Hồ sơ của tôi</h1>
          </div>
        </header>
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardHeader className="h-48 bg-gradient-to-r from-primary/20 to-primary/30"></CardHeader>
            <CardContent className="pt-0 pb-6">
              <div className="flex flex-col items-center -mt-20">
                <Skeleton className="h-36 w-36 rounded-full border-4 border-background" />
                <div className="mt-4 text-center space-y-2 w-full max-w-md">
                  <Skeleton className="h-8 w-48 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Skeleton className="h-12 w-full max-w-md mx-auto rounded-lg mb-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="md:col-span-1 space-y-6">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                  </div>
                  <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    );
  }

  if (error || !profile) {
    return (
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium">Hồ sơ của tôi</h1>
          </div>
        </header>
        
        <div className="max-w-md mx-auto px-4 py-8">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Profile</CardTitle>
              <CardDescription>
                {error instanceof Error ? error.message : "Failed to load profile data"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.reload()} 
                variant="destructive"
                className="w-full"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Hồ sơ của tôi</h1>
        </div>
      </header>
      
      <div className="min-h-screen bg-background">
        <div className="w-full">
          {/* Profile Header */}
          <Card className="rounded-none border-none shadow-none">
            {/* Banner */}
            <div className="h-48 sm:h-64 md:h-80 relative overflow-hidden">
              <Image
                fill 
                src="/images/hero.avif" 
                alt="Profile Banner" 
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Profile Info */}
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-end -mt-16 md:-mt-12">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
                    <AvatarFallback className="text-4xl">
                      {profile.userName ? profile.userName.substring(0, 2).toUpperCase() : 
                       profile.fullName ? profile.fullName.substring(0, 2).toUpperCase() : 
                       <LucideUser className="h-12 w-12" />}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
                    onClick={handleAvatarClick}
                    disabled={isUpdatingAvatar}
                  >
                    {isUpdatingAvatar ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Camera className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                
                {/* Main Info */}
                <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 text-center md:text-left">
                  <div>
                    <p className="text-muted-foreground mb-4">
                      @{profile.userName}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant={profile.status === 1 ? "default" : "secondary"} className="px-2 py-1">
                        {profile.status === 1 ? (
                          <><Check className="h-3 w-3 mr-1" /> Active</>
                        ) : (
                          'Inactive'
                        )}
                      </Badge>
                      <Badge variant="outline" className="px-2 py-1">
                        {profile.type === 1 ? 'Host' : 'User'}
                      </Badge>
                      <HoverCard>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Account Details</h4>
                              <div className="flex items-center pt-2">
                                <Calendar className="h-4 w-4 opacity-70 mr-2" />
                                <span className="text-xs text-muted-foreground">
                                  Date of Birth: {formatDate(profile.dob)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Sheet open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                          <Edit className="h-3.5 w-3.5 mr-1.5" /> Chỉnh sửa hồ sơ
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Chỉnh sửa hồ sơ</SheetTitle>
                          <SheetDescription>
                            Chỉnh sửa thông tin hồ sơ ở đây. Nhấn lưu khi bạn hoàn tất.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                          <ProfileEditForm 
                            profile={profile}
                            onSuccess={() => {
                              setIsEditingProfile(false);
                              refetch();
                                  toast.success("Hồ sơ đã được cập nhật thành công");
                            }}
                            onCancel={() => setIsEditingProfile(false)}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hồ sơ</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setIsEditingProfile(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          <span>Chỉnh sửa hồ sơ</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
                          <Lock className="h-4 w-4 mr-2" />
                          <span>Đổi mật khẩu</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          <span>Đăng xuất</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Tabs and Content */}
          <div className="container mx-auto px-4 py-6">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <div className="border-b mb-6">
                <TabsList className="bg-transparent h-12 w-full justify-start rounded-none p-0">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 px-6"
                  >
                    Tổng quan
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 px-6"
                  >
                  Cài đặt
                  </TabsTrigger>
                  <TabsTrigger 
                    value="packages" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 px-6"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    <span>Gói dịch vụ</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center justify-between">
                          <span>Thông tin liên hệ</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingProfile(true)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                          <span className="text-sm">{profile.phoneNumber || "No phone number"}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center justify-between">
                          <span>Thông tin cá nhân</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingProfile(true)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-3" />
                          <span className="text-sm">
                            {formatDate(profile.dob)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Main Content */}
                  <div className="lg:col-span-3 space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Địa chỉ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm">
                              {profile.province && profile.district && profile.ward ? (
                                <>
                                  {profile.address}, {profile.ward}, {profile.district}, {profile.province}
                                </>
                              ) : (
                                "Không có thông tin địa chỉ."
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar - Left column */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Cài đặt hồ sơ</CardTitle>
                        <CardDescription>Quản lý thông tin hồ sơ công khai</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">Cập nhật thông tin hồ sơ, ảnh đại diện và thông tin công khai.</p>
                          <Button variant="outline" onClick={() => setIsEditingProfile(true)}>Chỉnh sửa hồ sơ</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Main Content - Right column */}
                  <div className="lg:col-span-3 space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Cài đặt bảo mật</CardTitle>
                        <CardDescription>Quản lý bảo mật tài khoản</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">Đổi mật khẩu và quản lý cài đặt bảo mật.</p>
                          <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>Đổi mật khẩu</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="packages">
                <PackageHistoryTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu hiện tại và một mật khẩu mới để cập nhật thông tin tài khoản.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPasswordChange)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Nhập mật khẩu hiện tại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Xác nhận mật khẩu mới" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPasswordDialogOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang thay đổi...
                    </>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
} 