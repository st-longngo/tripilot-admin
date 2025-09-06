import React from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/layout/Header';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: Array<{ name: string; href?: string; current?: boolean }>;
  actions?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  pageTitle,
  breadcrumbs,
  actions,
}) => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header 
          pageTitle={pageTitle}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className={cn(
              'mx-auto px-4 sm:px-6 lg:px-8',
              sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'
            )}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export { AppLayout };
