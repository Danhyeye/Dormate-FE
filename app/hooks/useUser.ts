import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../services/RequestManager';
import { UserSearchParams } from '../types/user';

export const useUsers = (searchParams?: UserSearchParams) => {
  return useQuery({
    queryKey: ['users', searchParams],
    queryFn: () => fetchUsers(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 