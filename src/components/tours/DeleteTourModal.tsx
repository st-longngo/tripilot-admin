import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tourTitle: string;
  loading?: boolean;
}

export const DeleteTourModal: React.FC<DeleteTourModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tourTitle,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xóa Tour">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">
              Bạn có chắc chắn muốn xóa tour <strong>&quot;{tourTitle}&quot;</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến tour sẽ bị xóa vĩnh viễn.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            Xóa Tour
          </Button>
        </div>
      </div>
    </Modal>
  );
};
