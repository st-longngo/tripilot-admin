'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTour } from '@/hooks/api/useTours';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

// Type to match the actual API response structure with schedules
interface TourWithSchedules {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  organizerId: string | null;
  createdAt: string;
  updatedAt: string;
  pricing: {
    price: number;
    currency: string;
  };
  schedules?: Array<{
    id: string;
    dayNumber: number;
    startTime: string;
    endTime: string;
    description: string;
    notes: string;
    location?: {
      id: string;
      name: string;
    };
  }>;
}

export default function PublicTourDetailPage() {
  const params = useParams();
  const tourId = params?.id as string;

  const { data: tour, isLoading, error } = useTour(tourId);
  const tourWithSchedules = tour as unknown as TourWithSchedules;

  const getStatusConfig = (status: string) => {
    const variants = {
      draft: { variant: 'warning' as const, label: 'Bản nháp' },
      published: { variant: 'info' as const, label: 'Đã xuất bản' },
      active: { variant: 'success' as const, label: 'Đang hoạt động' },
      completed: { variant: 'primary' as const, label: 'Hoàn thành' },
      cancelled: { variant: 'danger' as const, label: 'Đã hủy' },
      suspended: { variant: 'secondary' as const, label: 'Tạm dừng' },
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 'N/A';
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const formatCurrency = (pricing: { price?: number; currency?: string }) => {
    if (!pricing || pricing.price === undefined) return 'N/A';
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: pricing.currency || 'VND',
    }).format(pricing.price);
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Không tìm thấy tour</div>
          <p className="text-gray-400">Vui lòng kiểm tra lại mã QR hoặc liên hệ với chúng tôi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
            <div className="flex justify-center">
              <Badge
                variant={getStatusConfig(tour.status).variant}
                size="sm"
              >
                {getStatusConfig(tour.status).label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tour Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tổng quan Tour</h2>
          <p className="text-gray-700 mb-6">{tour.description}</p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Thời gian</div>
              <div className="font-medium text-gray-900">
                {calculateDuration(tour.startDate, tour.endDate)}
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UsersIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Sức chứa</div>
              <div className="font-medium text-gray-900">
                {tour.maxParticipants} người
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Bắt đầu</div>
              <div className="font-medium text-gray-900">
                {formatDate(tour.startDate)}
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <MapPinIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Giá tour</div>
              <div className="font-medium text-gray-900">
                {formatCurrency(tour.pricing)}
              </div>
            </div>
          </div>
        </div>

        {/* Tour Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch trình chi tiết</h2>
          
          {tourWithSchedules.schedules && tourWithSchedules.schedules.length > 0 ? (
            <div className="space-y-4">
              {tourWithSchedules.schedules
                .sort((a, b) => {
                  if (a.dayNumber !== b.dayNumber) {
                    return a.dayNumber - b.dayNumber;
                  }
                  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
                })
                .map((schedule, index) => (
                  <div key={schedule.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {schedule.dayNumber}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {schedule.description || 'Hoạt động không có tên'}
                          </h3>
                          <span className="text-sm text-gray-500">
                            Ngày {schedule.dayNumber}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{formatTimeRange(schedule.startTime, schedule.endTime)}</span>
                          </div>
                          
                          {schedule.location && (
                            <div className="flex items-center space-x-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{schedule.location.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {schedule.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {schedule.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">Chưa có lịch trình chi tiết</div>
              <p className="text-gray-400 text-sm">
                Lịch trình sẽ được cập nhật sớm nhất có thể
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Cảm ơn bạn đã quan tâm đến tour của chúng tôi!</p>
          <p className="mt-1">Để biết thêm thông tin chi tiết, vui lòng liên hệ với chúng tôi.</p>
        </div>
      </div>
    </div>
  );
}
