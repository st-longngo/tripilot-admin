import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/Badge';
import { Location } from '@/types/api';

interface LocationsTableProps {
  locations: Location[];
  loading?: boolean;
  selectedLocations: string[];
  onSelectLocation: (locationId: string) => void;
  onSelectAllLocations: (selected: boolean) => void;
  onViewLocation: (location: Location) => void;
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (location: Location) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

const LocationsTable: React.FC<LocationsTableProps> = ({
  locations,
  loading = false,
  selectedLocations,
  onSelectLocation,
  onSelectAllLocations,
  onViewLocation,
  onEditLocation,
  onDeleteLocation,
  sortBy,
  sortDirection,
  onSort,
}) => {
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

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const isAllSelected = locations.length > 0 && selectedLocations.length === locations.length;
  const isIndeterminate = selectedLocations.length > 0 && selectedLocations.length < locations.length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="relative px-6 py-3">
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={(e) => onSelectAllLocations(e.target.checked)}
              />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              Tên địa điểm {renderSortIcon('name')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('locationType')}
            >
              Loại {renderSortIcon('locationType')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('createdAt')}
            >
              Ngày tạo {renderSortIcon('createdAt')}
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {locations.map((location) => {
            const typeConfig = getLocationTypeConfig(location.locationType);
            
            return (
              <tr key={location.id} className="hover:bg-gray-50">
                <td className="relative px-6 py-4">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedLocations.includes(location.id)}
                    onChange={() => onSelectLocation(location.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{location.name}</div>
                  {location.address && (
                    <div className="text-sm text-gray-500">{location.address}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={typeConfig.variant}>
                    {typeConfig.label}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(location.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="relative whitespace-nowrap text-right text-sm font-medium px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewLocation(location)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditLocation(location)}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteLocation(location)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                      title="Xóa"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {locations.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không có địa điểm nào được tìm thấy.</p>
        </div>
      )}
    </div>
  );
};

export default LocationsTable;
