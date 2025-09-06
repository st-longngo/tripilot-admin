'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { ToursToolbar } from '@/components/tours/ToursToolbar';
import { ToursTable } from '@/components/tours/ToursTable';
import { DeleteTourModal } from '@/components/tours/DeleteTourModal';
import { Tour } from '@/types/api';
import { useTours, useDeleteTour } from '@/hooks/api/useTours';
import { useDebounce } from '@/hooks/useDebounce';

export default function ToursPage() {
  const router = useRouter();
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; tour: Tour | null }>({
    isOpen: false,
    tour: null,
  });

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch tours data from API
  const { data: tours = [], isLoading, error: apiError } = useTours({ 
    page: currentPage, 
    pageSize 
  });

  const deleteTourMutation = useDeleteTour();

  // If API error, treat as empty data for display purposes
  const effectiveTours = apiError ? [] : tours;
  
  // Filter tours based on search query
  const filteredTours = effectiveTours.filter(tour => {
    if (!debouncedSearchQuery.trim()) return true;
    
    const query = debouncedSearchQuery.toLowerCase().trim();
    
    // Search in title, description, and status
    return (
      tour.title.toLowerCase().includes(query) ||
      tour.description?.toLowerCase().includes(query) ||
      tour.status.toLowerCase().includes(query) ||
      tour.organizerId?.toLowerCase().includes(query)
    );
  });
  
  // Calculate pagination data based on filtered results
  const totalTours = filteredTours.length;
  const totalPages = Math.ceil(totalTours / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTours = filteredTours.slice(startIndex, endIndex);

  const handleSelectTour = (tourId: string) => {
    setSelectedTours(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleSelectAllTours = (selected: boolean) => {
    setSelectedTours(selected ? paginatedTours.map(tour => tour.id) : []);
  };

  const handleViewTour = (tour: Tour) => {
    router.push(`/tours/${tour.id}`);
  };

  const handleEditTour = (tour: Tour) => {
    router.push(`/tours/${tour.id}/edit`);
  };

  const handleDeleteTour = (tour: Tour) => {
    setDeleteModal({ isOpen: true, tour });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.tour) return;
    
    try {
      await deleteTourMutation.mutateAsync(deleteModal.tour.id);
      setDeleteModal({ isOpen: false, tour: null });
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, tour: null });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedTours([]); // Clear selections when changing page
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedTours([]); // Clear selections when searching
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Tours</h1>
              <p className="text-gray-600">
                Quản lý và theo dõi các tour du lịch
                {debouncedSearchQuery && (
                  <span className="ml-2 text-sm text-blue-600">
                    - Tìm thấy {totalTours} kết quả cho &ldquo;{debouncedSearchQuery}&rdquo;
                  </span>
                )}
              </p>
            </div>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => router.push('/tours/add')}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Tạo Tour Mới</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <ToursToolbar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              selectedCount={selectedTours.length}
              onBulkActions={(action: string) => console.log('Bulk action:', action)}
              onClearSelection={() => setSelectedTours([])}
            />

            <ToursTable
              tours={paginatedTours}
              loading={isLoading}
              selectedTours={selectedTours}
              onSelectTour={handleSelectTour}
              onSelectAllTours={handleSelectAllTours}
              onViewTour={handleViewTour}
              onEditTour={handleEditTour}
              onDeleteTour={handleDeleteTour}
              searchQuery={debouncedSearchQuery}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị {startIndex + 1}-{Math.min(endIndex, totalTours)} trong tổng số {totalTours} tours
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

          <DeleteTourModal
            isOpen={deleteModal.isOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            tourTitle={deleteModal.tour?.title || ''}
            loading={deleteTourMutation.isPending}
          />
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
