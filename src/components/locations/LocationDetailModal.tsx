import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Location } from '@/types/api';
import { 
  MapPinIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface LocationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
}

const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  isOpen,
  onClose,
  location,
}) => {
  if (!location) return null;

  const getLocationTypeConfig = (type: Location['locationType']) => {
    const variants = {
      hotel: { variant: 'info' as const, label: 'Khách sạn' },
      restaurant: { variant: 'warning' as const, label: 'Nhà hàng' },
      attraction: { variant: 'success' as const, label: 'Điểm tham quan' },
      transport_hub: { variant: 'primary' as const, label: 'Trung tâm giao thông' },
      meeting_point: { variant: 'secondary' as const, label: 'Điểm hẹn' },
      activity_center: { variant: 'info' as const, label: 'Trung tâm hoạt động' },
      shopping: { variant: 'warning' as const, label: 'Mua sắm' },
      entertainment: { variant: 'primary' as const, label: 'Giải trí' },
      cultural_site: { variant: 'success' as const, label: 'Di tích văn hóa' },
      natural_site: { variant: 'info' as const, label: 'Điểm tự nhiên' },
    };
    return variants[type] || { variant: 'secondary' as const, label: type };
  };

  const typeConfig = getLocationTypeConfig(location.locationType);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết địa điểm"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {location.name}
            </h2>
            <div className="flex items-center space-x-3 mb-3">
              <Badge variant={typeConfig.variant}>
                {typeConfig.label}
              </Badge>
              <Badge variant={location.isVerified ? 'success' : 'warning'}>
                {location.isVerified ? (
                  <div className="flex items-center space-x-1">
                    <CheckCircleIcon className="h-3 w-3" />
                    <span>Đã xác thực</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <XCircleIcon className="h-3 w-3" />
                    <span>Chưa xác thực</span>
                  </div>
                )}
              </Badge>
            </div>
            {location.category && (
              <p className="text-sm text-gray-600">
                Danh mục: {location.category}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Mô tả</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {location.description}
          </p>
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address & Coordinates */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin vị trí</h3>
            <div className="space-y-3">
              {location.address && (
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Địa chỉ</p>
                    <p className="text-sm text-gray-900">{location.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin khác</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="text-sm text-gray-900">
                    {new Date(location.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Cập nhật gần nhất</p>
                  <p className="text-sm text-gray-900">
                    {new Date(location.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        {location.contactInfo && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Thông tin liên hệ</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                {location.contactInfo.phone && (
                  <div>
                    <p className="text-xs text-gray-500">Điện thoại</p>
                    <p className="text-gray-900">{location.contactInfo.phone}</p>
                  </div>
                )}
                {location.contactInfo.email && (
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-900">{location.contactInfo.email}</p>
                  </div>
                )}
                {location.contactInfo.website && (
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <a 
                      href={location.contactInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {location.contactInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        {location.images && location.images.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <PhotoIcon className="h-4 w-4" />
              <span>Hình ảnh ({location.images.length})</span>
            </h3>
            <div className="space-y-4">
              {/* Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {location.images.map((imageUrl, index) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={`${location.name} - Hình ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => window.open(imageUrl, '_blank')}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.fallback-icon');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="fallback-icon w-full h-full items-center justify-center text-gray-400 bg-gray-100" style={{ display: 'none' }}>
                      <div className="text-center">
                        <PhotoIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs">Không thể tải ảnh</p>
                      </div>
                    </div>
                    {/* Overlay với số thứ tự */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                    {/* Overlay click để mở */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white bg-opacity-90 rounded-full p-2">
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View All Images Link */}
              {location.images.length > 6 && (
                <div className="text-center">
                  <button
                    onClick={() => {
                      // Tạo một gallery view đơn giản
                      if (location.images) {
                        const gallery = location.images.map((img, i) => `<img src="${img}" alt="Image ${i + 1}" style="max-width: 100%; margin: 10px 0; display: block;">`).join('');
                        const newWindow = window.open('', '_blank');
                        if (newWindow) {
                          newWindow.document.write(`
                            <html>
                              <head><title>Gallery - ${location.name}</title></head>
                              <body style="margin: 20px; font-family: Arial;">
                                <h2>${location.name} - Tất cả hình ảnh</h2>
                                ${gallery}
                              </body>
                            </html>
                          `);
                        }
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                  >
                    Xem tất cả {location.images.length} hình ảnh →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amenities */}
        {location.amenities && location.amenities.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tiện ích</h3>
            <div className="flex flex-wrap gap-2">
              {location.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Opening Hours */}
        {location.openingHours && location.openingHours.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Giờ mở cửa</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {location.openingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">
                      {['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][schedule.dayOfWeek]}
                    </span>
                    <span className="text-gray-900">
                      {schedule.closed ? 'Đóng cửa' : `${schedule.openTime} - ${schedule.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LocationDetailModal;
