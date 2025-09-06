'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { HeartIcon } from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <AppLayout>
      <div className='bg-transparent'>
        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='text-center'>
              {/* Welcome Message */}
              <div className='mb-8'>
                <div className='flex justify-center mb-6'>
                  <div className='relative'>
                    <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg'>
                      <HeartIcon className='w-12 h-12 text-white' />
                    </div>
                    <div className='absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center'>
                      <span className='text-sm'>👋</span>
                    </div>
                  </div>
                </div>

                <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-4'>
                  Chào mừng đến với{' '}
                  <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
                    Tripilot
                  </span>
                </h1>

                <p className='text-xl md:text-2xl text-gray-600 mb-2'>
                  Xin chào,{' '}
                  <span className='font-semibold text-blue-600'>
                    {user?.fullName || 'Admin'}
                  </span>
                  !
                </p>

                <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
                  Hệ thống quản lý tour du lịch hiện đại, giúp bạn tổ chức và
                  vận hành các chuyến du lịch một cách hiệu quả nhất.
                </p>
              </div>

              {/* Decorative Elements */}
              <div className='relative'>
                <div className='absolute inset-0 flex justify-center items-center opacity-5'>
                  <div className='w-96 h-96 border-4 border-blue-200 rounded-full'></div>
                </div>
                <div className='absolute inset-0 flex justify-center items-center opacity-5'>
                  <div className='w-80 h-80 border-4 border-purple-200 rounded-full'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const DashboardPageWithAuth = () => {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
};

export default DashboardPageWithAuth;
