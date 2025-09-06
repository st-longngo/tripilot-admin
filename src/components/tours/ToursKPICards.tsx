import React from 'react';
import { 
  Target, 
  CheckCircle, 
  FileText
} from 'lucide-react';
import { ToursKPICardsProps, KPICardColorType } from '@/types/components';

interface LocalKPICardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: KPICardColorType;
  onClick?: () => void;
  loading?: boolean;
}

const KPICard: React.FC<LocalKPICardProps> = ({
  title,
  value,
  icon: IconComponent,
  color,
  onClick,
  loading = false,
}) => {
  const colorClasses: Record<KPICardColorType, string> = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    red: 'bg-red-50 border-red-200 hover:bg-red-100',
    indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
  };

  const textColorClasses: Record<KPICardColorType, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border-2 p-6 transition-all duration-200 ${
        colorClasses[color]
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-bold ${textColorClasses[color]}`}>
            {value}
          </div>
          <div className="text-sm text-gray-600 mt-1">{title}</div>
        </div>
        <div className={`${textColorClasses[color]}`}>
          <IconComponent className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

const ToursKPICards: React.FC<ToursKPICardsProps> = ({
  loading = false,
  onCardClick,
}) => {
  const kpiData: Array<{
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: KPICardColorType;
    type: string;
  }> = [
    {
      title: 'Tổng tours',
      value: 24,
      icon: Target,
      color: 'blue' as const,
      type: 'total',
    },
    {
      title: 'Đang hoạt động',
      value: 8,
      icon: CheckCircle,
      color: 'green' as const,
      type: 'active',
    },
    {
      title: 'Bản nháp',
      value: 5,
      icon: FileText,
      color: 'yellow' as const,
      type: 'draft',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData.map((kpi) => (
        <KPICard
          key={kpi.type}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          color={kpi.color}
          loading={loading}
          onClick={() => onCardClick?.(kpi.type)}
        />
      ))}
    </div>
  );
};

export { ToursKPICards };
