export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  postTime: number;
  isHide: boolean;
  createdAt: string;
  updatedAt: string | null;
  removedAt: string | null;
}

export interface PackageListResponse {
  status: string;
  data: {
    packages: Package[];
    pagination: {
      total: number;
      perPage: number;
      currentPage: number;
    };
  };
  message: string;
}

export interface PackageResponse {
  status: string;
  data: {
    package: Package;
  };
  message: string;
}

export interface PackageSearchParams {
  id?: string;
  title?: string;
  defaultSearch?: {
    perPage: number;
    currentPage: number;
  };
} 