// 'use client';

// import { useEffect, useState, useMemo, useRef } from 'react';
// import { getUserProfile, updateProfile } from '@/lib/user/services/fetchUser';
// import { 
//   Mail, 
//   Phone, 
//   Calendar, 
//   Clock, 
//   Shield, 
//   Check, 
//   User as LucideUser, 
//   MapPin, 
//   Edit, 
//   Camera,
//   BookOpen,
//   FileEdit,
//   Settings,
//   LogOut,
//   Loader2,
//   Lock
// } from 'lucide-react';

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Separator } from '@/components/ui/separator';
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from '@/components/ui/hover-card';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import Image from 'next/image';
// import { EditProfileForm } from '@/app/components/EditProfileForm';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import Link from 'next/link';
// import { formatDate } from '@/utils/dates/format-date';

// interface Profile {
//   id: string;
//   username: string;
//   "user-name"?: string;
//   "full-name": string;
//   email: string;
//   "phone-number": string;
//   avatar: string;
//   status: string ;
//   role: string ;
//   about: string;
//   birthdate: string;
//   "joined-at": string;
// }


// // Map User object to Profile format
// const mapUserToProfile = (user: any): Profile => {
//   return {
//     id: user.id || '',
//     username: user.username || user["user-name"] || '',
//     "user-name": user["user-name"] || user.userName || '',
//     "full-name": user.name || user.fullName || user["full-name"] || '',
//     email: user.email || '',
//     "phone-number": user.phoneNumber || user["phone-number"] || '',
//     avatar: user.avatar || '',
//     status: user.status !== undefined ? user.status : "Offline",
//     role: user.role !== undefined ? user.role : "User",
//     about: user.about || '',
//     birthdate: user.birthDate || user.birthdate || '',
//     "joined-at": user["joined-at"] || new Date().toISOString()
//   };
// };

// export default function ProfilePage() {
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
//   const avatarInputRef = useRef<HTMLInputElement>(null);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const userData = await getUserProfile();
//       setProfile(mapUserToProfile(userData));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleAvatarClick = () => {
//     avatarInputRef.current?.click();
//   };
  
//   const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file || !profile) return;
    
//     try {
//       setIsUploadingAvatar(true);
      
//       // Create FormData for multipart/form-data request
//       const formData = new FormData();
      
//       // Include ID
//       formData.append('id', profile.id);
      
//       // Add all profile fields to FormData using the expected field names
//       formData.append('userName', profile["user-name"] || profile.username);
//       formData.append('fullName', profile["full-name"]);
//       formData.append('email', profile.email);
//       formData.append('phoneNumber', profile["phone-number"]);
//       formData.append('status', profile.status);
//       formData.append('role', profile.role);
//       formData.append('about', profile.about || '');
//       formData.append('birthDate', profile.birthdate || '');
      
//       // Add the avatar file
//       formData.append('avatarFile', file);
      
//       // Debug: Log which fields we're sending
//       console.log('Sending avatar update with fields:', {
//         id: profile.id,
//         userName: profile["user-name"] || profile.username,
//         fullName: profile["full-name"],
//         email: profile.email,
//         phoneNumber: profile["phone-number"],
//         status: profile.status,
//         role: profile.role,
//         about: profile.about || '',
//         birthDate: profile.birthdate || '',
//         avatarFileName: file.name
//       });
      
//       // Update profile with FormData directly
//       await updateProfile(formData as any);
      
