export interface SignUpRequest {
  fullName: string;
  email: string;
  userName: string;
  password: string;
  dob: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  status: number;
  gender: boolean;
  type: number;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    fullName: string;
    email: string;
    userName: string;
    phoneNumber: string;
    status: number;
    type: number;
  };
}

export interface SignInRequest {
  userName: string;
  password: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    roles: string[];
    user?: {
      id: string;
      fullName: string;
      email: string;
      userName: string;
      phoneNumber: string;
      status: number;
      type: number;
    };
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: string | null;
  data: null;
  message: string;
} 