'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { UsersToolbar } from '@/components/users/UsersToolbar';
import { UsersTable } from '@/components/users/UsersTable';
import { DeleteUserModal } from '@/components/users/DeleteUserModal';
import { User } from '@/types/api';
import { useUsers, useDeleteUser } from '@/hooks/api/useUsers';
import { useDebounce } from '@/hooks/useDebounce';

export default function UsersPage() {
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch users data from API
  const { data: users = [], isLoading, error: apiError } = useUsers({ 
    page: currentPage, 
    pageSize 
  });

  const deleteUserMutation = useDeleteUser();

  // If API error, treat as empty data for display purposes
  const effectiveUsers = apiError ? [] : users;
  
  // Filter users based on search query
  const filteredUsers = effectiveUsers.filter(user => {
    if (!debouncedSearchQuery.trim()) return true;
    
    const query = debouncedSearchQuery.toLowerCase().trim();
    
    // Search in fullName and email
    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = (selected: boolean) => {
    setSelectedUsers(selected ? paginatedUsers.map(user => user.id) : []);
  };

  const handleViewUser = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    router.push(`/users/${user.id}/edit`);
  };

  const handleDeleteUser = (user: User) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.user) return;
    
    try {
      await deleteUserMutation.mutateAsync(deleteModal.user.id);
      handleCloseDeleteModal();
    } catch {
      // Error handling is done in the mutation
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedUsers([]); // Clear selections when changing page
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedUsers([]); // Clear selections when searching
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
              <p className="text-gray-600">
                Quản lý và theo dõi người dùng hệ thống
                {debouncedSearchQuery && (
                  <span className="ml-2 text-sm text-blue-600">
                    - Tìm thấy {totalUsers} kết quả cho &ldquo;{debouncedSearchQuery}&rdquo;
                  </span>
                )}
              </p>
            </div>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => router.push('/users/add')}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Thêm người dùng</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <UsersToolbar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              selectedCount={selectedUsers.length}
              onBulkActions={(action: string) => console.log('Bulk action:', action)}
              onClearSelection={() => setSelectedUsers([])}
            />

            <UsersTable
              users={paginatedUsers}
              loading={isLoading}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onSelectAllUsers={handleSelectAllUsers}
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              searchQuery={debouncedSearchQuery}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị {startIndex + 1}-{Math.min(endIndex, totalUsers)} trong tổng số {totalUsers} người dùng
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DeleteUserModal
            isOpen={deleteModal.isOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            userName={deleteModal.user?.fullName || ''}
            loading={deleteUserMutation.isPending}
          />
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
