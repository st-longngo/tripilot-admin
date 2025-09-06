// types/components.ts - Enhanced Component Props Types

import React from 'react';
import { Tour, Participant, Location, Vehicle } from './api';

// Define a generic Activity interface for schedule
interface ScheduleActivity {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  description: string;
  locationId?: string;
}

// ============== COMMON COMPONENT TYPES ==============

export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
}

export interface ErrorProps {
  error?: string | Error | null;
  onRetry?: () => void;
}

// ============================================================================
// KPI Cards Components
// ============================================================================

export type KPICardColorType = 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';

export interface KPICardData {
  title: string;
  value: number | string;
  iconEmoji: string;
  color: KPICardColorType;
  type: string;
  trendInfo?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
}

export interface KPICardComponentProps extends BaseComponentProps {
  title: string;
  value: number | string;
  iconEmoji: string;
  color: KPICardColorType;
  onClick?: () => void;
  loading?: boolean;
  trendInfo?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
}

export interface ToursKPICardsProps extends BaseComponentProps, LoadingProps {
  onCardClick?: (type: string) => void;
  data?: KPICardData[];
}

// ============================================================================
// Toolbar Components
// ============================================================================

export type ViewMode = 'table' | 'grid' | 'list' | 'kanban';

export interface BulkAction {
  value: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
  confirmMessage?: string;
  disabled?: boolean;
}

export interface ToursToolbarProps extends BaseComponentProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  selectedCount?: number;
  onBulkActions?: (action: string) => void;
  onClearSelection?: () => void;
  onOpenFilters?: () => void;
  bulkActions?: BulkAction[];
  showFilters?: boolean;
  showViewModeToggle?: boolean;
  showBulkActions?: boolean;
}

// ============================================================================
// Filters Components
// ============================================================================

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface ToursFiltersState {
  dateRange: DateRangeFilter;
  destinations: string[];
  categories: string[];
  status: string[];
  priceRange: [number, number];
  capacity: [number, number];
  duration?: [number, number];
  rating?: number;
}

export interface FilterOption {
  value: string;
  label: string;
  color?: string;
  count?: number;
  disabled?: boolean;
}

export interface ToursFiltersProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ToursFiltersState;
  onFiltersChange: (filters: ToursFiltersState) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  destinationOptions?: FilterOption[];
  categoryOptions?: FilterOption[];
  statusOptions?: FilterOption[];
}

// ============================================================================
// Data Table Components

export interface ColumnDef<T> {
  key: keyof T | string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  className?: string;
}

export interface SortingConfig<T> {
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: keyof T, order: 'asc' | 'desc') => void;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface SelectionConfig<T = Record<string, unknown>> {
  selectedKeys: string[];
  onSelectionChange: (keys: string[], records?: T[]) => void;
  multiple?: boolean;
  showSelectAll?: boolean;
  getRowKey?: (record: T) => string;
}

export interface FilterConfig {
  filters: Record<string, string | number | boolean | string[]>;
  onFilterChange: (filters: Record<string, string | number | boolean | string[]>) => void;
  onFilterReset: () => void;
}

export interface DataTableProps<T> extends BaseComponentProps, LoadingProps, ErrorProps {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey?: string | ((record: T) => string);
  
  // Features
  pagination?: PaginationConfig;
  sorting?: SortingConfig<T>;
  selection?: SelectionConfig<T>;
  filtering?: FilterConfig;
  
  // Appearance
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  
  // Behavior
  expandable?: {
    expandedRowRender: (record: T) => React.ReactNode;
    rowExpandable?: (record: T) => boolean;
    expandedRowKeys?: string[];
    onExpandedRowsChange?: (keys: string[]) => void;
  };
  
  // Actions
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  onHeaderRow?: (columns: ColumnDef<T>[], index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  
  // Empty state
  emptyText?: React.ReactNode;
  
  // Virtual scrolling for large datasets
  virtual?: boolean;
  scroll?: {
    x?: string | number;
    y?: string | number;
  };
}

// ============== FORM COMPONENTS ==============

export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  value?: string | number | boolean;
  onChange?: (value: string | number | boolean) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface InputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  step?: number;
  min?: number;
  max?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export interface SelectProps extends FormFieldProps {
  options: Array<{
    label: string;
    value: string | number;
    disabled?: boolean;
    group?: string;
  }>;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  creatable?: boolean;
  loading?: boolean;
  loadingText?: string;
  noOptionsText?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface TextareaProps extends FormFieldProps {
  rows?: number;
  autoResize?: boolean;
  maxRows?: number;
  minRows?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  value?: string | number;
  onChange?: (checked: boolean, value?: string | number) => void;
  size?: 'small' | 'medium' | 'large';
}

export interface RadioProps extends BaseComponentProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  value?: string | number;
  name?: string;
  onChange?: (value: string | number) => void;
  size?: 'small' | 'medium' | 'large';
}

export interface DatePickerProps extends FormFieldProps {
  format?: string;
  showTime?: boolean;
  showToday?: boolean;
  disabledDate?: (date: Date) => boolean;
  disabledTime?: (date: Date) => object;
  locale?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface DateRangePickerProps extends BaseComponentProps {
  label?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  onChange: (range: [Date | null, Date | null]) => void;
  format?: string;
  separator?: string;
  presets?: Array<{
    label: string;
    value: [Date, Date];
  }>;
  disabledDate?: (date: Date) => boolean;
  maxDays?: number;
  size?: 'small' | 'medium' | 'large';
}

// ============== UI COMPONENTS ==============

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  children: React.ReactNode;
  
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  
  // Events
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  
  // HTML attributes
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  tabIndex?: number;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  destroyOnClose?: boolean;
  
  // Content
  children: React.ReactNode;
  footer?: React.ReactNode;
  
