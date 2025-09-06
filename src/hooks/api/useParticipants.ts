import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { participantService, GetParticipantsParams, CreateParticipantData, UpdateParticipantData } from '@/services/api';
import { useNotifications } from '@/store';
import { Document } from '@/types';

export function useParticipants(params: GetParticipantsParams) {
  return useQuery({
    queryKey: ['participants', params],
    queryFn: () => participantService.getParticipants(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useParticipant(id: string) {
  return useQuery({
    queryKey: ['participants', id],
    queryFn: () => participantService.getParticipant(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: (data: CreateParticipantData) => participantService.createParticipant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      showSuccess('Thành viên đã được tạo thành công');
    },
    onError: () => {
      showError('Không thể tạo thành viên', 'Vui lòng thử lại sau');
    },
  });
}

export function useUpdateParticipant() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParticipantData }) =>
      participantService.updateParticipant(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      queryClient.invalidateQueries({ queryKey: ['participants', id] });
      showSuccess('Thông tin thành viên đã được cập nhật');
    },
    onError: () => {
      showError('Không thể cập nhật thông tin', 'Vui lòng thử lại sau');
    },
  });
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: (id: string) => participantService.deleteParticipant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      showSuccess('Thành viên đã được xóa thành công');
    },
    onError: () => {
      showError('Không thể xóa thành viên', 'Vui lòng thử lại sau');
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ 
      participantId, 
      file, 
      documentType 
    }: { 
      participantId: string; 
      file: File; 
      documentType: Document['type'] 
    }) =>
      participantService.uploadDocument(participantId, file, documentType),
    onSuccess: (_, { participantId }) => {
      queryClient.invalidateQueries({ queryKey: ['participants', participantId] });
      showSuccess('Tài liệu đã được tải lên thành công');
    },
    onError: () => {
      showError('Không thể tải lên tài liệu', 'Vui lòng thử lại sau');
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ participantId, documentId }: { participantId: string; documentId: string }) =>
      participantService.deleteDocument(participantId, documentId),
    onSuccess: (_, { participantId }) => {
      queryClient.invalidateQueries({ queryKey: ['participants', participantId] });
      showSuccess('Tài liệu đã được xóa thành công');
    },
    onError: () => {
      showError('Không thể xóa tài liệu', 'Vui lòng thử lại sau');
    },
  });
}

export function useParticipantHistory(id: string) {
  return useQuery({
    queryKey: ['participants', id, 'history'],
    queryFn: () => participantService.getParticipantHistory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useImportParticipants() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: (file: File) => participantService.importParticipants(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      showSuccess(`Đã nhập ${result.data.successCount} thành viên thành công`);
    },
    onError: () => {
      showError('Không thể nhập dữ liệu', 'Vui lòng kiểm tra file và thử lại');
    },
  });
}

export function useBulkUpdateParticipantStatus() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ participantIds, status }: { participantIds: string[]; status: string }) =>
      participantService.bulkUpdateStatus(participantIds, status as any),
    onSuccess: (_, { participantIds }) => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      showSuccess(`Đã cập nhật trạng thái cho ${participantIds.length} thành viên`);
    },
    onError: () => {
      showError('Không thể cập nhật trạng thái', 'Vui lòng thử lại sau');
    },
  });
}
