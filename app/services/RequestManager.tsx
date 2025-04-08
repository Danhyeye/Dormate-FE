import axios from "axios";
import { format, toZonedTime } from "date-fns-tz";
import { vi } from "date-fns/locale";
import { SignInRequest, SignInResponse, ForgotPasswordResponse } from "../types/auth";
import { Post, PostApiResponse, PostListResponse, PostSearchParams } from "../types/post";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL_ROOMS = `${API_BASE_URL}/rooms`;
const API_URL_AUTH = `${API_BASE_URL}/auth`;
const API_URL_PROFILE = `${API_BASE_URL}/profile`;
const API_URL_BOOKINGS = `${API_BASE_URL}/bookings`;
const API_URL_POSTS = `${API_BASE_URL}/posts`;
const timeZone = process.env.TIMEZONE || "UTC";



export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-"); // Replace spaces with dashes
};

export function formatDateTime(date: Date | string, formatString: string) {
  const zonedDate = toZonedTime(new Date(date), timeZone);
  return format(zonedDate, formatString, { timeZone, locale: vi });
}



// export function formatCurrency(amount: number): string {
//   return new Intl.NumberFormat("vi-VN", {
//     style: "currency",
//     currency: "VND",
//   }).format(amount);
// }

export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}; 

interface RoomAPIResponse {
  _id: string;
  name: string;
  description: string;
  pricePerHour: number;
  pricePerNight: number;
  maxGuests: number;
  isAvailable: boolean;
  images: string[];
  amenities: string[];
  bedType: string;
  size: string;
  createdAt: Date;
  updatedAt: Date;
}




export const login = async (userName: string, password: string): Promise<{ 
  success: boolean; 
  message?: string; 
  data?: { 
    accessToken: string; 
    refreshToken?: string; 
    roles: string[];
    role?: string;
    user?: { 
      id: string; 
      fullName: string; 
      email: string; 
      userName: string; 
      phoneNumber: string; 
      status: number; 
      type: number; 
    } 
  } 
}> => {
  try {
    const signInData: SignInRequest = {
      userName,
      password,
    };

    const response = await axios.post<SignInResponse>(`${API_URL_AUTH}/signIn`, signInData);
    

    // Check explicitly for success field, not just HTTP status
    if (response.data && response.data.data?.accessToken) {
      const accessToken = response.data.data.accessToken;
      
      // Extract role from token
      const role = extractRoleFromToken(accessToken);
      
      // Store accessToken
      localStorage.setItem("accessToken", accessToken);
      
      // Store refreshToken if available
      if (response.data.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
      }

      // Extract and store userId
      const userId = response.data.data.user?.id || extractUserIdFromToken(accessToken);
      if (userId) {
        localStorage.setItem("userId", userId);
      }
      
      // Extract and store fullname from token or user object
      let fullname: string | undefined = response.data.data.user?.fullName;
      if (!fullname) {
        const nameFromToken = extractNameFromToken(accessToken);
        if (nameFromToken) {
          fullname = nameFromToken;
        }
      }

      
      
      if (fullname) {
        localStorage.setItem("fullname", fullname);
      }
      
      return { 
        success: true,
        data: {
          accessToken,
          refreshToken: response.data.data.refreshToken,
          role,
          roles: response.data.data.roles,
          user: response.data.data.user
        }
      };
    }

    // If we reach here, it means we got a 200 OK but no proper data
    console.log("Login failed: No proper data in response");
    return { 
      success: false, 
      message: response.data.message || "Sai tên đăng nhập hoặc mật khẩu" 
    };
  } catch (error: any) {
    console.error("Error during login:", error);
    // Handle API error responses
    if (error.response && error.response.data) {
      return { 
        success: false, 
        message: error.response.data.message || "Sai tên đăng nhập hoặc mật khẩu" 
      };
    }
    // Handle network or other errors
    return { 
      success: false, 
      message: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau." 
    };
  }
};

// Helper function to extract userId from JWT token
function extractUserIdFromToken(token: string): string | null {
  try {
    // Get the payload part of the token (second part)
    const payload = token.split('.')[1];
    // Decode the base64 string
    const decodedPayload = atob(payload);
    // Parse the JSON
    const claims = JSON.parse(decodedPayload);
    // Return the userId from claims
    return claims.userId || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"] || null;
  } catch (error) {
    console.error("Error extracting userId from token:", error);
    return null;
  }
}

