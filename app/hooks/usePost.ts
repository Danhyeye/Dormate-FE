import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPostById, 
  fetchPosts,
  createPost,
  updatePost,
  deletePost
} from '@/app/services/RequestManager';
import { PostSearchParams } from '@/app/types/post';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: () => [...postKeys.lists()] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

// Get all posts with optional filters
export const usePosts = (perPage: number = 10, currentPage: number = 0) => {
  const searchParams: PostSearchParams = {
    defaultSearch: {
      perPage,
      currentPage
    }
  };
  
  return useQuery({
    queryKey: [...postKeys.list(), perPage, currentPage],
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

// Create a new post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
    },
  });
};

// Update an existing post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
      queryClient.setQueryData(postKeys.detail(data.id), data);
    },
  });
};

// Delete a post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
    },
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