import React from 'react';
import { PageHeaderSkeleton, TableSkeleton, MobileCardSkeleton } from '@/components/ui';

const BlogManagementSkeleton: React.FC = () => (
  <div className="space-y-0">
    <PageHeaderSkeleton
      titleWidth={250}
      subtitleWidth={350}
      showSearch={false}
      showFilter={false}
      showExportPdf={false}
      showExportExcel={false}
      showCreate={true}
      createWidth={120}
    />

    {/* Desktop Table */}
    <TableSkeleton
      rows={10}
      columns={[
        { width: 250, type: 'text' }, // Title
        { width: 120, type: 'text' }, // Date
        { width: 150, type: 'text' }, // Author
        { width: 100, type: 'badge' }, // Status
        { width: 80, type: 'badge' },  // Publish (Toggle)
        { width: 100, type: 'actions' }, // Actions
      ]}
      showCheckbox={false}
      showSerialNumber={true}
      hideOnMobile={true}
    />

    {/* Mobile Cards */}
    <MobileCardSkeleton
      cards={3}
      config={{
        showCheckbox: false,
        showAvatar: false,
        detailRows: 3,
        detailColumns: 1,
        showAction: true,
        actionCount: 2,
        showBadge: true,
        badgeCount: 2, // Status + Publish
      }}
      showOnlyMobile={true}
    />
  </div>
);

export default BlogManagementSkeleton;
