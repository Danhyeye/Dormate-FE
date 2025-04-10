import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Profile, 
  ProfileResponse, 
  UpdateProfileRequest, 
  ChangePasswordRequest,
  ProfileUpdateResponse 
} from '@/app/types/profile';
import {
  getProfile,
  updateProfile,
  updateProfileWithAvatar,
  changePassword
} from '@/app/services/RequestManager';

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
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ProfileUpdateResponse, Error, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.details() });
    }
  });
};

// Update user profile with avatar
export const useUpdateProfileWithAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ProfileUpdateResponse, Error, FormData>({
    mutationFn: updateProfileWithAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.details() });
    }
  });
};

// Change password
export const useChangePassword = () => {
  return useMutation<{status: string, message: string}, Error, ChangePasswordRequest>({
    mutationFn: (data) => changePassword(data.currentPassword, data.newPassword, data.confirmPassword)
  });
};

