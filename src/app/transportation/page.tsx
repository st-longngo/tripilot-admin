'use client';

import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';

export default function TransportationPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý vận chuyển</h1>
              <p className="text-gray-600">Quản lý phương tiện và lộ trình vận chuyển</p>
            </div>
            <Button className="flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Thêm phương tiện</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">Tính năng đang phát triển</div>
                <div className="text-gray-400 text-sm">
                  Chức năng quản lý vận chuyển sẽ được bổ sung trong phiên bản tiếp theo
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
