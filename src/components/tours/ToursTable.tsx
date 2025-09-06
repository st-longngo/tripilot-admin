import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/Badge';
import { Tour } from '@/types/api';

interface ToursTableProps {
  tours: Tour[];
  loading?: boolean;
  selectedTours: string[];
  onSelectTour: (tourId: string) => void;
  onSelectAllTours: (selected: boolean) => void;
  onViewTour: (tour: Tour) => void;
  onEditTour: (tour: Tour) => void;
  onDeleteTour: (tour: Tour) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  searchQuery?: string;
}

const ToursTable: React.FC<ToursTableProps> = ({
  tours,
  loading = false,
  selectedTours,
  onSelectTour,
  onSelectAllTours,
  onViewTour,
  onEditTour,
  onDeleteTour,
  sortBy,
  sortDirection,
  onSort,
  searchQuery,
}) => {
  const getStatusConfig = (status: Tour['status']) => {
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

  const formatDate = (dateString: string) => {
    // Format date as YYYY-MM-DD for easier reading
    return new Date(dateString).toISOString().split('T')[0];
  };

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => onSort?.(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-600 cursor-pointer"
    >
      <span>{children}</span>
      {sortBy === field && (
        <span className="text-xs">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-t border-gray-200 bg-gray-50"></div>
          ))}
        </div>
      </div>
    );
  }

  const allSelected = tours.length > 0 && selectedTours.length === tours.length;
  const someSelected = selectedTours.length > 0 && selectedTours.length < tours.length;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAllTours(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="title">Tour</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="startDate">Ngày bắt đầu</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="endDate">Ngày kết thúc</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="status">Trạng thái</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="updatedAt">Cập nhật</SortButton>
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tours.map((tour) => (
              <tr
                key={tour.id}
                className={`hover:bg-gray-50 ${
                  selectedTours.includes(tour.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTours.includes(tour.id)}
                    onChange={() => onSelectTour(tour.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {tour.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {tour.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(tour.startDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(tour.endDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={getStatusConfig(tour.status).variant}
                    size="sm"
                  >
                    {getStatusConfig(tour.status).label}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(tour.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewTour(tour)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditTour(tour)}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTour(tour)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                      title="Xóa"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tours.length === 0 && (
        <div className="text-center py-12">
          {searchQuery ? (
            <>
              <div className="text-gray-500 text-lg mb-2">
                Không tìm thấy tour nào với từ khóa &ldquo;{searchQuery}&rdquo;
              </div>
              <div className="text-gray-400 text-sm">
                Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm
              </div>
            </>
          ) : (
            <>
              <div className="text-gray-500 text-lg mb-2">Không có tour nào</div>
              <div className="text-gray-400 text-sm">
                Thử thay đổi bộ lọc hoặc tạo tour mới
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export { ToursTable };
