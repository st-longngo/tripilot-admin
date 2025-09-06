'use client';

import React from 'react';
import Image from 'next/image';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Location } from '@/types/api';

interface DeleteLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  onConfirm: (location: Location) => void;
  isDeleting?: boolean;
}

const DeleteLocationModal: React.FC<DeleteLocationModalProps> = ({
  isOpen,
  onClose,
  location,
  onConfirm,
  isDeleting = false,
}) => {
  if (!location) return null;

  const handleConfirm = () => {
    onConfirm(location);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!isDeleting}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Xác nhận xóa địa điểm
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            Bạn có chắc chắn muốn xóa địa điểm này không? Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isDeleting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xóa...</span>
              </div>
            ) : (
              'Xóa địa điểm'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteLocationModal;
