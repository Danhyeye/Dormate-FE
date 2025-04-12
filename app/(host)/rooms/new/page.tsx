"use client";

import { useState, useRef } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useCreateRoom } from "@/app/hooks/useRoom"
import { usePackageHistory } from "@/app/hooks/useProfile"
import { RoomStatus } from "@/app/types/room"

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  province: z.string().min(1, { message: "Province is required" }),
  district: z.string().min(1, { message: "District is required" }),
  ward: z.string().min(1, { message: "Ward is required" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  area: z.coerce.number().min(1, { message: "Area must be at least 1 square meter" }),
  price: z.coerce.number().min(1, { message: "Price must be greater than 0" }),
  status: z.coerce.number(),
  isHide: z.boolean(),
  packageId: z.string().min(1, { message: "Package is required" }),
  availableTo: z.date().optional(),
});

type RoomFormValues = z.infer<typeof formSchema>;

export default function CreateRoomPage() {
  const router = useRouter();
  const { mutateAsync: createRoom, isPending } = useCreateRoom();
  const { data: packageHistory, isLoading: isLoadingPackages } = usePackageHistory();
  const [mainPicture, setMainPicture] = useState<File | null>(null);
  const [subPictures, setSubPictures] = useState<File[]>([]);
  const mainPictureRef = useRef<HTMLInputElement>(null);
  const subPictureRef = useRef<HTMLInputElement>(null);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      province: "",
      district: "",
      ward: "",
      address: "",
      area: 0,
      price: 0,
      status: RoomStatus.Pending,
      isHide: false,
      packageId: "",
    },
  } as const);

  const handleMainPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMainPicture(e.target.files[0]);
    }
  };

  const handleSubPicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSubPictures(filesArray);
    }
  };

  const resetMainPicture = () => {
    setMainPicture(null);
    if (mainPictureRef.current) {
      mainPictureRef.current.value = "";
    }
  };

  const resetSubPictures = () => {
    setSubPictures([]);
    if (subPictureRef.current) {
      subPictureRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<RoomFormValues> = async (values) => {
    try {
      // Check for auth token
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You must be logged in to create a room. Please log in and try again.");
        return;
      }

      if (!mainPicture) {
        toast.error("Main picture is required");
        return;
      }

      if (!values.packageId) {
        toast.error("Package selection is required");
        return;
      }

      // Prepare the data for room creation
      const availableFrom = new Date();
      const availableTo = values.availableTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      console.log("Submitting room with values:", {
        ...values,
        availableFrom: availableFrom.toISOString(),
        availableTo: availableTo.toISOString(),
        mainPicture: mainPicture?.name || "No file selected",
        subImages: subPictures.map(img => img.name).join(", ")
      });

      // Add explicit package ID log
      console.log("Using package ID:", values.packageId);

      // Use the createRoom mutation from useCreateRoom hook
      const result = await createRoom({
        name: values.name,
        description: values.description,
        price: values.price,
        area: values.area,
        province: values.province,
        district: values.district,
        ward: values.ward,
        address: values.address,
        status: values.status,
        packageId: values.packageId,
        mainPicture: mainPicture,
        subImage: subPictures,
        availableFrom,
        availableTo
      });
      
      console.log("Room creation result:", result);
      toast.success("Room created successfully");
      router.push("/rooms");
    } catch (error: any) {
      console.error("Error creating room:", error);
      console.error("Error details:", error.response?.data || "No response data");
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to create room";
      toast.error(errorMessage);
    }
  };

  return (
    <SidebarInset>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Add New Room</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="container max-w-4xl py-6 mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Create New Room</h2>
            <p className="text-muted-foreground">
              Fill out the form below to create a new room listing.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Room name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Price" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Room description" className="min-h-32" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Location</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input placeholder="District" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ward</FormLabel>
                          <FormControl>
                            <Input placeholder="Ward" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Area in square meters" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Images</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <FormLabel className="block mb-2">Main Picture (Required)</FormLabel>
                      <div className="flex items-center gap-4">
                        <Input 
                          ref={mainPictureRef}
                          type="file" 
                          accept="image/*" 
                          onChange={handleMainPictureChange}
                        />
                        {mainPicture && (
                          <Button variant="outline" type="button" onClick={resetMainPicture}>
                            Clear
                          </Button>
                        )}
                      </div>
                      {mainPicture && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {mainPicture.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <FormLabel className="block mb-2">Additional Pictures</FormLabel>
                      <div className="flex items-center gap-4">
                        <Input 
                          ref={subPictureRef}
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={handleSubPicturesChange}
                        />
                        {subPictures.length > 0 && (
                          <Button variant="outline" type="button" onClick={resetSubPictures}>
                            Clear All
                          </Button>
                        )}
                      </div>
                      {subPictures.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {subPictures.length} file(s) selected
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Settings</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={RoomStatus.Pending.toString()}
                            value={field.value.toString()}
                            disabled
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pending" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={RoomStatus.Pending.toString()}>Pending</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="packageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a package" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingPackages ? (
                                <SelectItem value="loading" disabled>Loading packages...</SelectItem>
                              ) : packageHistory?.data && packageHistory.data.length > 0 ? (
                                packageHistory.data.map((pkg) => (
                                  <SelectItem key={pkg.id} value={pkg.packageId}>
                                    {`Package: ${pkg.packageId} (${pkg.postTime} posts)`}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-packages" disabled>No packages available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Room...
                    </>
                  ) : (
                    "Create Room"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </SidebarInset>
  );
}