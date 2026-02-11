import React from 'react';
import { ListPageSkeleton, type TableColumnSkeleton } from '@/components/ui';
import { type MiscWorkPermissions } from '../hooks/useMiscellaneousManager';

interface MiscellaneouSkeletonProps {
  rows?: number;
  isFilterVisible?: boolean;
  permissions: MiscWorkPermissions; // ADDED: Permission awareness
}

export const MiscellaneouSkeleton: React.FC<MiscellaneouSkeletonProps> = ({
  rows = 10,
  isFilterVisible = false,
  permissions
}) => {
  // Define table columns based on MiscWorkTable structure
  const tableColumns: TableColumnSkeleton[] = [
    { width: 100, type: 'text' },   // Employee name with avatar
    { width: 120, type: 'text' },   // Nature of Work
    { width: 80, type: 'text' },    // Work Date
    { width: 150, type: 'text' },   // Address
    { width: 70, type: 'text' },    // Assigned By
    { width: 60, type: 'text' },    // Images
  ];

  // Add actions column if user can delete
  if (permissions.canDelete) {
    tableColumns.push({ width: 32, type: 'circle' }); // Delete action
  }

  return (
    <ListPageSkeleton
      header={{
        titleWidth: 180,
        subtitleWidth: 240,
        showSearch: true,
        searchWidth: 320,
        showFilter: true,
        showExportPdf: permissions.canExportPdf,
        showExportExcel: permissions.canExportExcel,
        showCreate: false,
      }}
      table={{
        rows,
        columns: tableColumns,
        showCheckbox: permissions.canDelete,
        showSerialNumber: true,
      }}
      mobileCards={{
        cards: 3,
        config: {
          showCheckbox: permissions.canDelete,
          showAvatar: false,
          detailRows: 4,
          detailColumns: 2,
          fullWidthDetailRows: 2,
          showAction: true,
          actionCount: 2,
          showBadge: true,
          badgeCount: 1,
        },
      }}
      showFilterBar={isFilterVisible}
    />
  );
};

export default MiscellaneouSkeleton;
