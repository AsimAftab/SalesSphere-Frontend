import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ============================================================================
// Base Skeleton Building Blocks
// ============================================================================

/** Skeleton for a page header (title + subtitle) */
export interface HeaderSkeletonProps {
  titleWidth?: number;
  subtitleWidth?: number;
  className?: string;
}

export const HeaderTitleSkeleton: React.FC<HeaderSkeletonProps> = ({
  titleWidth = 180,
  subtitleWidth = 240,
  className = '',
}) => (
  <div className={`text-left shrink-0 ${className}`}>
    <Skeleton width={titleWidth} height={32} className="mb-2" />
    <Skeleton width={subtitleWidth} height={16} />
  </div>
);

/** Skeleton for search bar */
export interface SearchSkeletonProps {
  width?: number | string;
  className?: string;
}

export const SearchSkeleton: React.FC<SearchSkeletonProps> = ({
  width = 320,
  className = '',
}) => (
  <div className={className}>
    <Skeleton width={width} height={40} borderRadius={999} />
  </div>
);

/** Skeleton for action buttons */
export interface ActionButtonSkeletonProps {
  showFilter?: boolean;
  showExportPdf?: boolean;
  showExportExcel?: boolean;
  showCreate?: boolean;
  showBulkUpload?: boolean;
  createWidth?: number;
  className?: string;
}

export const ActionButtonsSkeleton: React.FC<ActionButtonSkeletonProps> = ({
  showFilter = true,
  showExportPdf = true,
  showExportExcel = true,
  showCreate = true,
  showBulkUpload = false,
  createWidth = 150,
  className = '',
}) => (
  <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
    {/* Filter button */}
    {showFilter && (
      <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0">
        <Skeleton width="100%" height="100%" borderRadius={8} />
      </div>
    )}

    {/* Export buttons wrapper - matches ExportActions flex space-x-2 */}
    {(showExportPdf || showExportExcel) && (
      <div className="flex space-x-2">
        {/* Export PDF - Shows icon + text on all screens */}
        {showExportPdf && (
          <div className="w-[62px] sm:w-[68px] h-9 sm:h-10 shrink-0">
            <Skeleton width="100%" height="100%" borderRadius={8} />
          </div>
        )}

        {/* Export Excel - Shows icon + text on all screens */}
        {showExportExcel && (
          <div className="w-[70px] sm:w-[76px] h-9 sm:h-10 shrink-0">
            <Skeleton width="100%" height="100%" borderRadius={8} />
          </div>
        )}
      </div>
    )}

    {/* Bulk Upload - Hidden on mobile (shown full-width above), visible on sm+ */}
    {showBulkUpload && (
      <div className="hidden sm:block w-[90px] h-10 shrink-0">
        <Skeleton width="100%" height="100%" borderRadius={8} />
      </div>
    )}

    {/* Create button - hidden on mobile, visible on sm+ */}
    {showCreate && (
      <div className="hidden sm:block shrink-0" style={{ width: createWidth }}>
        <Skeleton width="100%" height={40} borderRadius={8} />
      </div>
    )}
  </div>
);

// ============================================================================
// Page Header Skeleton (Complete)
// ============================================================================

export interface PageHeaderSkeletonProps {
  titleWidth?: number;
  subtitleWidth?: number;
  showSearch?: boolean;
  searchWidth?: number | string;
  showFilter?: boolean;
  showExportPdf?: boolean;
  showExportExcel?: boolean;
  showCreate?: boolean;
  showBulkUpload?: boolean;
  createWidth?: number;
  className?: string;
}

