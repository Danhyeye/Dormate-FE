import axios from "axios";
import { format, toZonedTime } from "date-fns-tz";
import { vi } from "date-fns/locale";
import { SignInRequest, SignInResponse, ForgotPasswordResponse } from "../types/auth";
import { Post, PostApiResponse, PostListResponse, PostSearchParams, CreatePostRequest, UpdatePostRequest } from "../types/post";
import { Room, RoomResponse, CreateRoomRequest, UpdateRoomRequest } from "../types/room";
import { Profile, ProfileResponse, UpdateProfileRequest, ProfileUpdateResponse } from "../types/profile";

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
    
    if (response.data && response.data.data?.accessToken) {
      const accessToken = response.data.data.accessToken;
      
      const role = extractRoleFromToken(accessToken);
      
      localStorage.setItem("accessToken", accessToken);
      
      if (response.data.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
      }

      const userId = response.data.data.user?.id || extractUserIdFromToken(accessToken);
      if (userId) {
        localStorage.setItem("userId", userId);
      }
      
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

    console.log("Login failed: No proper data in response");
    return { 
      success: false, 
      message: response.data.message || "Sai tên đăng nhập hoặc mật khẩu" 
    };
  } catch (error: any) {
    console.error("Error during login:", error);
    if (error.response && error.response.data) {
      return { 
        success: false, 
        message: error.response.data.message || "Sai tên đăng nhập hoặc mật khẩu" 
      };
    }
    return { 
      success: false, 
      message: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau." 
    };
  }
};

function extractUserIdFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const claims = JSON.parse(decodedPayload);
    return claims.userId || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"] || null;
  } catch (error) {
    console.error("Error extracting userId from token:", error);
    return null;
  }
}

function extractNameFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const claims = JSON.parse(decodedPayload);
    return claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null;
  } catch (error) {
    console.error("Error extracting name from token:", error);
    return null;
  }
}

