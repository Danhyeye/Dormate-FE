import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Profile, 
  ProfileResponse, 
  UpdateProfileRequest, 
  ChangePasswordRequest,
  ProfileUpdateResponse 
} from '@/app/types/profile';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_PROFILE_URL = `${API_BASE_URL}/profile`;

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'details'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
};

// Get current user profile
export const useProfile = () => {
  return useQuery<ProfileResponse, Error>({
    queryKey: profileKeys.details(),
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get<ProfileResponse>(API_PROFILE_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled: !!localStorage.getItem('accessToken')
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ProfileUpdateResponse, Error, UpdateProfileRequest>({
    mutationFn: async (profileData) => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.put<ProfileUpdateResponse>(API_PROFILE_URL, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: profileKeys.details() });
    }
  });
};