//       // Refresh profile data
//       void fetchProfile();
//     } catch (error) {
//       console.error('Failed to update avatar:', error);
//       alert('Failed to update avatar. Please try again.');
//     } finally {
//       setIsUploadingAvatar(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-background min-h-screen py-10">
//         <div className="max-w-6xl mx-auto px-4">
//           <Card>
//             <CardHeader className="h-48 bg-gradient-to-r from-primary/20 to-primary/30"></CardHeader>
//             <CardContent className="pt-0 pb-6">
//               <div className="flex flex-col items-center -mt-20">
//                 <Skeleton className="h-36 w-36 rounded-full border-4 border-background" />
//                 <div className="mt-4 text-center space-y-2 w-full max-w-md">
//                   <Skeleton className="h-8 w-48 mx-auto" />
//                   <Skeleton className="h-4 w-32 mx-auto" />
//                   <div className="flex flex-wrap gap-2 justify-center mt-2">
//                     <Skeleton className="h-6 w-16 rounded-full" />
//                     <Skeleton className="h-6 w-16 rounded-full" />
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-6">
//                 <Skeleton className="h-12 w-full max-w-md mx-auto rounded-lg mb-6" />
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
//                   <div className="md:col-span-1 space-y-6">
//                     <Skeleton className="h-[200px] w-full rounded-lg" />
//                   </div>
//                   <div className="md:col-span-2 space-y-6">
//                     <Skeleton className="h-[300px] w-full rounded-lg" />
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-background min-h-screen py-10">
//         <div className="max-w-md mx-auto px-4">
//           <Card className="border-destructive/50">
//             <CardHeader>
//               <CardTitle className="text-destructive">Error Loading Profile</CardTitle>
//               <CardDescription>{error}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button 
//                 onClick={() => window.location.reload()} 
//                 variant="destructive"
//                 className="w-full"
//               >
//                 Try Again
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="bg-background min-h-screen py-10">
//         <div className="max-w-md mx-auto px-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>No Profile Data Available</CardTitle>
//               <CardDescription>We couldn't find your profile information.</CardDescription>
//             </CardHeader>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="w-full">
//         {/* Profile Header */}
//         <Card className="rounded-none border-none shadow-none">
//           {/* Banner */}
//           <div className="h-48 sm:h-64 md:h-80 relative overflow-hidden">
//             <Image
//               fill 
//               src="/hero.png" 
//               alt="Profile Banner" 
//               className="w-full h-full object-cover"
//               priority
//             />
//             <div className="absolute inset-0 bg-black/20"></div>
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
//             >
//               <Camera className="h-4 w-4" />
//             </Button>
//           </div>
          
//           {/* Profile Info */}
//           <div className="container mx-auto px-4">
//             <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-end -mt-16 md:-mt-12">
//               {/* Avatar */}
//               <div className="relative">
//                 <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
//                   <AvatarImage src={profile.avatar} alt={profile["user-name"] || profile.username} />
//                   <AvatarFallback className="text-4xl">
//                     {profile["user-name"] ? profile["user-name"].substring(0, 2).toUpperCase() : 
//                      profile["full-name"] ? profile["full-name"].substring(0, 2).toUpperCase() : 
//                      <LucideUser className="h-12 w-12" />}
//                   </AvatarFallback>
//                 </Avatar>
//                 <Button 
//                   variant="secondary" 
//                   size="icon" 
//                   className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
//                   onClick={handleAvatarClick}
//                   disabled={isUploadingAvatar}
//                 >
//                   {isUploadingAvatar ? (
//                     <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                   ) : (
//                     <Camera className="h-3.5 w-3.5" />
//                   )}
//                 </Button>
//                 <input
//                   type="file"
//                   ref={avatarInputRef}
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                 />
//               </div>
              
//               {/* Main Info */}
//               <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 text-center md:text-left">
//                 <div>
//                   <p className="text-muted-foreground text-2xl mb-2">
//                     @{profile["user-name"] || profile.username}
//                   </p>
//                   <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//                     <Badge variant={profile.status === "Online" ? "default" : "secondary"} className="px-2 py-1">
//                       {profile.status === "Online" ? (
//                         <><Check className="h-3 w-3 mr-1" /> Active</>
//                       ) : (
//                         'Inactive'
//                       )}
//                     </Badge>
//                     <Badge variant={profile.role === "Admin" ? "outline" : "secondary"} className="px-2 py-1">
//                       {profile.role === "Admin" ? (
//                         <><Shield className="h-3 w-3 mr-1" /> Admin</>
//                       ) : (
//                         profile.role
//                       )}
//                     </Badge>
//                     <HoverCard>
//                       <HoverCardTrigger asChild>
//                         <Badge variant="outline" className="px-2 py-1 cursor-help">
//                           <Clock className="h-3 w-3 mr-1" /> 
//                           Joined {new Date(profile["joined-at"]).getFullYear()}
//                         </Badge>
//                       </HoverCardTrigger>
//                       <HoverCardContent className="w-80">
//                         <div className="flex justify-between space-x-4">
//                           <div className="space-y-1">
//                             <h4 className="text-sm font-semibold">Account Details</h4>
//                             <div className="flex items-center pt-2">
//                               <Calendar className="h-4 w-4 opacity-70 mr-2" />
//                               <span className="text-xs text-muted-foreground">
//                                 Member since {formatDate(profile["joined-at"])}
//                               </span>
//                             </div>
//                             <div className="flex items-center pt-2">
//                               <LucideUser className="h-4 w-4 opacity-70 mr-2" />
//                               <span className="text-xs text-muted-foreground">
//                                 User ID: {profile.id.substring(0, 8)}...
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </HoverCardContent>
//                     </HoverCard>
//                   </div>
//                 </div>
                
