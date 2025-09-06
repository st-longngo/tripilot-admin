'use client';

import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface UsersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onBulkActions: (action: string) => void;
  onClearSelection: () => void;
}

export function UsersToolbar({
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkActions,
  onClearSelection,
}: UsersToolbarProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Bulk actions */}
        {selectedCount > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Đã chọn {selectedCount} người dùng
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
            >
              Bỏ chọn
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkActions('export')}
            >
              Xuất file
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
