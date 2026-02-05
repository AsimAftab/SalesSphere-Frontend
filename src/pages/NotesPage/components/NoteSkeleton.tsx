import React from 'react';
import { ListPageSkeleton } from '@/components/ui';

interface NoteSkeletonProps {
  rows?: number;
}

/**
 * NoteSkeleton - Loading skeleton matching the Notes list page layout.
 * Includes header, table with headers, and mobile card layout.
 */
const NoteSkeleton: React.FC<NoteSkeletonProps> = ({ rows = 10 }) => {
  return (
    <ListPageSkeleton
      header={{
        titleWidth: 180,
        subtitleWidth: 240,
        showSearch: true,
        searchWidth: 320,
        showFilter: true,
        showExportPdf: true,
        showExportExcel: true,
        showCreate: true,
        createWidth: 150
      }}
      table={{
        rows,
        columns: [
          { width: 140, type: 'text' },  // Title
          { width: 120, type: 'text' },  // Linked To
          { width: 80, type: 'text' },   // Type
          { width: 180, type: 'text' },  // Note Content Preview
          { width: 80, type: 'text' }    // Created By
        ],
        showCheckbox: true,
        showSerialNumber: true
      }}
      mobileCards={{
        cards: 4,
        config: {
          showCheckbox: true,
          showAvatar: false,
          detailRows: 3,
          detailColumns: 2,
          showAction: true,
          actionCount: 1,
          showBadge: true,
          badgeCount: 1
        }
      }}
    />
  );
};

export default NoteSkeleton;
