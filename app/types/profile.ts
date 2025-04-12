export interface Profile {
  id: string;
  fullName: string;
  email: string;
  userName: string;
  password: null | string;
  dob: string;
  phoneNumber: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  status: number;
  gender: boolean;
  type: number;
}

export interface ProfileResponse {
  status: string | null;
  data: Profile | null;
  message: string | null;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  dob?: string;
  phoneNumber?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  status?: number;
  gender?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdateResponse {
  status: string;
  data: Profile | null;
  message: string;
}

export interface PackageHistory {
  id: string;
  packageId: string;
  packageUserId: string;
  packageDuration: number;
  postTime: number;
  landlord: any | null;
  roomPackage: any | null;
}

export interface PackageHistoryResponse {
  status: string;
  data: PackageHistory[];
  message: string | null;
} 