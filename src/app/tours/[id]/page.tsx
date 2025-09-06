'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { QRCodeModal } from '@/components/tours/QRCodeModal';
import { useTour } from '@/hooks/api/useTours';
import { ArrowLeftIcon, PencilIcon, ChevronDownIcon, ChevronUpIcon, QrCodeIcon } from '@heroicons/react/24/outline';

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

export default function TourDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params?.id as string;
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const { data: tour, isLoading, error } = useTour(tourId);
  
  // Cast tour data to include schedules
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

  const formatCurrency = (pricing: { price?: number; currency?: string; tiers?: Array<{ label: string; price: number }> }) => {
    if (!pricing) return 'N/A';
    
    // Handle new API format with direct price and currency
    if (pricing.price !== undefined) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: pricing.currency || 'VND',
      }).format(pricing.price);
    }
    
    // Handle legacy format with tiers (fallback)
    if (!pricing?.tiers || pricing.tiers.length === 0) return 'N/A';
    const adultPrice = pricing.tiers.find((tier: { label: string; price: number }) => tier.label === 'Adult')?.price || pricing.tiers[0].price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: pricing.currency || 'VND',
    }).format(adultPrice);
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (error || !tour) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">Không tìm thấy tour</div>
            <Button onClick={() => router.push('/tours')}>Quay lại danh sách</Button>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center relative justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/tours')}
              className="cursor-pointer absolute left-0"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div className='text-center'>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết Tour</h1>
              <p className="text-gray-600">Thông tin chi tiết về tour</p>
            </div>
            <div className="absolute right-0 flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowQRModal(true)}
                className="flex items-center space-x-2"
              >
                <QrCodeIcon className="h-4 w-4" />
                <span>QR Code</span>
              </Button>
              <Button 
                onClick={() => router.push(`/tours/${tour.id}/edit`)}
                className="flex items-center space-x-2"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Chỉnh sửa</span>
              </Button>
            </div>
          </div>

          {/* Tour Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{tour.title}</h2>
                <Badge
                  variant={getStatusConfig(tour.status).variant}
                  size="sm"
                >
                  {getStatusConfig(tour.status).label}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin cơ bản</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Mô tả:</span>
                        <p className="text-sm text-gray-900 mt-1">{tour.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Ngày bắt đầu:</span>
                          <p className="text-sm text-gray-900">{formatDate(tour.startDate)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Ngày kết thúc:</span>
                          <p className="text-sm text-gray-900">{formatDate(tour.endDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Giá và sức chứa</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Giá tour:</span>
                        <p className="text-sm text-gray-900 font-semibold">{formatCurrency(tour.pricing)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Sức chứa:</span>
                        <p className="text-sm text-gray-900">
                          {tour.currentParticipants || 0}/{tour.maxParticipants} người
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tour Schedule */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Lịch trình Tour</h3>
                    <div className="bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-600 rounded-lg p-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-center flex-1">
                            <h4 className="text-lg font-semibold text-gray-800">Lịch trình</h4>
                            <p className="text-sm text-gray-600">
                              {tourWithSchedules.schedules?.length || 0} hoạt động trong lịch trình
                            </p>
                          </div>
                        </div>
                        
                        <div className={`space-y-4 ${showAllSchedules ? 'max-h-none' : 'max-h-64'} overflow-y-auto`}>
                          {tourWithSchedules.schedules && tourWithSchedules.schedules.length > 0 ? (
                            tourWithSchedules.schedules
                              .sort((a, b) => {
                                if (a.dayNumber !== b.dayNumber) {
                                  return a.dayNumber - b.dayNumber;
                                }
                                return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
                              })
                              .slice(0, showAllSchedules ? undefined : 3)
                              .map((schedule, index: number) => (
                                <div key={schedule.id || index} className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-sm font-medium text-gray-900">
                                        {formatTimeRange(schedule.startTime, schedule.endTime)}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        Ngày {schedule.dayNumber}
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">
                                      {schedule.description || 'Hoạt động không có tên'}
                                    </p>
                                    {schedule.location && (
                                      <p className="text-xs text-gray-600">
                                        Tại {schedule.location.name}
                                      </p>
                                    )}
                                    {schedule.notes && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {schedule.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500 text-sm mb-4">
                                Chưa có lịch trình nào được tạo
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/tours/add?id=${tour.id}`)}
                                className="text-sm"
                              >
                                Thêm lịch trình
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {tourWithSchedules.schedules && tourWithSchedules.schedules.length > 3 && (
                          <div className="mt-4 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAllSchedules(!showAllSchedules)}
                              className="text-sm flex items-center space-x-2"
                            >
                              <span>
                                {showAllSchedules ? 'Thu gọn lịch trình' : 'Xem tất cả lịch trình'}
                              </span>
                              {showAllSchedules ? (
                                <ChevronUpIcon className="h-4 w-4" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          tourId={tour.id}
          tourTitle={tour.title}
        />
      </AppLayout>
    </AuthGuard>
  );
}
