'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTour, useCreateTour, useUpdateTour } from '@/hooks/api/useTours';
import { useLocations } from '@/hooks/api/useLocations';
import { TourQuickCreateFormData } from '@/types/forms';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon } from 'lucide-react';
import { AssignUsersModal } from '@/components/tours/AssignUsersModal';

// Type to match the actual API response structure
interface TourDetailResponse {
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
    tourId: string;
    dayNumber: number;
    startTime: string;
    endTime: string;
    locationId: string;
    activityType: string;
    description: string;
    notes: string;
    createdAt: string;
    location: {
      id: string;
      name: string;
      description: string;
      address: string | null;
      latitude: string;
      longitude: string;
      locationType: string;
      category: string | null;
      contactInfo: string | null;
      openingHours: string | null;
      rating: number | null;
      images: string | null;
      amenities: string | null;
      createdBy: string;
      isVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

export default function TourFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params?.id;
  const tourId = params?.id as string;

  // Form state
  const [formData, setFormData] = useState<TourQuickCreateFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    maxParticipants: 10,
    status: 'draft', // Default status for new tours
    pricing: {
      currency: 'VND',
      price: 0,
    },
    tags: [],
    schedules: [],
  });
  const [showAssignUsersModal, setShowAssignUsersModal] = useState(false);

  // Additional state for dynamic inputs
  const [newTag, setNewTag] = useState('');

  // Hooks
  const { data: existingTour, isLoading: isLoadingTour } = useTour(tourId);
  const { data: locations = [], isLoading: isLoadingLocations } = useLocations();
  const createTourMutation = useCreateTour();
  const updateTourMutation = useUpdateTour();

  // Load existing tour data when editing
  useEffect(() => {
    if (isEdit && existingTour) {
      // Cast to the actual API response type
      const tourData = existingTour as unknown as TourDetailResponse;
      
      // Convert datetime strings to local datetime format for inputs
      const formatDateTimeForInput = (dateTimeString: string) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        // Format as YYYY-MM-DDTHH:MM for datetime-local input
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        title: tourData.title || '',
        description: tourData.description || '',
        startDate: tourData.startDate ? tourData.startDate.split('T')[0] : '',
        endDate: tourData.endDate ? tourData.endDate.split('T')[0] : '',
        maxParticipants: tourData.maxParticipants || 10,
        status: tourData.status || 'draft',
        pricing: {
          currency: tourData.pricing?.currency || 'VND',
          price: tourData.pricing?.price || 0,
        },
        tags: [],
        schedules: tourData.schedules?.map((schedule) => ({
          dayNumber: schedule.dayNumber || 1,
          startTime: formatDateTimeForInput(schedule.startTime),
          endTime: formatDateTimeForInput(schedule.endTime),
          locationId: schedule.locationId || '',
          activityType: schedule.activityType || 'sightseeing',
          description: schedule.description || '',
          notes: schedule.notes || '',
        })) || [],
      });
    }
  }, [isEdit, existingTour]);

  const isLoading = isLoadingTour || isLoadingLocations;

  // Handlers
  const handleInputChange = (field: keyof TourQuickCreateFormData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePricingChange = (field: 'currency' | 'price', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value,
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddSchedule = () => {
    const newSchedule = {
      dayNumber: 1,
      startTime: '',
      endTime: '',
      locationId: '',
      activityType: 'sightseeing',
      description: '',
      notes: '',
    };
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, newSchedule],
    }));
  };

  const handleScheduleChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule
      ),
    }));
  };

  const handleRemoveSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data with Date objects for startDate and endDate
    const submitData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : '',
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : '',
    };
    
    try {
      if (isEdit) {
        await updateTourMutation.mutateAsync({ id: tourId, data: submitData });
      } else {
        const newData = { ...submitData };
        delete newData.status; // Remove status for new tours, backend will set default
        await createTourMutation.mutateAsync(newData);
      }
      router.push('/tours');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Chỉnh sửa Tour' : 'Tạo Tour Mới'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Cập nhật thông tin tour' : 'Điền thông tin để tạo tour mới'}
              </p>
            </div>
            {tourId && 
              <Button
                variant="outline"
                onClick={() => setShowAssignUsersModal(true)}
                className="flex items-center space-x-2 absolute right-0"
              >
                <UserPlusIcon className="h-4 w-4" />
                <span>Thêm thành viên đoàn</span>
              </Button>
            }
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Tên tour *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên tour"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mô tả tour"
                  />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày kết thúc *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Max Participants */}
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng người tối đa *
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Status - Only show for edit */}
                {isEdit && (
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái *
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="draft">Bản nháp</option>
                      <option value="published">Đã xuất bản</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Giá tour</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Loại tiền tệ *
                  </label>
                  <select
                    id="currency"
                    value={formData.pricing.currency}
                    onChange={(e) => handlePricingChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Giá *
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.pricing.price}
                    onChange={(e) => handlePricingChange('price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Thêm tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Schedules */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Lịch trình</h2>
                <Button type="button" onClick={handleAddSchedule} size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Thêm lịch trình
                </Button>
              </div>
              
                <div className="space-y-4">
                {(() => {
                  // Group schedules by day and sort them
                  const schedulesByDay = formData.schedules.reduce((acc, schedule, index) => {
                    const day = schedule.dayNumber;
                    if (!acc[day]) acc[day] = [];
                    acc[day].push({ ...schedule, index });
                    return acc;
                  }, {} as Record<number, Array<(typeof formData.schedules)[0] & { index: number }>>);

                  // Sort days and schedules within each day
                  const sortedDays = Object.keys(schedulesByDay)
                    .map(Number)
                    .sort((a, b) => a - b);

                  return sortedDays.map(day => (
                    <div key={day}>
                      <div className="bg-blue-50 px-4 py-2 rounded-t-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-800">Ngày {day}</h3>
                      </div>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-b-lg">
                        {schedulesByDay[day]
                          .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                          .map((schedule) => (
                            <div key={schedule.index} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-md font-medium text-gray-800">
                                  Hoạt động {schedulesByDay[day].indexOf(schedule) + 1}
                                  {schedule.startTime && (
                                    <span className="ml-2 text-sm text-gray-600">
                                      ({new Date(schedule.startTime).toLocaleTimeString('vi-VN', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })})
                                    </span>
                                  )}
                                </h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveSchedule(schedule.index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày thứ *
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={schedule.dayNumber}
                                    onChange={(e) => handleScheduleChange(schedule.index, 'dayNumber', parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="1"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời gian bắt đầu *
                                  </label>
                                  <input
                                    type="datetime-local"
                                    value={schedule.startTime}
                                    onChange={(e) => handleScheduleChange(schedule.index, 'startTime', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời gian kết thúc *
                                  </label>
                                  <input
                                    type="datetime-local"
                                    value={schedule.endTime}
                                    onChange={(e) => handleScheduleChange(schedule.index, 'endTime', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa điểm
                                  </label>
                                  <select
                                    value={schedule.locationId}
                                    onChange={(e) => handleScheduleChange(schedule.index, 'locationId', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Chọn địa điểm</option>
                                    {locations.map((location) => (
                                      <option key={location.id} value={location.id}>
                                        {location.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div className="lg:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại hoạt động
                                  </label>
                                  <select
                                    value={schedule.activityType}
                                    onChange={(e) => handleScheduleChange(schedule.index, 'activityType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="sightseeing">Tham quan</option>
                                    <option value="transport">Di chuyển</option>
                                    <option value="meal">Ăn uống</option>
                                    <option value="accommodation">Nghỉ ngơi</option>
                                    <option value="free_time">Thời gian tự do</option>
                                    <option value="meeting">Tập trung</option>
                                  </select>
                                </div>
                                
                                <div className="lg:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả hoạt động
                                  </label>
                                  <input
                                    type="text"
                                    value={schedule.description}
                                    onChange={(e) => handleScheduleChange(schedule.index, 'description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Mô tả hoạt động"
                                  />
                                </div>
                                
                                <div className="lg:col-span-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú
                                  </label>
                                  <input
                                    type="text"
                                    value={schedule.notes}
                                    onChange={(e) => handleScheduleChange(schedule.index, 'notes', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ghi chú thêm"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ));
                })()}
                
                {formData.schedules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có lịch trình nào. Nhấn &quot;Thêm lịch trình&quot; để bắt đầu.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/tours')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                loading={createTourMutation.isPending || updateTourMutation.isPending}
              >
                {isEdit ? 'Cập nhật Tour' : 'Tạo Tour'}
              </Button>
            </div>
          </form>
          {/* Assign Users Modal */}
          <AssignUsersModal
            isOpen={showAssignUsersModal}
            onClose={() => setShowAssignUsersModal(false)}
            tourId={tourId}
            tourTitle={formData?.title}
          />
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
