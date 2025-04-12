import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Profile, 
  ProfileResponse, 
  UpdateProfileRequest, 
  ChangePasswordRequest,
  ProfileUpdateResponse,
  PackageHistoryResponse
} from '@/app/types/profile';
import {
  getProfile,
  updateProfile,
  updateProfileWithAvatar,
  changePassword,
  getPackageHistory
} from '@/app/services/RequestManager';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'details'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
  packageHistory: () => [...profileKeys.all, 'packageHistory'] as const,
};

// Get current user profile
export const useProfile = () => {
  const isClient = typeof window !== 'undefined';
  const hasToken = isClient ? !!localStorage.getItem('accessToken') : false;
  
  return useQuery<ProfileResponse, Error>({
    queryKey: profileKeys.details(),
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled: hasToken,
  });
};

// Get package history for host
export const usePackageHistory = () => {
  const isClient = typeof window !== 'undefined';
  const hasToken = isClient ? !!localStorage.getItem('accessToken') : false;
  
  return useQuery<PackageHistoryResponse, Error>({
    queryKey: profileKeys.packageHistory(),
    queryFn: getPackageHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled: hasToken,
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

