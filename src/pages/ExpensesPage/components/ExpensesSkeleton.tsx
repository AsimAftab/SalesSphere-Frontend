import React from 'react';
import { ListPageSkeleton } from '@/components/ui';

interface ExpensesSkeletonProps {
  rows?: number;
  permissions?: {
    canDelete: boolean;
    canViewDetail: boolean;
    canCreate: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
  };
}

export const ExpensesSkeleton: React.FC<ExpensesSkeletonProps> = ({ rows = 10, permissions }) => (
  <div className="w-full flex flex-col p-4 sm:p-0 space-y-8 pb-10">
    <ListPageSkeleton
      header={{
        titleWidth: 220,
        subtitleWidth: 260,
        showSearch: true,
        searchWidth: 320,
        showFilter: true,
        showExportPdf: permissions?.canExportPdf !== false,
        showExportExcel: permissions?.canExportExcel !== false,
        showCreate: permissions?.canCreate !== false,
        createWidth: 150,
      }}
      table={{
        rows: rows,
        showCheckbox: permissions?.canDelete !== false,
        showSerialNumber: true,
        columns: [
          { width: 140, type: 'text' },   // Title
          { width: 100, type: 'text' },   // Amount
          { width: 90, type: 'text' },    // Date
          { width: 110, type: 'text' },   // Category
          { width: 120, type: 'text' },   // Submitter
          ...(permissions?.canViewDetail !== false ? [{ width: 100, type: 'text' as const }] : []), // Reviewer
          { width: 110, type: 'text' },   // Approved By
          { width: 70, type: 'badge' as const },    // Status
        ],
      }}
      mobileCards={{
        cards: 3,
        config: {
          showCheckbox: permissions?.canDelete !== false,
          showAvatar: false,
          detailRows: 5,
          detailColumns: 2,
          fullWidthDetailRows: 1,
          showAction: true,
          actionCount: 1,
          showBadge: true,
          badgeCount: 1,
        },
      }}
    />
  </div>
);
