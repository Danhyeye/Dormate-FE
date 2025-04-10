export enum RoomStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Available = 3,
  Rented = 4,
  Hide = 5,
}

export interface SubPicture {
  id: string
  imageUrl: string
}

export interface Room {
  id: string
  name: string
  description: string
  price: number
  area: number
  province: string
  district: string
  ward: string
  address: string
  mainPicture?: string
  mainPictureUrl?: string
  subImage?: string[]
  subPictureUrl?: SubPicture[]
  status: RoomStatus
  ownerId?: string
  owner?: string
  note?: string | null
  createdAt: Date
  updatedAt: Date | null
  availableFrom?: Date
  availableTo?: Date
  validateTo?: string
  createdById?: string | null
  removedAt?: string | null
  isHide?: boolean
  packageId?: string | null
}

export interface RoomResponse {
  status: string
  message: string
  data: {
    rooms?: Room[]
    room?: Room
    pagination?: {
      total: number
      perPage: number
      currentPage: number
    }
  }
}

export interface CreateRoomRequest {
  name: string
  description: string
  price: number
  area: number
  province: string
  district: string
  ward: string
  address: string
  mainPicture?: File
  subImage?: File[]
  status: RoomStatus
  packageId?: string 
  availableFrom: Date
  availableTo: Date
}

export interface UpdateRoomRequest extends CreateRoomRequest {
  id: string
} 