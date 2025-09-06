'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useLocation, useCreateLocation, useUpdateLocation } from '@/hooks/api/useLocations';
import { CreateLocationFormData } from '@/types/forms';
import { LocationType } from '@/types/api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from '@/store/toastStore';

export default function LocationFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params?.id;
  const locationId = params?.id as string;

  // Form state
  const [formData, setFormData] = useState<CreateLocationFormData>({
    name: '',
    description: '',
    locationType: 'attraction' as LocationType,
    address: '',
    category: '',
    contactInfo: {
      phone: '',
      email: '',
      website: '',
    },
    openingHours: {
      mon_fri: '',
      sat: '',
      sun: '',
    },
    images: [],
    amenities: [],
  });

  // New state for dynamic inputs
  const [newImage, setNewImage] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  // Hooks
  const { data: existingLocation, isLoading: isLoadingLocation } = useLocation(locationId);
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();

  // Load existing data for edit mode
  useEffect(() => {
    if (isEdit && existingLocation) {
      setFormData({
        name: existingLocation.name,
        description: existingLocation.description,
        locationType: existingLocation.locationType,
        address: existingLocation.address || '',
        category: existingLocation.category || '',
        contactInfo: {
          phone: existingLocation.contactInfo?.phone || '',
          email: existingLocation.contactInfo?.email || '',
          website: existingLocation.contactInfo?.website || '',
        },
        openingHours: {
          mon_fri: '',
          sat: '',
          sun: '',
        },
        images: existingLocation.images || [],
        amenities: existingLocation.amenities || [],
      });
    }
  }, [isEdit, existingLocation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    if (parent === 'contactInfo') {
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value,
        },
      }));
    } else if (parent === 'openingHours') {
      setFormData(prev => ({
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [field]: value,
        },
      }));
    }
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()],
      }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: locationId,
          data: formData,
        });
        toast.success(
          'Cập nhật địa điểm thành công', 
          `Địa điểm "${formData.name}" đã được cập nhật thành công.`
        );
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(
          'Thêm địa điểm thành công', 
          `Địa điểm "${formData.name}" đã được thêm vào hệ thống.`
        );
      }
      router.push('/locations');
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error(
        isEdit ? 'Lỗi cập nhật địa điểm' : 'Lỗi thêm địa điểm',
        'Có lỗi xảy ra khi lưu thông tin địa điểm. Vui lòng thử lại.'
      );
    }
  };

  const isLoading = isLoadingLocation || createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoadingLocation) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center relative justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/locations')}
              className="cursor-pointer absolute left-0"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div className='text-center'>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Cập nhật thông tin địa điểm' : 'Tạo địa điểm du lịch mới'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow space-y-6 p-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên địa điểm *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên địa điểm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại địa điểm *
                </label>
                <select
                  required
                  value={formData.locationType}
                  onChange={(e) => handleInputChange('locationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="hotel">Khách sạn</option>
                  <option value="restaurant">Nhà hàng</option>
                  <option value="attraction">Điểm tham quan</option>
                  <option value="transport_hub">Trung tâm giao thông</option>
                  <option value="meeting_point">Điểm hẹn</option>
                  <option value="activity_center">Trung tâm hoạt động</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả chi tiết về địa điểm"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Beach Road, Da Nang"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="beach_front"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo?.phone}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+84 123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo?.email}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="info@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.contactInfo?.website}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Giờ mở cửa</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thứ 2 - Thứ 6
                  </label>
                  <input
                    type="text"
                    value={formData.openingHours?.mon_fri}
                    onChange={(e) => handleNestedInputChange('openingHours', 'mon_fri', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="08:00-18:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thứ 7
                  </label>
                  <input
                    type="text"
                    value={formData.openingHours?.sat}
                    onChange={(e) => handleNestedInputChange('openingHours', 'sat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="09:00-13:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ nhật
                  </label>
                  <input
                    type="text"
                    value={formData.openingHours?.sun}
                    onChange={(e) => handleNestedInputChange('openingHours', 'sun', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Đóng cửa hoặc 10:00-16:00"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!newImage.trim()}
                    className="cursor-pointer"
                  >
                    Thêm
                  </Button>
                </div>
                
                {formData.images && formData.images.length > 0 && (
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <span className="text-sm text-gray-700 truncate flex-1 mr-4">{image}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                          className="cursor-pointer"
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tiện ích</h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="wifi, pool, breakfast..."
                  />
                  <Button
                    type="button"
                    onClick={handleAddAmenity}
                    disabled={!newAmenity.trim()}
                    className="cursor-pointer"
                  >
                    Thêm
                  </Button>
                </div>
                
                {formData.amenities && formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/locations')}
                disabled={isLoading}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? (
                  <LoadingSpinner className="mr-2" />
                ) : null}
                {isEdit ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
