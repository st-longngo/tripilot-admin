'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useUIStore, useAuthStore } from '@/store';
import {
  HomeIcon,
  MapIcon,
  UsersIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
  badge?: string;
  permission?: string;
}

const navigation: NavItem[] = [
  { name: 'Trang chủ', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Quản lý Tours',
    href: '/tours',
    icon: MapIcon,
  },
  {
    name: 'Quản lý người dùng',
    href: '/users',
    icon: UsersIcon,
  },
  {
    name: 'Quản lý địa điểm',
    href: '/locations',
    icon: MapPinIcon,
  },
  // {
  //   name: 'Quản lý vận chuyển',
  //   href: '/transportation',
  //   icon: TruckIcon,
  // },
  // {
  //   name: 'Quản lý FAQ',
  //   href: '/faq',
  //   icon: QuestionMarkCircleIcon,
  // },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { hasPermission } = useAuthStore();

  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );

  const toggleExpanded = (href: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const filteredNavigation = navigation.filter((item) => {
    if (item.permission) {
      return hasPermission(item.permission);
    }
    return true;
  });

  return (
    <div
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        {!sidebarCollapsed && (
          <Link href='/dashboard' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <Image src={'/logo.png'} alt="Tripilot Logo" width={36} height={36} />
            </div>
            <span className='text-xl font-bold text-gray-900'>Tripilot</span>
          </Link>
        )}

        <button
          onClick={toggleSidebar}
          className='p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        >
          {sidebarCollapsed ? (
            <ChevronRightIcon className='w-5 h-5' />
          ) : (
            <ChevronLeftIcon className='w-5 h-5' />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto px-2 py-4 space-y-1'>
        {filteredNavigation.map((item) => {
          const isItemActive = isActive(item.href);
          const isExpanded = expandedItems.has(item.href);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name}>
              <div
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
                  isItemActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
                onClick={() => {
                  if (hasChildren) {
                    toggleExpanded(item.href);
                  }
                }}
              >
                {hasChildren ? (
                  <div className='flex items-center flex-1'>
                    <item.icon className='w-5 h-5 mr-3 flex-shrink-0' />
                    {!sidebarCollapsed && (
                      <>
                        <span className='truncate'>{item.name}</span>
                        {item.badge && (
                          <span className='ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full'>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    // @ts-expect-error - Next.js Link href type issue
                    href={item.href}
                    className='flex items-center flex-1'
                  >
                    <item.icon className='w-5 h-5 mr-3 flex-shrink-0' />
                    {!sidebarCollapsed && (
                      <>
                        <span className='truncate'>{item.name}</span>
                        {item.badge && (
                          <span className='ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full'>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )}

                {hasChildren && !sidebarCollapsed && (
                  <ChevronRightIcon
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                )}
              </div>

              {/* Sub-navigation */}
              {hasChildren && isExpanded && !sidebarCollapsed && (
                <div className='ml-8 mt-1 space-y-1'>
                  {item.children?.map((child) => (
                    <Link
                      key={child.name}
                      // @ts-expect-error - Next.js Link href type issue
                      href={child.href}
                      className={cn(
                        'block px-3 py-2 text-sm rounded-md transition-colors',
                        isActive(child.href)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User info */}
      {!sidebarCollapsed && (
        <div className='border-t border-gray-200 p-4'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gray-300 rounded-full'></div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                Quản trị viên
              </p>
              <p className='text-xs text-gray-500 truncate'>
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Sidebar };
