export interface SubPicture {
  id: string;
  imageUrl: string;
}

export interface Post {
  phoneNumber: string | null;
  id: string;
  name: string;
  description: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note: string | null;
  area: number;
  price: number;
  mainPictureUrl: string;
  validateTo: string | null;
  subPictureUrl: SubPicture[];
  status: number;
  isHide: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string | null;
  removedAt: string | null;
  owner: string;
  packageId: string | null;
}

export interface PostApiResponse {
  status: string;
  message: string;
  phoneNumber: string | null;
  id: string;
  name: string;
  description: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note: string | null;
  area: number;
  price: number;
  mainPictureUrl: string;
  validateTo: string | null;
  subPictureUrl: SubPicture[];
  isHide: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string | null;
  removedAt: string | null;
  owner: string;
  packageId: string | null;
}

export interface PostSearchParams {
  id?: string;
  name?: string;
  userId?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  fromPrice?: number;
  toPrice?: number;
  status?: number;
  defaultSearch?: {
    perPage: number;
    currentPage: number;
  };
}

export interface PostListResponse {
  status: string;
  data: {
    rooms: Post[];
    pagination: {
      total: number;
      perPage: number;
      currentPage: number;
    };
  };
  message: string;
}

export interface CreatePostRequest {
  name: string;
  description: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note?: string;
  area: number;
  price: number;
  mainPicture?: File;
  subImage?: File[];
  status?: number;
  isHide?: boolean;
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: string;
} 