// Helper function to extract name from JWT token
function extractNameFromToken(token: string): string | null {
  try {
    // Get the payload part of the token (second part)
    const payload = token.split('.')[1];
    // Decode the base64 string
    const decodedPayload = atob(payload);
    // Parse the JSON
    const claims = JSON.parse(decodedPayload);
    // Return the name from claims
    return claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null;
  } catch (error) {
    console.error("Error extracting name from token:", error);
    return null;
  }
}

function extractRoleFromToken(token: string): string | undefined {
  try {
    // Get the payload part of the token (second part)
    const payload = token.split('.')[1];
    // Decode the base64 string
    const decodedPayload = atob(payload);
    // Parse the JSON
    const claims = JSON.parse(decodedPayload);
    // Return the role from claims
    return claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || undefined;
  } catch (error) {
    console.error("Error extracting role from token:", error);
    return undefined;
  }
}

export const register = async (
  fullname: string,
  phone: string,
  password: string,
  identification: string,
  imagesID: File,
  email: string
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("identification", identification);
    formData.append("email", email);
    formData.append("imagesID", imagesID);

    const response = await axios.post(`${API_URL_AUTH}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.success;
  } catch (error) {
    console.error("Error during registration:", error);
    return false;
  }
};

export const sendOTP = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/send-otp`, { email });
    return response.data.success;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

export const verifyOTP = async (otp: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/verify-otp`, { otp });
    return response.data.success;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};

export const resetPassword = async (newPassword: string, confirmPassword: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/reset-password`, { newPassword, confirmPassword });
    return response.data.success;
  } catch (error) {
    console.error("Error resetting password:", error);
    return false;
  }
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await axios.post(`${API_URL_PROFILE}/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    console.error("Error during forgot password:", error);
    return {
      status: "error",
      data: null,
      message: error.response?.data?.message || "An error occurred while processing your request"
    };
  }
};

// Fetch posts with search params
export const fetchPosts = async (searchParams?: PostSearchParams): Promise<{posts: Post[], pagination?: {total: number, perPage: number, currentPage: number}}> => {
  try {
    let url = `${API_URL_POSTS}`; // Base URL

    // Start with query parameters
    const queryParams: string[] = [];
    
    // Add search parameters if provided
    if (searchParams) {
      if (searchParams.id) queryParams.push(`id=${searchParams.id}`);
      if (searchParams.name) queryParams.push(`name=${searchParams.name}`);
      if (searchParams.userId) queryParams.push(`userId=${searchParams.userId}`);
      if (searchParams.province) queryParams.push(`province=${searchParams.province}`);
      if (searchParams.district) queryParams.push(`district=${searchParams.district}`);
      if (searchParams.ward) queryParams.push(`ward=${searchParams.ward}`);
      if (searchParams.address) queryParams.push(`address=${searchParams.address}`);
      if (searchParams.fromPrice) queryParams.push(`fromPrice=${searchParams.fromPrice}`);
      if (searchParams.toPrice) queryParams.push(`toPrice=${searchParams.toPrice}`);
      if (searchParams.defaultSearch) {
        queryParams.push(`defaultSearch.perPage=${searchParams.defaultSearch.perPage}`);
        queryParams.push(`defaultSearch.currentPage=${searchParams.defaultSearch.currentPage}`);
      }
    }
    
    // Add query parameters to URL if any exist
    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    const response = await axios.get<PostListResponse>(url);
    
    if (response.data.status === "Success" && response.data.data?.rooms) {
      return {
        posts: response.data.data.rooms,
        pagination: response.data.data.pagination || {
          total: response.data.data.rooms.length,
          perPage: 10,
          currentPage: 0
        }
      };
    }
    
    console.log('Response data:', response.data);
    return { posts: [] };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [] };
  }
};

// Fetch a single post by ID
export interface PostDetailResponse {
  data: Post;
  status: string;
  message: string;
}

export const getPostById = async (id: string): Promise<PostDetailResponse | null> => {
  try {
    console.log(`Fetching post with ID: ${id}`);
    const response = await axios.get<any>(`${API_URL_POSTS}/${id}`);
    
    if (response.data.status === "Success") {
      return {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data
      };
    }
    
    console.error("Error response:", response.data);
    return null;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
};