function extractRoleFromToken(token: string): string | undefined {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const claims = JSON.parse(decodedPayload);
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

export const fetchPosts = async (searchParams?: PostSearchParams): Promise<{posts: Post[], pagination?: {total: number, perPage: number, currentPage: number}}> => {
  try {
    let url = `${API_URL_POSTS}`;

    const queryParams: string[] = [];
    
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

export const fetchRooms = async (perPage: number = 10, currentPage: number = 0): Promise<{rooms: Room[], pagination?: {total: number, perPage: number, currentPage: number}}> => {
  try {
    const url = `${API_URL_ROOMS}?defaultSearch.perPage=${perPage}&defaultSearch.currentPage=${currentPage}`;
    console.log(`Fetching rooms with pagination: ${url}`);
    
    const response = await axios.get<RoomResponse>(url);
    if (response.data.status === "Success" && response.data.data?.rooms) {
      return {
        rooms: response.data.data.rooms,
        pagination: response.data.data.pagination || {
          total: response.data.data.rooms.length,
          perPage,
          currentPage
        }
      };
    }
    return { rooms: [] };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return { rooms: [] };
  }
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  try {
    const response = await axios.get<RoomResponse>(`${API_URL_ROOMS}/${id}`);
    if (response.data.status === "Success" && response.data.data?.room) {
      return response.data.data.room;
    }
    return null;
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    return null;
  }
};

export const createRoom = async (roomData: CreateRoomRequest): Promise<Room> => {
  const formData = new FormData();
  
  console.log("Creating room with data:", roomData);
  
  // Map properties to the expected capitalized format
  const fieldMapping: Record<string, string> = {
    name: "Name",
    description: "Description",
    price: "Price",
    area: "Area",
    province: "Province",
    district: "District",
    ward: "Ward",
    address: "Address",
    status: "Status",
    packageId: "PackageId",
    availableFrom: "ValidateFrom",
    availableTo: "ValidateTo",
    isHide: "IsHide"
  };
  
  // Handle special fields
  Object.entries(roomData).forEach(([key, value]) => {
    if (key !== "mainPicture" && key !== "subImage" && value !== undefined) {
      const apiFieldName = fieldMapping[key] || key;
      
      // Format dates properly for the API
      if (value instanceof Date) {
        formData.append(apiFieldName, value.toISOString());
        console.log(`Added form date field: ${apiFieldName} = ${value.toISOString()}`);
      } else {
        formData.append(apiFieldName, value.toString());
        console.log(`Added form field: ${apiFieldName} = ${value}`);
      }
    }
  });

  if (roomData.mainPicture) {
    formData.append("MainPicture", roomData.mainPicture);
    console.log("Added MainPicture:", roomData.mainPicture.name);
  }

  if (roomData.subImage && roomData.subImage.length > 0) {
    roomData.subImage.forEach((file: File) => {
      formData.append("SubPicture", file);
      console.log(`Added SubPicture:`, file.name);
    });
  }

  const token = localStorage.getItem("accessToken");
  console.log("Using token:", token ? "Bearer token found" : "No token available");
  
  try {
    // Log the URL we're calling
    console.log(`Calling API at: ${API_URL_ROOMS}`);
    
    const response = await axios.post<RoomResponse>(`${API_URL_ROOMS}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });

    console.log("API Response:", response.data);

    // If the response status is Success, consider it successful even if data.room is null
    if (response.data.status === "Success") {
      if (response.data.data?.room) {
        return response.data.data.room;
      } else {
        // For cases where the room is created but not returned in the response
        console.log("Room created successfully, but room data not returned in response");
        // Return a partial room object with the data we have
        return {
          id: "",  // We don't have the ID yet
          name: roomData.name,
          description: roomData.description,
          price: roomData.price,
          area: roomData.area,
          province: roomData.province,
          district: roomData.district,
          ward: roomData.ward,
          address: roomData.address,
          status: roomData.status,
          mainPicture: "",  // We don't have the URL yet
          subImage: [],
          ownerId: "",  // We don't have this yet
          createdAt: new Date(),
          updatedAt: new Date(),
          availableFrom: roomData.availableFrom,
          availableTo: roomData.availableTo
        };
      }
    }
    
    console.error("API returned unsuccessful response:", response.data);
    throw new Error("Failed to create room: " + (response.data.message || "Unknown error"));
  } catch (error: any) {
    console.error("Error creating room:", error.response?.data || error.message);
    throw error; // Keep the original error for better debugging
  }
};

export const updateRoom = async (roomData: UpdateRoomRequest): Promise<Room> => {
  const formData = new FormData();
  
  Object.entries(roomData).forEach(([key, value]) => {
    if (key !== "mainPicture" && key !== "subImage" && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  if (roomData.mainPicture) {
    formData.append("mainPicture", roomData.mainPicture);
  }

  if (roomData.subImage) {
    roomData.subImage.forEach((file: File, index: number) => {
      formData.append(`subImage[${index}]`, file);
    });
  }

  const response = await axios.put<RoomResponse>(`${API_URL_ROOMS}/${roomData.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data.status === "Success" && response.data.data?.room) {
    return response.data.data.room;
  }
  throw new Error("Failed to update room");
};

export const deleteRoom = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL_ROOMS}/${id}`);
  if (response.data.status !== "Success") {
    throw new Error("Failed to delete room");
  }
};

export const createPost = async (postData: CreatePostRequest): Promise<Post> => {
  const formData = new FormData();
  
  Object.entries(postData).forEach(([key, value]) => {
    if (key !== "mainPicture" && key !== "subImage" && value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  if (postData.mainPicture) {
    formData.append("mainPicture", postData.mainPicture);
  }

  if (postData.subImage) {
    postData.subImage.forEach((file: File, index: number) => {
      formData.append(`subImage[${index}]`, file);
    });
  }

  const response = await axios.post<PostApiResponse>(`${API_URL_POSTS}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data.status === "Success") {
    return response.data as unknown as Post;
  }
  throw new Error("Failed to create post");
};

export const updatePost = async (postData: UpdatePostRequest): Promise<Post> => {
  const formData = new FormData();
  
  Object.entries(postData).forEach(([key, value]) => {
    if (key !== "mainPicture" && key !== "subImage" && value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  if (postData.mainPicture) {
    formData.append("mainPicture", postData.mainPicture);
  }

  if (postData.subImage) {
    postData.subImage.forEach((file: File, index: number) => {
      formData.append(`subImage[${index}]`, file);
    });
  }

  const response = await axios.put<PostApiResponse>(`${API_URL_POSTS}/${postData.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data.status === "Success") {
    return response.data as unknown as Post;
  }
  throw new Error("Failed to update post");
};

export const deletePost = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL_POSTS}/${id}`);
  if (response.data.status !== "Success") {
    throw new Error("Failed to delete post");
  }
};

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.get<ProfileResponse>(API_URL_PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return {
      status: "error",
      data: null,
      message: error.response?.data?.message || "Failed to fetch profile"
    };
  }
};

export const updateProfile = async (profileData: UpdateProfileRequest): Promise<ProfileUpdateResponse> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.put<ProfileUpdateResponse>(API_URL_PROFILE, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      status: "error",
      data: null,
      message: error.response?.data?.message || "Failed to update profile"
    };
  }
};

export const updateProfileWithAvatar = async (profileData: FormData): Promise<ProfileUpdateResponse> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.put<ProfileUpdateResponse>(`${API_URL_PROFILE}/avatar`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error updating profile with avatar:", error);
    return {
      status: "error",
      data: null,
      message: error.response?.data?.message || "Failed to update profile avatar"
    };
  }
};

export const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<{status: string, message: string}> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axios.post(`${API_URL_PROFILE}/change-password`, {
      currentPassword,
      newPassword,
      confirmPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    return {
      status: "success",
      message: response.data.message || "Password changed successfully"
    };
  } catch (error: any) {
    console.error("Error changing password:", error);
    return {
      status: "error",
      message: error.response?.data?.message || "Failed to change password"
    };
  }
};