//                 {/* Actions */}
//                 <div className="flex gap-2">
//                   <Sheet open={isEditingProfile} onOpenChange={setIsEditingProfile}>
//                     <SheetTrigger asChild>
//                       <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
//                         <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
//                       </Button>
//                     </SheetTrigger>
//                     <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
//                       <SheetHeader>
//                         <SheetTitle>Edit Profile</SheetTitle>
//                         <SheetDescription>
//                           Make changes to your profile here. Click save when you're done.
//                         </SheetDescription>
//                       </SheetHeader>
//                       <div className="mt-6">
//                         {profile && (
//                           <EditProfileForm 
//                             profile={{
//                               ...profile,
//                               status: profile.status,
//                               role: profile.role
//                             }}
//                             onSuccess={() => {
//                               setIsEditingProfile(false);
//                               // Refresh the profile data
//                               void fetchProfile();
//                             }}
//                             onCancel={() => setIsEditingProfile(false)}
//                           />
//                         )}
//                       </div>
//                     </SheetContent>
//                   </Sheet>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-9 w-9">
//                         <Settings className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuLabel>Account</DropdownMenuLabel>
//                       <DropdownMenuItem onClick={() => setIsEditingProfile(true)}>
//                         <FileEdit className="h-4 w-4 mr-2" />
//                         <span>Edit Profile</span>
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-destructive">
//                         <LogOut className="h-4 w-4 mr-2" />
//                         <span>Log out</span>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
        
//         {/* Tabs and Content */}
//         <div className="container mx-auto px-4 py-6">
//           <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
//             <div className="border-b mb-6">
//               <TabsList className="bg-transparent h-12 w-full justify-start rounded-none p-0">
//                 <TabsTrigger 
//                   value="overview" 
//                   className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 px-6"
//                 >
//                   Overview
//                 </TabsTrigger>
//                 <TabsTrigger 
//                   value="settings" 
//                   className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 px-6"
//                 >
//                   Settings
//                 </TabsTrigger>
//               </TabsList>
//             </div>
            
//             {/* Overview Tab */}
//             <TabsContent value="overview" className="w-full">
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 {/* Sidebar */}
//                 <div className="lg:col-span-1 space-y-6">
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base font-medium flex items-center justify-between">
//                         <span>Contact Information</span>
//                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingProfile(true)}>
//                           <Edit className="h-3.5 w-3.5" />
//                         </Button>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <div className="flex items-center">
//                         <Mail className="h-4 w-4 text-muted-foreground mr-3" />
//                         <span className="text-sm">{profile.email}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Phone className="h-4 w-4 text-muted-foreground mr-3" />
//                         <span className="text-sm">{profile["phone-number"]}</span>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base font-medium flex items-center justify-between">
//                         <span>Personal Information</span>
//                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingProfile(true)}>
//                           <Edit className="h-3.5 w-3.5" />
//                         </Button>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 text-muted-foreground mr-3" />
//                         <span className="text-sm">
//                           {formatDate(profile.birthdate)}
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <Clock className="h-4 w-4 text-muted-foreground mr-3" />
//                         <span className="text-sm">Joined {formatDate(profile["joined-at"])}</span>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
                
//                 {/* Main Content */}
//                 <div className="lg:col-span-3 space-y-6">
//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base font-medium flex items-center justify-between">
//                         <span>About</span>
//                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditingProfile(true)}>
//                           <Edit className="h-3.5 w-3.5" />
//                         </Button>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <div className="bg-muted/50 p-4 rounded-lg">
//                           <p className="text-sm text-muted-foreground whitespace-pre-wrap">
//                             {profile.about || "No information provided. Add a personal bio to tell others about yourself."}
//                           </p>
//                         </div>
                        
//                         {!profile.about && (
//                           <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsEditingProfile(true)}>
//                             <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Add Bio
//                           </Button>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </TabsContent>
            
//             {/* Settings Tab */}
//             <TabsContent value="settings" className="w-full">
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 {/* Sidebar - Left column */}
//                 <div className="lg:col-span-1 space-y-6">
//                 <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base font-medium">Profile Settings</CardTitle>
//                       <CardDescription>Manage your public profile information</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <p className="text-sm text-muted-foreground">Update your profile information, avatar, and public details.</p>
//                         <Button variant="outline" onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
                
//                 {/* Main Content - Right column */}
//                 <div className="lg:col-span-3 space-y-6">

//                   <Card>
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base font-medium">Security Settings</CardTitle>
//                       <CardDescription>Manage your account security</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <p className="text-sm text-muted-foreground">Change your password and manage security preferences.</p>
//                         <Link href="/reset-password">
//                           <Button variant="outline">Change Password</Button>
//                         </Link>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-destructive/50">
//                     <CardHeader className="pb-2">
//                       <CardTitle className="text-base font-medium text-destructive">Danger Zone</CardTitle>
//                       <CardDescription>Permanent actions that affect your account</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
//                         <Button variant="destructive">Delete Account</Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }
