import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  Filter, 
  Calendar, 
  MapPin, 
  Tag, 
  BarChart3, 
  DollarSign, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToursFiltersProps, ToursFiltersState, FilterOption } from '@/types/components';

const ToursFilters: React.FC<ToursFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onResetFilters,
  onApplyFilters,
}) => {
  const destinations = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hội An', 'Nha Trang',
    'Phú Quốc', 'Sapa', 'Hạ Long', 'Đà Lạt', 'Cần Thơ'
  ];

  const categories = [
    'Adventure', 'Culture', 'Beach', 'City Tour', 'Nature',
    'Food & Drink', 'Photography', 'Luxury', 'Budget', 'Family'
  ];

  const statusOptions: FilterOption[] = [
    { value: 'active', label: 'Đang hoạt động', color: 'text-green-600' },
    { value: 'draft', label: 'Bản nháp', color: 'text-yellow-600' },
    { value: 'paused', label: 'Tạm dừng', color: 'text-orange-600' },
    { value: 'cancelled', label: 'Đã hủy', color: 'text-red-600' },
    { value: 'completed', label: 'Hoàn thành', color: 'text-blue-600' },
  ];

  const handleDestinationChange = (destination: string) => {
    const newDestinations = filters.destinations.includes(destination)
      ? filters.destinations.filter(d => d !== destination)
      : [...filters.destinations, destination];
    
    onFiltersChange({
      ...filters,
      destinations: newDestinations,
    });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleStatusChange = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFiltersChange({
      ...filters,
      status: newStatus,
    });
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Filter className="h-6 w-6 text-gray-600 mr-2" />
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Bộ lọc Tours
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-md p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Filters Content */}
                <div className="space-y-6">
                  {/* Date Range */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Khoảng thời gian
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters.dateRange.startDate?.toISOString().split('T')[0] || ''}
                          onChange={(e) => onFiltersChange({
                            ...filters,
                            dateRange: { ...filters.dateRange, startDate: new Date(e.target.value) }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters.dateRange.endDate?.toISOString().split('T')[0] || ''}
                          onChange={(e) => onFiltersChange({
                            ...filters,
                            dateRange: { ...filters.dateRange, endDate: new Date(e.target.value) }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Destinations */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      Điểm đến
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {destinations.map((destination) => (
                        <label key={destination} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.destinations.includes(destination)}
                            onChange={() => handleDestinationChange(destination)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{destination}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Tag className="h-4 w-4 mr-2" />
                      Loại tour
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            filters.categories.includes(category)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Trạng thái
                    </label>
                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        <label key={status.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status.value)}
                            onChange={() => handleStatusChange(status.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className={`ml-2 text-sm ${status.color}`}>
                            {status.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Khoảng giá (VND)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Từ</label>
                        <input
                          type="number"
                          min="0"
                          step="100000"
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters.priceRange[0] || ''}
                          onChange={(e) => onFiltersChange({
                            ...filters,
                            priceRange: [Number(e.target.value), filters.priceRange[1]]
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Đến</label>
                        <input
                          type="number"
                          min="0"
                          step="100000"
                          placeholder="Không giới hạn"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters.priceRange[1] || ''}
                          onChange={(e) => onFiltersChange({
                            ...filters,
                            priceRange: [filters.priceRange[0], Number(e.target.value)]
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capacity Range */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Users className="h-4 w-4 mr-2" />
                      Sức chứa
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Tối thiểu</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters.capacity[0] || ''}
                          onChange={(e) => onFiltersChange({
                            ...filters,
                            capacity: [Number(e.target.value), filters.capacity[1]]
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Tối đa</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="Không giới hạn"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={filters.capacity[1] || ''}
                          onChange={(e) => onFiltersChange({
                            ...filters,
                            capacity: [filters.capacity[0], Number(e.target.value)]
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={onResetFilters}
                    className="text-gray-600"
                  >
                    🔄 Đặt lại
                  </Button>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={onClose}>
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        onApplyFilters();
                        onClose();
                      }}
                    >
                      ✅ Áp dụng
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export { ToursFilters, type ToursFiltersState };
