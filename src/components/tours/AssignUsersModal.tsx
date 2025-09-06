'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useUsers } from '@/hooks/api/useUsers';
import { useAssignParticipants, useTourParticipants } from '@/hooks/api/useTours';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { User } from '@/types/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface AssignUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: string;
  tourTitle: string;
}

export function AssignUsersModal({ isOpen, onClose, tourId, tourTitle }: AssignUsersModalProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasPreSelected, setHasPreSelected] = useState(false);

  // Fetch users and participants
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: participants = [], isLoading: isLoadingParticipants } = useTourParticipants(tourId);
  const assignParticipantsMutation = useAssignParticipants();

  // Get already assigned user IDs using useMemo to prevent infinite re-renders
  const assignedUserIds = useMemo(() => {
    return participants.map(p => p.userId);
  }, [participants]);

  // Helper functions for role display (same as UsersTable)
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'tour_operator':
        return 'warning';
      case 'tour_guide':
        return 'info';
      case 'customer':
      default:
        return 'success';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'tour_operator':
        return 'Nhà điều hành';
      case 'tour_guide':
        return 'Hướng dẫn viên';
      case 'customer':
      default:
        return 'Khách hàng';
    }
  };

  // Filter users: exclude admins and apply search term
  const filteredUsers = users
    .filter((user: User) => user.role !== 'admin') // Loại bỏ admin
    .filter((user: User) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Reset state when modal closes, and pre-select assigned users when data loads
  useEffect(() => {
    if (!isOpen) {
      setSelectedUserIds([]);
      setSearchTerm('');
      setHasPreSelected(false);
    }
  }, [isOpen]);

  // Pre-select assigned users when participants data is loaded
  useEffect(() => {
    if (isOpen && !hasPreSelected && assignedUserIds.length > 0) {
      setSelectedUserIds(assignedUserIds);
      setHasPreSelected(true);
    }
  }, [isOpen, hasPreSelected, assignedUserIds]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUserIds(filteredUsers.map((user: User) => user.id));
  };

  const handleDeselectAll = () => {
    setSelectedUserIds([]);
  };

  const handleAssign = async () => {
    if (selectedUserIds.length === 0) return;

    // Only assign new users (not already assigned)
    const newUserIds = selectedUserIds.filter(userId => !assignedUserIds.includes(userId));
    
    if (newUserIds.length === 0) {
      // All selected users are already assigned
      onClose();
      return;
    }

    try {
      await assignParticipantsMutation.mutateAsync({
        tourId,
        data: { userIds: newUserIds }
      });
      onClose();
    } catch (error) {
      console.error('Error assigning users:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gán người dùng vào tour">
      <div className="space-y-4">
        {/* Tour info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="font-medium text-blue-900">Tour: {tourTitle}</h3>
          <p className="text-sm text-blue-700">Chọn người dùng để gán vào tour này (không bao gồm quản trị viên)</p>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Selection controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Đã chọn: {selectedUserIds.length} người dùng
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredUsers.length === 0}
            >
              Chọn tất cả
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              disabled={selectedUserIds.length === 0}
            >
              Bỏ chọn
            </Button>
          </div>
        </div>

        {/* Users list */}
        <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
          {isLoadingUsers || isLoadingParticipants ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Không tìm thấy người dùng nào phù hợp' : 'Chưa có người dùng nào (ngoại trừ quản trị viên)'}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredUsers.map((user: User) => {
                const isAlreadyAssigned = assignedUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                      selectedUserIds.includes(user.id)
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    } ${isAlreadyAssigned ? 'bg-green-50' : ''}`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.fullName}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.fullName}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs">
                      <Badge 
                        variant={getRoleBadgeVariant(user.role)}
                        size="sm"
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedUserIds.length === 0 || assignParticipantsMutation.isPending}
            loading={assignParticipantsMutation.isPending}
          >
            {(() => {
              const newUserIds = selectedUserIds.filter(userId => !assignedUserIds.includes(userId));
              const newCount = newUserIds.length;
              if (newCount === 0) return 'Không có mới';
              return `Gán ${newCount} mới`;
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
