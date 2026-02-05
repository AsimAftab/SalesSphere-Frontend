import React from 'react';
import { Filter, Trash2,type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../Button/Button';
import ExportActions from '../Export/ExportActions';

// Types
export interface PageHeaderPermissions {
  canCreate?: boolean;
  canDelete?: boolean;
  canBulkDelete?: boolean;
  canExportPdf?: boolean;
  canExportExcel?: boolean;
}

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Page subtitle/description */
  subtitle?: string;

  // Search Configuration
  /** Search term value */
  searchTerm?: string;
  /** Search term change handler */
  onSearchChange?: (value: string) => void;
  /** Search placeholder text */
  searchPlaceholder?: string;

  // Filter Configuration
  /** Whether filter panel is visible */
  isFilterVisible?: boolean;
  /** Filter visibility toggle handler */
  onFilterToggle?: () => void;
  /** Whether to show filter button */
  showFilter?: boolean;

  // Export Configuration
  /** PDF export handler */
  onExportPdf?: () => void;
  /** Excel export handler */
  onExportExcel?: () => void;

  // Bulk Delete Configuration
  /** Number of selected items */
  selectedCount?: number;
  /** Bulk delete handler */
  onBulkDelete?: () => void;

  // Create Button Configuration
  /** Create button label */
  createButtonLabel?: string;
  /** Create button handler */
  onCreate?: () => void;
  /** Create button icon */
  createButtonIcon?: LucideIcon;

  // Permissions
  /** Permission flags */
  permissions?: PageHeaderPermissions;

  // Pagination reset
  /** Reset current page when searching */
  onResetPage?: () => void;

  // Custom Actions
  /** Additional custom actions to render */
  customActions?: React.ReactNode;

  // Layout
  /** Additional className for the header container */
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  isFilterVisible = false,
  onFilterToggle,
  showFilter = true,
  onExportPdf,
  onExportExcel,
  selectedCount = 0,
  onBulkDelete,
  createButtonLabel,
  onCreate,
  permissions = {},
  onResetPage,
  customActions,
  className = '',
}) => {
  const {
    canCreate = true,
    canBulkDelete = true,
    canExportPdf = true,
    canExportExcel = true,
  } = permissions;

  const showSearch = onSearchChange !== undefined;
  const showExport = (canExportPdf && onExportPdf) || (canExportExcel && onExportExcel);
  const showBulkDelete = canBulkDelete && selectedCount > 0 && onBulkDelete;
  const showCreateButton = canCreate && onCreate && createButtonLabel;

  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
    onResetPage?.();
  };

  return (
    <div className={`w-full mb-4 sm:mb-6 md:mb-8 ${className}`}>
      {/* Main Container - Horizontal on lg+, Vertical on smaller */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 px-1">

        {/* Left: Title Section */}
        <div className="text-left shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {/* Right: Actions Section */}
        <div className="flex flex-col gap-3 w-full lg:w-auto">

          {/* Mobile: Search on its own row */}
          {showSearch && (
            <div className="w-full sm:hidden">
              <SearchBar
                value={searchTerm || ''}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full"
              />
            </div>
          )}

          {/* Mobile: Create Button full width */}
          {showCreateButton && (
            <div className="w-full sm:hidden">
              <Button
                onClick={onCreate}
                className="h-10 w-full text-sm tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                {createButtonLabel}
              </Button>
            </div>
          )}

          {/* Mobile: Custom Actions (Upload button) full width - stacked below Create */}
          {customActions && (
            <div className="w-full sm:hidden [&>*]:w-full [&>*]:justify-center">
              {customActions}
            </div>
          )}

          {/* All action buttons in one row - visible on sm+ */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Search Bar - Hidden on mobile, visible on sm+ */}
            {showSearch && (
              <div className="hidden sm:block">
                <SearchBar
                  value={searchTerm || ''}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="w-48 md:w-56 lg:w-64 xl:w-72"
                />
              </div>
            )}

            {/* Filter Button */}
            {showFilter && onFilterToggle && (
              <button
                onClick={onFilterToggle}
                className={`p-2 sm:p-2.5 rounded-lg border transition-colors shrink-0 ${
                  isFilterVisible
                    ? 'bg-secondary text-white border-secondary shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
                aria-label="Toggle filters"
                aria-pressed={isFilterVisible}
              >
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}

            {/* Export Actions */}
            {showExport && (
              <ExportActions
                onExportPdf={canExportPdf ? onExportPdf : undefined}
                onExportExcel={canExportExcel ? onExportExcel : undefined}
              />
            )}

            {/* Custom Actions - Hidden on mobile, shown in row on sm+ */}
            {customActions && (
              <div className="hidden sm:flex">
                {customActions}
              </div>
            )}

            {/* Bulk Delete Button */}
            <AnimatePresence>
              {showBulkDelete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center"
                >
                  <Button
                    variant="danger"
                    onClick={onBulkDelete}
                    className="h-9 sm:h-10 px-2 sm:px-3 text-xs flex items-center gap-1.5 font-bold whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete ({selectedCount})</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Create Button - Hidden on mobile, visible on sm+ */}
            {showCreateButton && (
              <Button
                onClick={onCreate}
                className="hidden sm:flex h-9 sm:h-10 px-4 sm:px-6 text-sm tracking-wider items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                {createButtonLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Header variant for detail pages
export interface SimplePageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SimplePageHeader: React.FC<SimplePageHeaderProps> = ({
  title,
  subtitle,
  className = '',
  children,
}) => {
  return (
    <div className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 md:mb-8 px-1 ${className}`}>
      <div className="text-left shrink-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 sm:gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

// Welcome/Dashboard Header variant
export interface WelcomeHeaderProps {
  userName: string;
  customGreeting?: string;
  showDate?: boolean;
  className?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  userName,
  customGreeting,
  showDate = true,
  className = '',
}) => {
  const getGreeting = () => {
    if (customGreeting) return customGreeting;
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const firstName = userName?.split(' ')[0] || 'User';

  return (
    <div className={`text-left mb-4 sm:mb-6 md:mb-8 px-1 ${className}`}>
      <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">
        {getGreeting()}, {firstName}!
      </h1>
      {showDate && (
        <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500">{formatDate()}</p>
      )}
    </div>
  );
};

export default PageHeader;
