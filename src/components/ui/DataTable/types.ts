import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export interface TableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Column header label */
  label: string;
  /** Custom render function for cell content */
  render?: (value: unknown, item: T, index: number) => React.ReactNode;
  /** Accessor function or property key to get value from item */
  accessor?: keyof T | ((item: T) => unknown);
  /** Column width class (e.g., 'w-12', 'max-w-[180px]') */
  width?: string;
  /** Whether column is visible (default: true) */
  visible?: boolean;
  /** Additional className for header cell */
  headerClassName?: string;
  /** Additional className for body cell */
  cellClassName?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T> {
  /** Action type for built-in icons */
  type?: 'view' | 'edit' | 'delete' | 'custom';
  /** Custom icon (if type is 'custom') */
  icon?: LucideIcon;
  /** Action label (for accessibility) */
  label?: string;
  /** Alias for label (tooltip title) */
  title?: string;
  /** Click handler */
  onClick: (item: T) => void;
  /** Whether action is visible for this item */
  visible?: boolean | ((item: T) => boolean);
  /** Link URL (if action should be a link) */
  href?: string | ((item: T) => string);
  /** Custom className */
  className?: string;
  /** Show label text alongside icon */
  showLabel?: boolean;
  /** Whether action is disabled */
  disabled?: boolean | ((item: T) => boolean);
}

export interface DataTableProps<T> {
  /** Array of data items to display */
  data: T[];
  /** Column configurations */
  columns: TableColumn<T>[];
  /** Function to get unique ID from item */
  getRowId?: (item: T) => string;
  /** Alias for getRowId */
  keyExtractor?: (item: T) => string;

  // Selection
  /** Whether selection is enabled */
  selectable?: boolean;
  /** Currently selected IDs */
  selectedIds?: string[];
  /** Selection toggle handler */
  onToggleSelection?: (id: string) => void;
  /** Select all handler */
  onSelectAll?: (checked: boolean) => void;

  // Serial Number
  /** Whether to show serial number column */
  showSerialNumber?: boolean;
  /** Starting index for serial numbers (for pagination) */
  startIndex?: number;

  // Actions
  /** Row action buttons */
  actions?: TableAction<T>[];
  /** Actions column label */
  actionsLabel?: string;

  // Loading & Empty States
  /** Whether table is loading */
  loading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom empty component */
  emptyComponent?: React.ReactNode;

  // Styling
  /** Additional className for table wrapper */
  className?: string;
  /** Additional className for table element */
  tableClassName?: string;
  /** Whether to hide on mobile (default: true) */
  hideOnMobile?: boolean;
  /** Row click handler */
  onRowClick?: (item: T) => void;
  /** Custom row className */
  rowClassName?: string | ((item: T, isSelected: boolean) => string);
  /** Function to determine if a row is selectable */
  isRowSelectable?: (item: T) => boolean;
}
