import React from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { PageHeaderSkeleton, ProfileCardGridSkeleton } from '@/components/ui';

interface EmployeeSkeletonProps {
    permissions?: {
        canCreate: boolean;
        canExport: boolean;
    };
}

const EmployeeSkeleton: React.FC<EmployeeSkeletonProps> = ({ permissions }) => {
    const ITEMS_PER_PAGE = 12;
    return (
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
            <div className="flex-1 flex flex-col h-full overflow-hidden px-1 md:px-0">

                {/* Header Skeleton */}
                <PageHeaderSkeleton
                    titleWidth={160}
                    showSearch={true}
                    showFilter={false}
                    showExportPdf={permissions?.canExport}
                    showExportExcel={permissions?.canExport}
                    showCreate={permissions?.canCreate}
                    createWidth={160}
                />

                {/* Reusable card-grid skeleton to match entity list pages */}
                <div className="flex-1 overflow-hidden">
                    <ProfileCardGridSkeleton cards={ITEMS_PER_PAGE} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default EmployeeSkeleton;
