'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import LocationsTable from '@/components/locations/LocationsTable';
import LocationDetailModal from '@/components/locations/LocationDetailModal';
import DeleteLocationModal from '@/components/locations/DeleteLocationModal';
import { Location } from '@/types/api';
import { useLocations, useDeleteLocation } from '@/hooks/api/useLocations';
import { toast } from '@/store/toastStore';

export default function LocationsPage() {
  const router = useRouter();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch locations data from API
  const { data: locations = [], isLoading, error: apiError } = useLocations({ 
    page: currentPage, 
    pageSize,
    search: searchQuery.trim() || undefined
  });

  const deleteLocationMutation = useDeleteLocation();

  // If API error, treat as empty data for display purposes
  const effectiveLocations = apiError ? [] : locations;
  
  // Apply client-side search filtering as backup
  const filteredLocations = searchQuery.trim() 
    ? effectiveLocations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (location.address && location.address.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : effectiveLocations;
  
  // Calculate pagination data
  const totalLocations = filteredLocations.length;
  const totalPages = Math.ceil(totalLocations / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleSelectAllLocations = (selected: boolean) => {
    setSelectedLocations(selected ? paginatedLocations.map(location => location.id) : []);
  };

  const handleViewLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLocation(null);
  };

  const handleEditLocation = (location: Location) => {
    router.push(`/locations/${location.id}/edit`);
  };

  const handleDeleteLocation = (location: Location) => {
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (location: Location) => {
    try {
      await deleteLocationMutation.mutateAsync(location.id);
      toast.success('Xóa địa điểm thành công', `Địa điểm "${location.name}" đã được xóa khỏi hệ thống.`);
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Lỗi xóa địa điểm', 'Có lỗi xảy ra khi xóa địa điểm. Vui lòng thử lại.');
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleteLocationMutation.isPending) {
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedLocations([]); // Clear selections when changing page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedLocations([]); // Clear selections when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedLocations([]);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Địa điểm</h1>
              <p className="text-gray-600">Quản lý và theo dõi các địa điểm du lịch</p>
            </div>
            <Button 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push('/locations/add')}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Thêm Địa điểm Mới</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex-1 max-w-md relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm địa điểm theo tên hoặc địa chỉ..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  )}
                </div>
                {selectedLocations.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedLocations.length} địa điểm được chọn
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLocations([])}
                      className="cursor-pointer"
                    >
                      Bỏ chọn
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Search Results Indicator */}
            {searchQuery && (
              <div className="px-6 py-2 bg-blue-50 border-b border-gray-200">
                <div className="text-sm text-blue-700">
                  {totalLocations > 0 ? (
                    <>
                      Tìm thấy <span className="font-medium">{totalLocations}</span> địa điểm cho từ khóa &ldquo;{searchQuery}&rdquo;
                    </>
                  ) : (
                    <>
                      Không tìm thấy địa điểm nào cho từ khóa &ldquo;{searchQuery}&rdquo;
                    </>
                  )}
                </div>
              </div>
            )}

            <LocationsTable
              locations={paginatedLocations}
              loading={isLoading}
              selectedLocations={selectedLocations}
              onSelectLocation={handleSelectLocation}
              onSelectAllLocations={handleSelectAllLocations}
              onViewLocation={handleViewLocation}
              onEditLocation={handleEditLocation}
              onDeleteLocation={handleDeleteLocation}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị {startIndex + 1}-{Math.min(endIndex, totalLocations)} trong tổng số {totalLocations} 
                    {searchQuery ? ' kết quả tìm kiếm' : ' địa điểm'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="cursor-pointer"
                    >
                      Trước
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer"
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location Detail Modal */}
          <LocationDetailModal
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            location={selectedLocation}
          />

          {/* Delete Confirmation Modal */}
          <DeleteLocationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            location={locationToDelete}
            onConfirm={handleConfirmDelete}
            isDeleting={deleteLocationMutation.isPending}
          />
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