export const PageHeaderSkeleton: React.FC<PageHeaderSkeletonProps> = ({
  titleWidth = 180,
  subtitleWidth = 240,
  showSearch = true,
  showFilter = true,
  showExportPdf = true,
  showExportExcel = true,
  showCreate = true,
  showBulkUpload = false,
  createWidth = 150,
  className = '',
}) => (
  <div className={`w-full mb-4 sm:mb-6 md:mb-8 ${className}`}>
    {/* Main Container - Horizontal on lg+, Vertical on smaller */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 px-1">

      {/* Left: Title Section */}
      <HeaderTitleSkeleton titleWidth={titleWidth} subtitleWidth={subtitleWidth} />

      {/* Right: Actions Section */}
      <div className="flex flex-col gap-3 w-full lg:w-auto">

        {/* Mobile: Search on its own row */}
        {showSearch && (
          <div className="w-full sm:hidden">
            <Skeleton width="100%" height={40} borderRadius={999} />
          </div>
        )}

        {/* Mobile: Create Button full width */}
        {showCreate && (
          <div className="w-full sm:hidden">
            <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
        )}

        {/* Mobile: Bulk Upload Button full width - stacked below Create */}
        {showBulkUpload && (
          <div className="w-full sm:hidden">
            <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
        )}

        {/* All action buttons in one row - visible on sm+ */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search Bar - Hidden on mobile, visible on sm+ */}
          {showSearch && (
            <div className="hidden sm:block">
              <Skeleton width={192} height={40} borderRadius={999} className="md:w-56 lg:w-64" />
            </div>
          )}

          {/* Action Buttons */}
          <ActionButtonsSkeleton
            showFilter={showFilter}
            showExportPdf={showExportPdf}
            showExportExcel={showExportExcel}
            showCreate={showCreate}
            showBulkUpload={showBulkUpload}
            createWidth={createWidth}
          />
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// Table Skeleton
// ============================================================================

export interface TableColumnSkeleton {
  width: number;
  type?: 'text' | 'checkbox' | 'circle' | 'badge' | 'actions';
}

export interface TableSkeletonProps {
  /** Number of rows to show */
  rows?: number;
  /** Column configurations */
  columns: TableColumnSkeleton[];
  /** Whether to show checkbox column */
  showCheckbox?: boolean;
  /** Whether to show serial number column */
  showSerialNumber?: boolean;
  /** Header widths (optional - will use column widths if not provided) */
  headerWidths?: number[];
  /** Additional className */
  className?: string;
  /** Hide on mobile (default: true) */
  hideOnMobile?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 10,
  columns,
  showCheckbox = false,
  showSerialNumber = true,
  headerWidths,
  className = '',
  hideOnMobile = true,
}) => {
  const renderCell = (col: TableColumnSkeleton) => {
    switch (col.type) {
      case 'checkbox':
        return <Skeleton width={16} height={16} />;
      case 'circle':
        return <Skeleton circle width={col.width} height={col.width} />;
      case 'badge':
        return <Skeleton width={col.width} height={22} borderRadius={4} />;
      case 'actions':
        return (
          <div className="flex gap-3">
            <Skeleton width={20} height={20} />
            <Skeleton width={20} height={20} />
          </div>
        );
      default:
        return <Skeleton width={col.width} height={14} />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${hideOnMobile ? 'hidden md:block' : ''} ${className}`}>
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {showCheckbox && (
              <th className="px-5 py-4 text-left w-12">
                <Skeleton width={16} height={16} />
              </th>
            )}
            {showSerialNumber && (
              <th className="px-5 py-4 text-left">
                <Skeleton width={40} height={14} />
              </th>
            )}
            {columns.map((col, i) => (
              <th key={i} className="px-5 py-4 text-left">
                <Skeleton width={headerWidths?.[i] || col.width} height={14} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array(rows).fill(0).map((_, rowIndex) => (
            <tr key={rowIndex} className="h-16">
              {showCheckbox && (
                <td className="px-5 py-3">
                  <Skeleton width={16} height={16} />
                </td>
              )}
              {showSerialNumber && (
                <td className="px-5 py-3">
                  <Skeleton width={30} height={14} />
                </td>
              )}
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-5 py-3">
                  {renderCell(col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// Mobile Card Skeleton
// ============================================================================

export interface MobileCardSkeletonConfig {
  /** Show checkbox */
  showCheckbox?: boolean;
  /** Show avatar/image */
  showAvatar?: boolean;
  /** Avatar size */
  avatarSize?: number;
  /** Number of detail rows (icon + text) */
  detailRows?: number;
  /** Number of grid columns for details */
  detailColumns?: 1 | 2;
  /** Number of full-width detail rows (spans both columns) */
  fullWidthDetailRows?: number;
  /** Show action button */
  showAction?: boolean;
  /** Number of action buttons (default: 1) */
  actionCount?: number;
  /** Show badges */
  showBadge?: boolean;
  /** Number of badges */
  badgeCount?: number;
}

export interface MobileCardSkeletonProps {
  /** Number of cards to show */
  cards?: number;
  /** Card configuration */
  config?: MobileCardSkeletonConfig;
  /** Additional className */
  className?: string;
  /** Show only on mobile (default: true) */
  showOnlyMobile?: boolean;
}

export const MobileCardSkeleton: React.FC<MobileCardSkeletonProps> = ({
  cards = 4,
  config = {},
  className = '',
  showOnlyMobile = true,
}) => {
  const {
    showCheckbox = true,
    showAvatar = false,
    avatarSize = 48,
    detailRows = 4,
    detailColumns = 1,
    fullWidthDetailRows = 0,
    showAction = true,
    actionCount = 1,
    showBadge = true,
    badgeCount = 1,
  } = config;

  // Calculate grid rows (total rows minus fullWidth rows)
  const gridRows = detailColumns === 2 ? Math.max(0, detailRows - fullWidthDetailRows) : detailRows;

  return (
    <div className={`space-y-4 pb-10 ${showOnlyMobile ? 'md:hidden' : ''} ${className}`}>
      {Array(cards).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {showCheckbox && (
                <Skeleton width={20} height={20} borderRadius={4} />
              )}
              {showAvatar && (
                <Skeleton width={avatarSize} height={avatarSize} borderRadius={12} />
              )}
              <div className="space-y-1">
                <Skeleton width={60} height={10} />
                <Skeleton width={120} height={16} />
              </div>
            </div>
            {showBadge && (
              <div className="flex gap-2">
                {Array(badgeCount).fill(0).map((_, idx) => (
                  <Skeleton key={idx} width={75} height={22} borderRadius={20} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 my-2" />

          {/* Details */}
          {detailColumns === 1 ? (
            <div className="space-y-3">
              {Array(detailRows).fill(0).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Skeleton circle width={14} height={14} />
                  <Skeleton width={`${55 + (idx % 3) * 15}%`} height={12} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Full-width rows first (single column, typically at the top) */}
              {fullWidthDetailRows > 0 && Array(fullWidthDetailRows).fill(0).map((_, idx) => (
                <div key={`fw-${idx}`}>
                  <Skeleton width={60} height={10} className="mb-1" />
                  <Skeleton width="85%" height={14} />
                </div>
              ))}
              {/* Grid rows (2 columns) */}
              {gridRows > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {Array(gridRows).fill(0).map((_, idx) => (
                    <div key={idx}>
                      <Skeleton width={60} height={10} className="mb-1" />
                      <Skeleton width={90} height={14} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Button(s) */}
          {showAction && (
            actionCount === 1 ? (
              <Skeleton width="100%" height={38} borderRadius={8} />
            ) : (
              <div className="flex gap-2">
                {Array(actionCount).fill(0).map((_, idx) => (
                  <div key={idx} className="flex-1">
                    <Skeleton width="100%" height={38} borderRadius={8} />
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// Complete Page Skeleton (Header + Table + Mobile Cards)
// ============================================================================

export interface ListPageSkeletonProps {
  /** Header configuration */
  header?: Omit<PageHeaderSkeletonProps, 'className'>;
  /** Table configuration */
  table?: Omit<TableSkeletonProps, 'className' | 'hideOnMobile'>;
  /** Mobile card configuration */
  mobileCards?: Omit<MobileCardSkeletonProps, 'className' | 'showOnlyMobile'>;
  /** Show filter bar */
  showFilterBar?: boolean;
  /** Additional className */
  className?: string;
}

export const ListPageSkeleton: React.FC<ListPageSkeletonProps> = ({
  header = {},
  table,
  mobileCards,
  showFilterBar = false,
  className = '',
}) => {
  // Default table columns if not provided
  const defaultTableColumns: TableColumnSkeleton[] = [
    { width: 120, type: 'text' },
    { width: 100, type: 'text' },
    { width: 80, type: 'text' },
    { width: 100, type: 'text' },
    { width: 70, type: 'badge' },
  ];

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Header */}
      <PageHeaderSkeleton {...header} />

      {/* Filter Bar (Optional) */}
      {showFilterBar && (
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Skeleton height={40} borderRadius={8} />
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <TableSkeleton
        rows={table?.rows || 10}
        columns={table?.columns || defaultTableColumns}
        showCheckbox={table?.showCheckbox ?? true}
        showSerialNumber={table?.showSerialNumber ?? true}
        hideOnMobile
      />

      {/* Mobile Cards */}
      <MobileCardSkeleton
        cards={mobileCards?.cards || 4}
        config={mobileCards?.config}
        showOnlyMobile
      />
    </div>
  );
};

// ============================================================================
// Detail Page Skeleton
// ============================================================================

export interface DetailPageSkeletonProps {
  /** Show back button */
  showBackButton?: boolean;
  /** Number of info cards */
  infoCards?: number;
  /** Number of stat cards */
  statCards?: number;
  /** Show tabs */
  showTabs?: boolean;
  /** Number of tabs */
  tabCount?: number;
  /** Additional className */
  className?: string;
}

export const DetailPageSkeleton: React.FC<DetailPageSkeletonProps> = ({
  showBackButton = true,
  infoCards = 2,
  statCards = 4,
  showTabs = false,
  tabCount = 3,
  className = '',
}) => (
  <div className={`w-full flex flex-col space-y-6 ${className}`}>
    {/* Header with back button */}
    <div className="flex items-center gap-4">
      {showBackButton && <Skeleton width={100} height={36} borderRadius={8} />}
      <div>
        <Skeleton width={200} height={28} className="mb-2" />
        <Skeleton width={150} height={14} />
      </div>
    </div>

    {/* Stat Cards */}
    {statCards > 0 && (
      <div className={`grid grid-cols-2 md:grid-cols-${Math.min(statCards, 4)} gap-4`}>
        {Array(statCards).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <Skeleton width={80} height={12} className="mb-2" />
            <Skeleton width={60} height={24} />
          </div>
        ))}
      </div>
    )}

    {/* Tabs */}
    {showTabs && (
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        {Array(tabCount).fill(0).map((_, i) => (
          <Skeleton key={i} width={80} height={32} borderRadius={4} />
        ))}
      </div>
    )}

    {/* Info Cards */}
    {Array(infoCards).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm space-y-4">
        <Skeleton width={150} height={20} className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, j) => (
            <div key={j}>
              <Skeleton width={80} height={12} className="mb-1" />
              <Skeleton width={120} height={16} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// Dashboard/Card Grid Skeleton
// ============================================================================

export interface CardGridSkeletonProps {
  /** Number of cards */
  cards?: number;
  /** Columns on different breakpoints */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  /** Card height */
  cardHeight?: number;
  /** Additional className */
  className?: string;
}

export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({
  cards = 4,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  cardHeight = 120,
  className = '',
}) => (
  <div className={`grid grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} gap-4 ${className}`}>
    {Array(cards).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm" style={{ minHeight: cardHeight }}>
        <Skeleton width={100} height={14} className="mb-3" />
        <Skeleton width={80} height={28} className="mb-2" />
        <Skeleton width="60%" height={12} />
      </div>
    ))}
  </div>
);

// ============================================================================
// Profile Card Grid Skeleton (for Employee, Party, Prospect, Site pages)
// ============================================================================

export interface ProfileCardGridSkeletonProps {
  /** Number of cards */
  cards?: number;
  /** Additional className */
  className?: string;
}

export const ProfileCardGridSkeleton: React.FC<ProfileCardGridSkeletonProps> = ({
  cards = 12,
  className = '',
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 md:px-0 ${className}`}>
    {Array(cards).fill(0).map((_, i) => (
      <div
        key={i}
        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg flex flex-col items-center text-center h-full"
      >
        {/* Profile Circle */}
        <div className="mb-4 flex-shrink-0">
          <Skeleton circle width={80} height={80} />
        </div>

        {/* Title/Name */}
        <div className="w-full mb-1 flex justify-center">
          <Skeleton
            width="75%"
            height={24}
            containerClassName="w-full flex justify-center"
          />
        </div>

        {/* Role/Owner */}
        <div className="w-full mt-2 mb-2 flex justify-center">
          <Skeleton
            width="55%"
            height={18}
            containerClassName="w-full flex justify-center"
          />
        </div>

        {/* Address/Phone */}
        <div className="w-full flex flex-col items-center gap-1.5 px-2 mt-2">
          <div className="w-full flex justify-center">
            <Skeleton
              width="90%"
              height={12}
              containerClassName="w-full flex justify-center"
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// Form Skeleton
// ============================================================================

export interface FormSkeletonProps {
  /** Number of field rows */
  rows?: number;
  /** Fields per row */
  fieldsPerRow?: 1 | 2;
  /** Show submit button */
  showSubmit?: boolean;
  /** Additional className */
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  rows = 4,
  fieldsPerRow = 2,
  showSubmit = true,
  className = '',
}) => (
  <div className={`space-y-6 ${className}`}>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} className={`grid grid-cols-1 ${fieldsPerRow === 2 ? 'md:grid-cols-2' : ''} gap-6`}>
        {Array(fieldsPerRow).fill(0).map((_, j) => (
          <div key={j}>
            <Skeleton width={100} height={14} className="mb-2" />
            <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
        ))}
      </div>
    ))}
    {showSubmit && (
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Skeleton width={80} height={40} borderRadius={8} />
        <Skeleton width={100} height={40} borderRadius={8} />
      </div>
    )}
  </div>
);

export default {
  HeaderTitleSkeleton,
  SearchSkeleton,
  ActionButtonsSkeleton,
  PageHeaderSkeleton,
  TableSkeleton,
  MobileCardSkeleton,
  ListPageSkeleton,
  DetailPageSkeleton,
  CardGridSkeleton,
  ProfileCardGridSkeleton,
  FormSkeleton,
};
