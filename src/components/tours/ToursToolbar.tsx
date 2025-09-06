import React, { useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  X,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToursToolbarProps, BulkAction } from '@/types/components';

const ToursToolbar: React.FC<ToursToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkActions,
  onClearSelection,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Add keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const bulkActions: BulkAction[] = [
    { value: 'activate', label: 'Kích hoạt', color: 'text-green-600' },
    { value: 'deactivate', label: 'Tạm dừng', color: 'text-yellow-600' },
    { value: 'draft', label: 'Chuyển thành nháp', color: 'text-gray-600' },
    { value: 'duplicate', label: 'Nhân bản', color: 'text-blue-600' },
    { value: 'export', label: 'Xuất Excel', color: 'text-purple-600' },
    { value: 'delete', label: 'Xóa', color: 'text-red-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Main Toolbar */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm tours..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* View Mode & Filters */}
          <div className="flex items-center space-x-3">
            {/* Empty space where filters and view mode toggle were */}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar (xuất hiện khi có selection) */}
      {(selectedCount ?? 0) > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Selection Counter */}
              <div className="flex items-center text-sm text-gray-700">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="font-medium">{selectedCount ?? 0} được chọn</span>
                <button
                  onClick={onClearSelection}
                  className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Bỏ chọn tất cả"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Bulk Action Dropdown */}
              <div className="relative">
                <div className="flex items-center space-x-2">
                  {bulkActions.slice(0, 3).map((action) => (
                    <Button
                      key={action.value}
                      variant="outline"
                      size="sm"
                      onClick={() => onBulkActions?.(action.value)}
                      className={`${action.color} border-gray-300 hover:bg-gray-100`}
                    >
                      {action.label}
                    </Button>
                  ))}
                  
                  {/* More Actions Dropdown */}
                  <div className="relative group">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      Thêm
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-1">
                        {bulkActions.slice(3).map((action) => (
                          <button
                            key={action.value}
                            onClick={() => onBulkActions?.(action.value)}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${action.color}`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ToursToolbar };
