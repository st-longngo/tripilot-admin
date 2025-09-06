'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout';
import { Button, LoadingSpinner } from '@/components/ui';
import { useSettings } from '@/hooks/useSettings';
import { UserProfile } from '@/types/settings';
import { 
  UserIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const SettingsClient: React.FC = () => {
  const { userProfile, loading, error, updateProfile } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  // Initialize edit form when userProfile is loaded
  React.useEffect(() => {
    if (userProfile) {
      setEditForm(userProfile);
    }
  }, [userProfile]);

  const handleEdit = () => {
    setIsEditing(true);
    if (userProfile) {
      setEditForm(userProfile);
    }
  };

  const handleSave = async () => {
    if (!editForm.name || !editForm.email) {
      return;
    }

    setIsSaving(true);
    
    const success = await updateProfile({
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      department: editForm.department,
    });

    setIsSaving(false);

    if (success) {
      setIsEditing(false);
      // Show success message
      console.log('Thông tin đã được cập nhật thành công');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userProfile) {
      setEditForm(userProfile);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <LoadingSpinner size="lg" />
            <div className="text-gray-600 text-lg">Đang tải thông tin cài đặt...</div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="text-red-500 text-lg">{error}</div>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Thử lại
            </Button>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (!userProfile) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="text-gray-600 text-lg">Không tìm thấy thông tin người dùng</div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/login'}
              className="mt-4"
            >
              Đăng nhập lại
            </Button>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-600 mt-1">
              Quản lý thông tin cá nhân và cài đặt tài khoản
            </p>
          </div>

          {/* User Profile Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Thông tin cá nhân
                </h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="flex items-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Chỉnh sửa</span>
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="flex items-center space-x-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Hủy</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving || !editForm.name || !editForm.email}
                      className="flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          <span>Lưu</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                    {userProfile.avatar ? (
                      <Image
                        className="h-20 w-20 rounded-full object-cover"
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        width={80}
                        height={80}
                      />
                    ) : (
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {userProfile.name}
                  </h3>
                  <p className="text-gray-600">{userProfile.role}</p>
                  <p className="text-sm text-gray-500">
                    Tham gia từ: {new Date(userProfile.joinDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.phone || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng ban
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.department || 'Chưa cập nhật'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vai trò
                  </label>
                  <p className="text-gray-900">{userProfile.role}</p>
                  <span className="text-sm text-gray-500">Không thể chỉnh sửa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings Sections - Placeholders */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Cài đặt bảo mật
              </h2>
            </div>
            <div className="px-6 py-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Tính năng đang được phát triển</p>
                <p className="text-sm text-gray-400 mt-2">
                  Sẽ bao gồm: Đổi mật khẩu, Xác thực 2 yếu tố, Lịch sử đăng nhập
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Thông báo
              </h2>
            </div>
            <div className="px-6 py-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Tính năng đang được phát triển</p>
                <p className="text-sm text-gray-400 mt-2">
                  Sẽ bao gồm: Cài đặt email thông báo, Thông báo trong app
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
};

export default SettingsClient;
