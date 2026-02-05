import React from 'react';
import { type TourPlanPermissions } from '../hooks/useTourManager';
import { ListPageSkeleton } from '@/components/ui';

interface TourPlanSkeletonProps {
  rows?: number;
  isFilterVisible?: boolean;
  permissions?: TourPlanPermissions;
}

const TourPlanSkeleton: React.FC<TourPlanSkeletonProps> = ({
  rows = 10,
  isFilterVisible = false,
  permissions = { canCreate: true, canUpdate: true, canDelete: true, canBulkDelete: true, canApprove: true, canExportPdf: true, canExportExcel: true }
}) => {
  const hasExport = permissions.canExportPdf || permissions.canExportExcel;
  const canBulkDelete = permissions.canBulkDelete;

  return (
    <ListPageSkeleton
      header={{
        titleWidth: 180,
        subtitleWidth: 240,
        showSearch: true,
        searchWidth: 320,
        showFilter: true,
        showExportPdf: hasExport && permissions.canExportPdf,
        showExportExcel: hasExport && permissions.canExportExcel,
        showCreate: permissions.canCreate,
        createWidth: 150,
      }}
      table={{
        rows,
        showCheckbox: canBulkDelete,
        showSerialNumber: true,
        columns: [
          { width: 120, type: 'text' },  // Place of Visit
          { width: 90, type: 'text' },   // Start Date
          { width: 90, type: 'text' },   // End Date
          { width: 30, type: 'text' },   // Days
          { width: 100, type: 'text' },  // Created By
          { width: 80, type: 'text' },   // Details
          { width: 100, type: 'text' },  // Reviewer
          { width: 70, type: 'badge' },  // Status
        ],
      }}
      mobileCards={{
        cards: 3,
        config: {
          showCheckbox: canBulkDelete,
          showAvatar: false,
          detailRows: 6,
          detailColumns: 2,
          fullWidthDetailRows: 1,
          showAction: true,
          actionCount: 1,
          showBadge: true,
          badgeCount: 1,
        },
      }}
      showFilterBar={isFilterVisible}
    />
  );
};

export default TourPlanSkeleton;
