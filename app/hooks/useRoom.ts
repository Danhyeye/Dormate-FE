import { Room, RoomResponse, CreateRoomRequest, UpdateRoomRequest } from "../types/room"
import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from "@tanstack/react-query"
import { 
  fetchRooms as fetchRoomsAPI, 
  getRoomById as getRoomByIdAPI, 
  createRoom as createRoomAPI, 
  updateRoom as updateRoomAPI, 
  deleteRoom as deleteRoomAPI 
} from '@/app/services/RequestManager'

// Query keys
export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: () => [...roomKeys.lists()] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: string) => [...roomKeys.details(), id] as const,
};

// React Query hooks
export const useRooms = (perPage: number = 10, currentPage: number = 0) => {
  return useQuery({
    queryKey: [...roomKeys.list(), perPage, currentPage],
    queryFn: () => fetchRoomsAPI(perPage, currentPage),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRoomDetail = (id: string) => {
  return useQuery({
    queryKey: roomKeys.detail(id),
    queryFn: () => getRoomByIdAPI(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run the query if we have an ID
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoomAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.list() });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRoomAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.list() });
      queryClient.setQueryData(roomKeys.detail(data.id), data);
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoomAPI,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.list() });
      queryClient.removeQueries({ queryKey: roomKeys.detail(id) });
    },
  });
};

// Helper function to determine if a room is loading
export const useRoomLoading = (id: string) => {
  const queryClient = useQueryClient();
  const queryKey = roomKeys.detail(id);
  
  const state = queryClient.getQueryState(queryKey);
  return state?.status === 'pending';
};

// Prefetch a room by ID
export const usePrefetchRoom = () => {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    if (id) {
      queryClient.prefetchQuery({
        queryKey: roomKeys.detail(id),
        queryFn: () => getRoomByIdAPI(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }
  };
};