  // Styling
  bodyStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  wrapClassName?: string;
  
  // Events
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  closable?: boolean;
  
  // Actions
  action?: {
    label: string;
    onClick: () => void;
  };
  
  // Positioning
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  text?: string;
  overlay?: boolean;
  spinning?: boolean;
  children?: React.ReactNode;
}

export interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  outline?: boolean;
  children: React.ReactNode;
}

export interface TagProps extends BaseComponentProps {
  color?: string;
  closable?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  shape?: 'circle' | 'square';
  fallback?: string;
  loading?: boolean;
}

export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  format?: (value: number, max: number) => string;
  animated?: boolean;
  striped?: boolean;
}

// ============== LAYOUT COMPONENTS ==============

export interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  homeIcon?: React.ReactNode;
}

export interface SidebarProps extends BaseComponentProps {
  collapsed?: boolean;
  onToggle?: () => void;
  width?: number;
  collapsedWidth?: number;
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onBreakpoint?: (broken: boolean) => void;
  theme?: 'light' | 'dark';
  children: React.ReactNode;
}

export interface HeaderProps extends BaseComponentProps {
  fixed?: boolean;
  shadow?: boolean;
  border?: boolean;
  theme?: 'light' | 'dark';
  height?: number;
  children: React.ReactNode;
}

export interface DashboardGridProps extends BaseComponentProps {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  children: React.ReactNode;
}

// ============== BUSINESS COMPONENT TYPES ==============

export interface KPICardProps extends BaseComponentProps, LoadingProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: Array<{ date: string; value: number }>;
  onClick?: () => void;
}

export interface TourCardProps extends BaseComponentProps {
  tour: Tour;
  variant?: 'grid' | 'list' | 'compact';
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (tour: Tour) => void;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (tour: Tour) => void;
    variant?: ButtonProps['variant'];
    disabled?: boolean;
  }>;
  showStatus?: boolean;
  showProgress?: boolean;
  showRating?: boolean;
}

export interface ParticipantSelectorProps extends BaseComponentProps {
  tourId?: string;
  selectedParticipants: string[];
  onSelectionChange: (participantIds: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  showDetails?: boolean;
  filters?: {
    status?: string[];
    nationality?: string[];
    ageRange?: [number, number];
  };
}

export interface TourScheduleBuilderProps extends BaseComponentProps {
  tourId: string;
  schedule: ScheduleActivity[];
  onChange: (schedule: ScheduleActivity[]) => void;
  readonly?: boolean;
  showTimeline?: boolean;
  allowDragDrop?: boolean;
  templateLibrary?: boolean;
}

export interface LocationPickerProps extends BaseComponentProps {
  value?: Location | Location[];
  onChange: (location: Location | Location[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  mapView?: boolean;
  filters?: {
    types?: string[];
    categories?: string[];
    near?: {
      latitude: number;
      longitude: number;
      radius: number; // in km
    };
  };
}

export interface VehicleAssignmentProps extends BaseComponentProps {
  tourId: string;
  vehicles: Vehicle[];
  assignments: Record<string, string>; // activityId -> vehicleId
  onAssignmentChange: (assignments: Record<string, string>) => void;
  showCapacityWarnings?: boolean;
  showRouteOptimization?: boolean;
}

export interface ChatComponentProps extends BaseComponentProps {
  tourId: string;
  chatType?: 'group' | 'private' | 'announcements';
  height?: number;
  allowAttachments?: boolean;
  allowEmoji?: boolean;
  showTypingIndicator?: boolean;
  showOnlineStatus?: boolean;
}

export interface AttendanceTrackerProps extends BaseComponentProps {
  tourId: string;
  activityId?: string;
  participants: Participant[];
  checkInMethods?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number; // seconds
  showMap?: boolean;
  showPhotos?: boolean;
}

// ============== CHART COMPONENTS ==============

export interface ChartBaseProps extends BaseComponentProps, LoadingProps {
  width?: number | string;
  height?: number | string;
  responsive?: boolean;
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  theme?: 'light' | 'dark';
  colors?: string[];
}

export interface LineChartProps extends ChartBaseProps {
  data: Array<{ x: string | number; y: number; series?: string }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  smooth?: boolean;
  stacked?: boolean;
  showDots?: boolean;
  showArea?: boolean;
}

export interface BarChartProps extends ChartBaseProps {
  data: Array<{ x: string; y: number; series?: string }>;
  orientation?: 'vertical' | 'horizontal';
  stacked?: boolean;
  grouped?: boolean;
  showValues?: boolean;
}

export interface PieChartProps extends ChartBaseProps {
  data: Array<{ label: string; value: number; color?: string }>;
  donut?: boolean;
  showLabels?: boolean;
  showPercentages?: boolean;
}

export interface HeatMapProps extends ChartBaseProps {
  data: Array<{ x: string; y: string; value: number }>;
  colorScale?: [string, string];
  showValues?: boolean;
}

// ============== FILTER & SEARCH COMPONENTS ==============

export interface SearchBarProps extends BaseComponentProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  showSuggestions?: boolean;
  debounceMs?: number;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  onSearch?: (value: string) => void;
  clearable?: boolean;
}

export interface FilterPanelProps extends BaseComponentProps {
  filters: Record<string, string | number | boolean | string[]>;
  onChange: (filters: Record<string, string | number | boolean | string[]>) => void;
  onReset: () => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showApplyButton?: boolean;
  showResetButton?: boolean;
  children: React.ReactNode;
}

export interface QuickFilterProps extends BaseComponentProps {
  options: Array<{
    label: string;
    value: string | number;
    count?: number;
    disabled?: boolean;
  }>;
  value?: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  multiple?: boolean;
  showCounts?: boolean;
}
