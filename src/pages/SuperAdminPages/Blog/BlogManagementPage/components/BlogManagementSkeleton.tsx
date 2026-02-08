import React from 'react';
import { PageHeaderSkeleton, TableSkeleton, MobileCardSkeleton } from '@/components/ui';

const BlogManagementSkeleton: React.FC = () => (
  <div className="space-y-0">
    <PageHeaderSkeleton
      titleWidth={200}
      subtitleWidth={280}
      showSearch={false}
      showFilter={false}
      showExportPdf={false}
      showExportExcel={false}
      showCreate={true}
      createWidth={120}
    />

    {/* Desktop Table */}
    <TableSkeleton
      rows={6}
      columns={[
        { width: 200, type: 'text' },
        { width: 70, type: 'badge' },
        { width: 100, type: 'text' },
        { width: 90, type: 'text' },
        { width: 80, type: 'actions' },
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
        badgeCount: 1,
      }}
      showOnlyMobile={true}
    />
  </div>
);

export default BlogManagementSkeleton;
