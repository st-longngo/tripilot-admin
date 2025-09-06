'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useUser } from '@/hooks/api/useUsers';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, error } = useUser(userId);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'tour_operator':
        return 'warning';
      case 'tour_guide':
        return 'info';
      case 'customer':
      default:
        return 'success';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'tour_operator':
        return 'Nhà điều hành';
      case 'tour_guide':
        return 'Hướng dẫn viên';
      case 'customer':
      default:
        return 'Khách hàng';
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (error || !user) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">Không tìm thấy người dùng</div>
            <Button onClick={() => router.push('/users')}>
              Quay lại danh sách
            </Button>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/users')}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Quay lại</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chi tiết người dùng</h1>
                <p className="text-gray-600">Thông tin chi tiết của người dùng {user.fullName}</p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/users/${userId}/edit`)}
              className="flex items-center space-x-2"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Chỉnh sửa</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16">
                      <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-700">
                          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">{user.fullName}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="mt-2">
                        <Badge 
                          variant={getRoleBadgeVariant(user.role)}
                          size="sm"
                        >
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                    <p className="mt-1 text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Múi giờ</label>
                    <p className="mt-1 text-gray-900">{user.timezone || 'Asia/Ho_Chi_Minh'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái tài khoản</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Trạng thái</span>
                    <Badge variant="success" size="sm">
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Email xác thực</span>
                    <Badge variant={user.emailVerified ? 'success' : 'warning'} size="sm">
                      {user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">SĐT xác thực</span>
                    <Badge variant={user.phoneVerified ? 'success' : 'warning'} size="sm">
                      {user.phoneVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Ngày tạo</span>
                    <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Lần đăng nhập cuối</span>
                    <p className="text-gray-900">
                      {user.lastLoginAt 
                        ? new Date(user.lastLoginAt).toLocaleDateString('vi-VN')
                        : 'Chưa đăng nhập'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
