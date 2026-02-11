import React from 'react';

import { type LeavePermissions } from '../hooks/useLeaveManager';
import { ListPageSkeleton, type TableColumnSkeleton } from '@/components/ui';

interface LeaveSkeletonProps {
  rows?: number;
  permissions: LeavePermissions;
  userRole?: string;
}

const LeaveSkeleton: React.FC<LeaveSkeletonProps> = ({
  rows = 10,
  permissions,
  userRole
}) => {
  // Define table columns matching the Leave table structure
  const tableColumns: TableColumnSkeleton[] = [
    { width: 150, type: 'text' },  // Employee
    { width: 100, type: 'text' },  // Category
    { width: 90, type: 'text' },   // Start Date
    { width: 90, type: 'text' },   // End Date
    { width: 30, type: 'text' },   // Days
    { width: 180, type: 'text' },  // Reason
    { width: 100, type: 'text' },  // Reviewer
    { width: 80, type: 'badge' },  // Status
    { width: 50, type: 'actions' }, // Actions
  ];

  return (
    <ListPageSkeleton
      header={{
        titleWidth: 180,
        subtitleWidth: 220,
        showSearch: true,
        searchWidth: 320,
        showFilter: true,
        showExportPdf: permissions.canExportPdf,
        showExportExcel: permissions.canExportExcel,
        showCreate: permissions.canCreate && userRole !== 'admin',
        createWidth: 120,
      }}
      table={{
        rows,
        columns: tableColumns,
        showCheckbox: permissions.canBulkDelete,
        showSerialNumber: true,
      }}
      mobileCards={{
        cards: 4,
        config: {
          showCheckbox: true,
          showAvatar: false,
          detailRows: 6, // 5 normal + 1 full width
          detailColumns: 2,
          fullWidthDetailRows: 1, // Reason
          fullWidthRowsPosition: 'bottom', // Reason is at the bottom
          showAction: true, // Show actions
          actionCount: 2, // Edit & Delete
          actionsLayout: 'row', // Buttons in line
          showBadge: true,
          badgeCount: 1,
        },
      }}
    />
  );
};

export default LeaveSkeleton;
