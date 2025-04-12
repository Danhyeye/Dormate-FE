"use client";

import { useState } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Edit,
  Eye,
  MoreHorizontal,
  PackageCheck,
  PackagePlus,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { usePackagesList } from "@/app/hooks/usePackage";
import { Package } from "@/app/types/package";

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    postTime: "",
    isHide: false,
  });

  const { data, isLoading, error } = usePackagesList();
  
  // Filter packages based on search term
  const filteredPackages = data?.packages.filter(pkg => 
    (pkg.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (pkg.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) || [];
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddPackage = () => {
    setSelectedPackage(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      duration: "",
      postTime: "",
      isHide: false,
    });
    setIsPackageDialogOpen(true);
  };
  
  const handleEditPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration.toString(),
      postTime: pkg.postTime.toString(),
      isHide: pkg.isHide,
    });
    setIsPackageDialogOpen(true);
  };
  
  const handleDeletePackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedPackage) {
      // In a real app, you would make an API call here
      toast.success(`Package "${selectedPackage.title}" deleted successfully`);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitPackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.price || !formData.duration || !formData.postTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Format the data
    const packageData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      postTime: parseInt(formData.postTime),
    };
    
    if (selectedPackage) {
      // Update existing package (in a real app, this would be an API call)
      toast.success(`Package "${packageData.title}" updated successfully`);
    } else {
      // Add new package (in a real app, this would be an API call)
      toast.success(`Package "${packageData.title}" created successfully`);
    }
    
    setIsPackageDialogOpen(false);
  };
  
  if (error) {
    return (
      <SidebarInset>
        <div className="container mx-auto py-6 px-4 md:px-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-destructive">
                Error loading packages. Please try again later.
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    );
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          <h1 className="text-base font-medium">Package Management</h1>
        </div>
      </header>
      
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
            <p className="text-muted-foreground">
              Manage subscription packages for hosts
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={handleAddPackage}>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Package Directory</CardTitle>
            <CardDescription>
              View and manage all subscription packages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search packages..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-60" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPackages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No packages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <PackageCheck className="h-4 w-4 text-primary" />
                              </div>
                              {pkg.title}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {pkg.description}
                          </TableCell>
                          <TableCell>{formatCurrency(pkg.price)}</TableCell>
                          <TableCell>{pkg.duration} month{pkg.duration !== 1 ? 's' : ''}</TableCell>
                          <TableCell>{pkg.postTime} post{pkg.postTime !== 1 ? 's' : ''}</TableCell>
                          <TableCell>
                            <Badge
                              variant={!pkg.isHide ? "outline" : "secondary"}
                              className={`font-normal ${
                                !pkg.isHide ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800" : ""
                              }`}
                            >
                              {!pkg.isHide ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditPackage(pkg)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeletePackage(pkg)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add/Edit Package Dialog */}
      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
            <DialogDescription>
              {selectedPackage ? "Update package information" : "Create a new subscription package"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPackage}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Package Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Basic Package"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the package features"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="19.99"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    placeholder="3"
                    value={formData.duration}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postTime">Number of Posts</Label>
                  <Input
                    id="postTime"
                    name="postTime"
                    type="number"
                    min="1"
                    placeholder="10"
                    value={formData.postTime}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isHide">Status</Label>
                  <select
                    id="isHide"
                    name="isHide"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.isHide.toString()}
                    onChange={handleFormChange}
                  >
                    <option value="false">Active</option>
                    <option value="true">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={() => setIsPackageDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedPackage ? "Update Package" : "Create Package"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this package? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <div className="py-4">
              <p className="font-medium">{selectedPackage.title}</p>
              <p className="text-sm text-muted-foreground">{selectedPackage.description}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
}

// Loading skeleton
function PackagesSkeleton() {
  return (
    <SidebarInset>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Package Management</h1>
        </div>
      </header>
      
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="mt-4 md:mt-0">
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="rounded-md border p-4">
              <Skeleton className="h-10 w-full mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48 flex-1" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
} 