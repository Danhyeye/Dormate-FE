"use client";

import { useState } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRooms, useUpdateRoomStatus } from "@/app/hooks/useRoom";
import { Room, RoomStatus } from "@/app/types/room";
import { formatCurrency, formatDateTime } from "@/app/services/RequestManager";

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 10;
  
  const { data, isLoading, error, refetch } = useRooms(perPage, currentPage);
  const updateRoomStatus = useUpdateRoomStatus();
  
  // Filter rooms with pending status
  const pendingRooms = data?.rooms.filter(room => room.status === RoomStatus.Pending) || [];
  
  // Filter rooms based on search term
  const filteredRooms = pendingRooms.filter(room => 
    (room.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (room.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (room.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  // Pagination data
  const totalPages = data?.pagination ? Math.ceil(data.pagination.total / perPage) : 0;
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsViewDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedRoom) {
      // In a real app, you would make an API call here
      toast.success(`Room "${selectedRoom.name}" deleted successfully`);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (roomId: string, newStatus: RoomStatus) => {
    setSelectedRoom(data?.rooms.find(room => room.id === roomId) || null);
    setSelectedStatus(newStatus);
    setIsStatusDialogOpen(true);
  };
  
  const confirmStatusChange = async () => {
    if (selectedRoom && selectedStatus !== null) {
      try {
        await updateRoomStatus.mutateAsync({ 
          roomId: selectedRoom.id, 
          status: selectedStatus,
          note: statusNote
        });
        
        const statusLabels = {
          [RoomStatus.Pending]: "Pending",
          [RoomStatus.Approved]: "Approved",
          [RoomStatus.Rejected]: "Rejected",
          [RoomStatus.Available]: "Available",
          [RoomStatus.Rented]: "Rented",
          [RoomStatus.Hide]: "Hidden",
        };
        
        toast.success(`Room "${selectedRoom.name}" status updated to ${statusLabels[selectedStatus]}`);
        
        // Close dialog
        setIsStatusDialogOpen(false);
        setStatusNote("");
        
        // Explicitly refetch the data
        refetch();
      } catch (error) {
        toast.error("Failed to update room status");
        console.error("Error updating room status:", error);
      }
    }
  };
  
  const getStatusBadge = (status: RoomStatus) => {
    const statusConfig = {
      [RoomStatus.Pending]: { label: "Pending", variant: "secondary" },
      [RoomStatus.Approved]: { label: "Approved", variant: "outline" },
      [RoomStatus.Rejected]: { label: "Rejected", variant: "destructive" },
      [RoomStatus.Available]: { label: "Available", variant: "default" },
      [RoomStatus.Rented]: { label: "Rented", variant: "outline" },
      [RoomStatus.Hide]: { label: "Hidden", variant: "secondary" },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant as any} className="font-normal">
        {config.label}
      </Badge>
    );
  };
  
  if (error) {
    return (
      <SidebarInset>
        <div className="container mx-auto py-6 px-4 md:px-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-destructive">
                Error loading rooms. Please try again later.
              </div>
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
          <h1 className="text-base font-medium">Quản lý phòng</h1>
        </div>
      </header>
      
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Phòng</h1>
            <p className="text-muted-foreground">
              Quản lý tất cả phòng trong hệ thống
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Danh sách phòng</CardTitle>
            <CardDescription>
              Xem và quản lý tất cả phòng trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm phòng..."
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
                        <TableHead>Tên phòng</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Địa chỉ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Không tìm thấy phòng
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Eye className="h-4 w-4 text-primary" />
                              </div>
                              {room.name}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {room.description}
                          </TableCell>
                          <TableCell>{formatCurrency(room.price)}</TableCell>
                          <TableCell>{room.address}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  {getStatusBadge(room.status)}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thay đổi trạng thái</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusChange(room.id, RoomStatus.Pending)}>
                                  Chờ duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(room.id, RoomStatus.Approved)}>
                                  Đã duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(room.id, RoomStatus.Rejected)}>
                                  Từ chối
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Action</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewDetails(room)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteRoom(room)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa
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
            
            {/* Pagination Controls */}
            {!isLoading && totalPages > 0 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  {`Showing ${filteredRooms.length} of ${data?.pagination?.total || 0} pending rooms`}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <div className="text-sm">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1 || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết phòng</DialogTitle>
            <DialogDescription>
              Xem và quản lý thông tin phòng
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tên</Label>
                  <p className="font-medium">{selectedRoom.name}</p>
                </div>
                <div>
                  <Label>Giá</Label>
                  <p className="font-medium">{formatCurrency(selectedRoom.price)}</p>
                </div>
                <div>
                  <Label>Diện tích</Label>
                  <p className="font-medium">{selectedRoom.area} m²</p>
                </div>
                <div>
                  <Label>Trạng thái</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedRoom.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedStatus(selectedRoom.status);
                        setIsStatusDialogOpen(true);
                      }}
                    >
                      Thay đổi
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Mô tả</Label>
                <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tỉnh/Thành phố</Label>
                  <p className="font-medium">{selectedRoom.province}</p>
                </div>
                <div>
                  <Label>Quận/Huyện</Label>
                  <p className="font-medium">{selectedRoom.district}</p>
                </div>
                <div>
                  <Label>Phường/Xã</Label>
                  <p className="font-medium">{selectedRoom.ward}</p>
                </div>
                <div>
                  <Label>Địa chỉ</Label>
                  <p className="font-medium">{selectedRoom.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ngày tạo</Label>
                  <p className="font-medium">{formatDateTime(selectedRoom.createdAt, "dd/MM/yyyy HH:mm")}</p>
                </div>
                <div>
                  <Label>Ngày cập nhật</Label>
                  <p className="font-medium">
                    {selectedRoom.updatedAt ? formatDateTime(selectedRoom.updatedAt, "dd/MM/yyyy HH:mm") : "Không cập nhật"}
                  </p>
                </div>
              </div>

              {selectedRoom.mainPicture && (
                <div>
                  <Label>Hình ảnh chính</Label>
                  <div className="mt-2">
                    <img
                      src={selectedRoom.mainPicture}
                      alt={selectedRoom.name}
                      className="rounded-lg w-full max-w-md"
                    />
                  </div>
                </div>
              )}

              {selectedRoom.subPictureUrl && selectedRoom.subPictureUrl.length > 0 && (
                <div>
                  <Label>Hình ảnh khác</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedRoom.subPictureUrl.map((picture, index) => (
                      <img
                        key={index}
                        src={picture.imageUrl}
                        alt={`${selectedRoom.name} - ${index + 1}`}
                        className="rounded-lg w-full h-24 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái phòng</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái của phòng này
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && selectedStatus !== null && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Phòng</Label>
                <p className="font-medium">{selectedRoom.name}</p>
                <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
              </div>
              <div>
                <Label>Trạng thái mới</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start mt-1.5">
                      {getStatusBadge(selectedStatus)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[200px]">
                    <DropdownMenuItem onClick={() => setSelectedStatus(RoomStatus.Pending)}>
                      {getStatusBadge(RoomStatus.Pending)}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus(RoomStatus.Approved)}>
                      {getStatusBadge(RoomStatus.Approved)}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus(RoomStatus.Rejected)}>
                      {getStatusBadge(RoomStatus.Rejected)}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú (Tùy chọn)</Label>
                <Textarea
                  id="note"
                  placeholder="Thêm ghi chú về sự thay đổi trạng thái..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsStatusDialogOpen(false);
              setStatusNote("");
            }}>
              Hủy bỏ
            </Button>
            <Button onClick={confirmStatusChange}>
              Cập nhật trạng thái
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa phòng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="py-4">
              <p className="font-medium">{selectedRoom.name}</p>
              <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
}
