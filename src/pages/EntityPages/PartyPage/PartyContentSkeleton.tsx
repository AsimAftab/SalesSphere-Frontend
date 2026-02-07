import React from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { PageHeaderSkeleton, ProfileCardGridSkeleton } from '@/components/ui';

interface PartyContentSkeletonProps {
  canCreate?: boolean;
  canImport?: boolean;
  canExport?: boolean;
}

/**
 * PartyContentSkeleton - Uses generic skeleton components for loading state.
 */
const PartyContentSkeleton: React.FC<PartyContentSkeletonProps> = ({
  canCreate = false,
  canImport = false,
  canExport = false,
}) => {
  const ITEMS_PER_PAGE = 12;

  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="flex-1 flex flex-col h-full overflow-hidden px-1 md:px-0">
        {/* Header Skeleton using generic PageHeaderSkeleton */}
        <PageHeaderSkeleton
          titleWidth={160}
          showSearch={true}
          showFilter={true}
          showExportPdf={canExport}
          showExportExcel={canExport}
          showBulkUpload={canImport}
          showCreate={canCreate}
          createWidth={160}
        />

        {/* Grid Skeleton using ProfileCardGridSkeleton */}
        <div className="flex-1 overflow-hidden">
          <ProfileCardGridSkeleton cards={ITEMS_PER_PAGE} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default PartyContentSkeleton;