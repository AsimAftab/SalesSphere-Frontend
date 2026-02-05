import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { PageHeaderSkeleton } from '@/components/ui';

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

                {/* Content Grid Skeleton */}
                <div className="flex-1 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 md:px-0">
                        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg flex flex-col items-center text-center h-full"
                            >
                                {/* 1. Profile Circle (h-20 w-20) */}
                                <div className="mb-4 flex-shrink-0">
                                    <Skeleton circle width={80} height={80} />
                                </div>

                                {/* 2. Title Placeholder (Matches text-xl) */}
                                <div className="w-full mb-1 flex justify-center">
                                    <Skeleton
                                        width="75%"
                                        height={24}
                                        containerClassName="w-full"
                                    />
                                </div>

                                {/* 3. Role Placeholder (Matches text-base) */}
                                <div className="w-full mt-2 mb-2 flex justify-center">
                                    <Skeleton
                                        width="55%"
                                        height={18}
                                        containerClassName="w-full"
                                    />
                                </div>

                                {/* 4. Phone number Placeholder (Matches text-xs) */}
                                <div className="w-full flex flex-col items-center gap-1.5 px-2 mt-2">
                                    <div className="w-full flex justify-center">
                                        <Skeleton width="90%" height={12} containerClassName="w-full" />
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default EmployeeSkeleton;
