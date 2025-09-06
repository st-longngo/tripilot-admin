import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon, CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/Badge';
import { Tour } from '@/types/api';

interface ToursListProps {
  tours: Tour[];
  loading?: boolean;
  selectedTours: string[];
  onSelectTour: (tourId: string) => void;
  onViewTour: (tour: Tour) => void;
  onEditTour: (tour: Tour) => void;
  onDeleteTour: (tour: Tour) => void;
}

const ToursList: React.FC<ToursListProps> = ({
  tours,
  loading = false,
  selectedTours,
  onSelectTour,
  onViewTour,
  onEditTour,
  onDeleteTour,
}) => {
  const getStatusBadge = (status: Tour['status']) => {
    const variants = {
      draft: { variant: 'warning' as const, label: 'Bản nháp' },
      published: { variant: 'info' as const, label: 'Đã xuất bản' },
      active: { variant: 'success' as const, label: 'Đang hoạt động' },
      completed: { variant: 'primary' as const, label: 'Hoàn thành' },
      cancelled: { variant: 'danger' as const, label: 'Đã hủy' },
      suspended: { variant: 'secondary' as const, label: 'Tạm dừng' },
    };

    return variants[status];
  };

  const formatCurrency = (pricing: { tiers: Array<{ label: string; price: number }>; currency: string }) => {
    if (!pricing.tiers || pricing.tiers.length === 0) return 'N/A';
    const adultPrice = pricing.tiers.find(tier => tier.label === 'Adult')?.price || pricing.tiers[0].price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing.currency,
    }).format(adultPrice);
  };

  const formatDate = (dateString: string) => {
    // Format date as YYYY-MM-DD for easier reading
    return new Date(dateString).toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="p-6 flex items-center space-x-4">
              <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Không có tour nào</div>
        <div className="text-gray-400 text-sm">
          Thử thay đổi bộ lọc hoặc tạo tour mới
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tours.map((tour) => (
        <div
          key={tour.id}
          className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 border ${
            selectedTours.includes(tour.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
          }`}
        >
          <div className="p-6">
            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <div className="flex-shrink-0 pt-1">
                <input
                  type="checkbox"
                  checked={selectedTours.includes(tour.id)}
                  onChange={() => onSelectTour(tour.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title and Status */}
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {tour.title}
                      </h3>
                      <Badge
                        variant={getStatusBadge(tour.status).variant}
                        size="sm"
                      >
                        {getStatusBadge(tour.status).label}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {tour.description}
                    </p>

                    {/* Info Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {tour.currentParticipants}/{tour.maxParticipants} người
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-end space-y-3 ml-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(tour.pricing)}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="w-24">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Đăng ký</span>
                        <span>{Math.round((tour.currentParticipants / tour.maxParticipants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((tour.currentParticipants / tour.maxParticipants) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewTour(tour)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditTour(tour)}
                        className="text-blue-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTour(tour)}
                        className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50"
                        title="Xóa"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ToursList };
