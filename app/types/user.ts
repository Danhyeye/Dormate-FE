export interface User {
  id: string;
  fullName: string;
  email: string;
  userName: string;
  dob: string | null;
  phoneNumber: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  gender: boolean | null;
  status: number;
  rolesName: string[];
}

export interface UserListResponse {
  total: number;
  data: User[];
  page: number;
  perPage: number;
}

export interface UserSearchParams {
  perPage?: number;
  currentPage?: number;
} 