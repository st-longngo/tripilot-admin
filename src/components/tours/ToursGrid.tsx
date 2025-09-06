import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon, CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/Badge';
import { Tour } from '@/types/api';

interface ToursGridProps {
  tours: Tour[];
  loading?: boolean;
  selectedTours: string[];
  onSelectTour: (tourId: string) => void;
  onViewTour: (tour: Tour) => void;
  onEditTour: (tour: Tour) => void;
  onDeleteTour: (tour: Tour) => void;
}

const ToursGrid: React.FC<ToursGridProps> = ({
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tours.map((tour) => (
        <div
          key={tour.id}
          className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden border ${
            selectedTours.includes(tour.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
          }`}
        >
          {/* Header with Checkbox and Status */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={selectedTours.includes(tour.id)}
                onChange={() => onSelectTour(tour.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Badge
                variant={getStatusBadge(tour.status).variant}
                size="sm"
              >
                {getStatusBadge(tour.status).label}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {tour.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {tour.description}
            </p>

            {/* Info Grid */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                {tour.currentParticipants}/{tour.maxParticipants} người
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Tỷ lệ đăng ký</span>
                <span>{Math.round((tour.currentParticipants / tour.maxParticipants) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((tour.currentParticipants / tour.maxParticipants) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(tour.pricing)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <button
                onClick={() => onViewTour(tour)}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Xem
              </button>
              <button
                onClick={() => onEditTour(tour)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Sửa
              </button>
              <button
                onClick={() => onDeleteTour(tour)}
                className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ToursGrid };
