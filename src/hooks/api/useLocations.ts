import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService } from '@/services/api';
import { GetLocationsParams } from '@/services/api/locations';
import { CreateLocationFormData } from '@/types/forms';

export function useLocations(params: GetLocationsParams = {}) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => locationService.getLocations(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ['locations', id],
    queryFn: () => locationService.getLocation(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateLocationFormData) => locationService.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateLocationFormData }) => 
      locationService.updateLocation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations', id] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => locationService.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}
