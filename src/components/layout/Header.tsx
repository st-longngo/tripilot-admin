import React from 'react';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { BreadcrumbItem } from '@/types/components';
import { useUIStore, useAuthStore } from '@/store';
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';

interface HeaderProps {
  pageTitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, breadcrumbs, actions }) => {
  const { notifications } = useUIStore();
  const { user, logout } = useAuthStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className='bg-white border-b border-gray-200 px-4 py-3'>
      <div className='flex items-center justify-between'>
        {/* Left section */}
        <div className='flex-1'>
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Breadcrumb items={breadcrumbs} />
          ) : pageTitle ? (
            <h1 className='text-2xl font-semibold text-gray-900'>
              {pageTitle}
            </h1>
          ) : null}
        </div>

        {/* Center section - Search */}
        <div className='flex-1 max-w-lg mx-4'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              placeholder='Tìm kiếm...'
            />
          </div>
        </div>

        {/* Right section */}
        <div className='flex items-center space-x-4'>
          {/* Actions */}
          {actions && (
            <div className='flex items-center space-x-2'>{actions}</div>
          )}

          {/* Notifications */}
          <button className='relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md'>
            <BellIcon className='h-6 w-6' />
            {unreadCount > 0 && (
              <span className='absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white'></span>
            )}
          </button>

          {/* User menu */}
          <Menu as='div' className='relative'>
            <Menu.Button className='flex items-center space-x-2 p-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md'>
              <UserCircleIcon className='h-6 w-6' />
              <span className='hidden md:block'>
                {user?.fullName || 'User'}
              </span>
            </Menu.Button>

            <Transition
              as={React.Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 z-50 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg focus:outline-none'>
                <div className='py-1'>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href='/settings'
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <Cog6ToothIcon className='h-4 w-4 mr-2' />
                        Cài đặt
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <ArrowRightOnRectangleIcon className='h-4 w-4 mr-2' />
                        Đăng xuất
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export { Header };
