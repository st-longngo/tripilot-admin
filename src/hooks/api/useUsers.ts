import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, GetUsersParams } from '@/services/api/users';
import { UserFormData } from '@/types/forms';
import { toast } from '@/store/toastStore';

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserFormData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Thành công', 'Người dùng đã được tạo thành công');
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error?.message || 'Có lỗi xảy ra khi tạo người dùng');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserFormData }) => 
      userService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
      toast.success('Thành công', 'Người dùng đã được cập nhật thành công');
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error?.message || 'Có lỗi xảy ra khi cập nhật người dùng');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Thành công', 'Người dùng đã được xóa thành công');
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error?.message || 'Có lỗi xảy ra khi xóa người dùng');
    },
  });
}
