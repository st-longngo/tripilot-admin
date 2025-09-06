import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tourService, GetToursParams, AssignParticipantsData } from '@/services/api/tours';
import { TourQuickCreateFormData } from '@/types/forms';
import { toast } from '@/store/toastStore';

export function useTours(params: GetToursParams = {}) {
  return useQuery({
    queryKey: ['tours', params],
    queryFn: () => tourService.getTours(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useTour(id: string) {
  return useQuery({
    queryKey: ['tours', id],
    queryFn: () => tourService.getTour(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: TourQuickCreateFormData) => tourService.createTour(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Thành công', 'Tour đã được tạo thành công');
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error?.message || 'Có lỗi xảy ra khi tạo tour');
    },
  });
}

export function useUpdateTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TourQuickCreateFormData }) => 
      tourService.updateTour(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tours', id] });
      toast.success('Thành công', 'Tour đã được cập nhật thành công');
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error?.message || 'Có lỗi xảy ra khi cập nhật tour');
    },
  });
}

export function useDeleteTour() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => tourService.deleteTour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Thành công', 'Tour đã được xóa thành công');
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error?.message || 'Có lỗi xảy ra khi xóa tour');
    },
  });
}

export function useAssignParticipants() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ tourId, data }: { tourId: string; data: AssignParticipantsData }) => 
      tourService.assignParticipants(tourId, data),
    onSuccess: (_, { tourId }) => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tours', tourId] });
      queryClient.invalidateQueries({ queryKey: ['tour-participants', tourId] });
      toast.success('Thành công', 'Đã gán người dùng vào tour thành công');
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error?.message || 'Có lỗi xảy ra khi gán người dùng');
    },
  });
}

export function useTourParticipants(tourId: string) {
  return useQuery({
    queryKey: ['tour-participants', tourId],
    queryFn: () => tourService.getTourParticipants(tourId),
    enabled: !!tourId,
    staleTime: 5 * 60 * 1000,
  });
}
