import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getPostById, 
  fetchPosts
} from '@/app/services/RequestManager';
import { PostSearchParams } from '@/app/types/post';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: PostSearchParams) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

// Get all posts with optional filters
export const usePosts = (searchParams?: PostSearchParams) => {
  return useQuery({
    queryKey: postKeys.list(searchParams || {}),
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get a single post by ID
export const usePostDetail = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run the query if we have an ID
  });
};

// Helper function to determine if a post is loading
export const usePostLoading = (id: string) => {
  const queryClient = useQueryClient();
  const queryKey = postKeys.detail(id);
  
  // Check if the query is in a loading state
  const state = queryClient.getQueryState(queryKey);
  return state?.status === 'pending';
};

// Prefetch a post by ID
export const usePrefetchPost = () => {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    if (id) {
      queryClient.prefetchQuery({
        queryKey: postKeys.detail(id),
        queryFn: () => getPostById(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }
  };
}; 