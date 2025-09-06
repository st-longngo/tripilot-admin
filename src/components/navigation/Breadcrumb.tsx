import React from 'react';
import { BreadcrumbItem } from '@/types';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  maxItems?: number;
}

interface BreadcrumbItemType {
  name: string;
  href?: string;
  current?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, maxItems = 5 }) => {
  const displayItems = items.length > maxItems 
    ? [
        items[0],
        { name: '...', href: undefined },
        ...items.slice(-2)
      ]
    : items;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/dashboard" 
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
          </Link>
        </li>
        
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span
                className={`text-sm font-medium ${
                  item.current 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                }`}
              >
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export { Breadcrumb };
