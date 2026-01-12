import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SiteContentSkeletonProps {
    canCreate?: boolean;
    canExportPdf?: boolean;
    canExportExcel?: boolean;
}

const SiteContentSkeleton: React.FC<SiteContentSkeletonProps> = ({
    canCreate = true,
    canExportPdf = true,
    canExportExcel = true
}) => {
    const ITEMS_PER_PAGE = 12;

    return (
        <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
            <div className="flex-1 flex flex-col h-full overflow-hidden px-1 md:px-0">
                {/* Header Skeleton */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 flex-shrink-0 px-1">
                    <div className="flex-shrink-0">
                        <Skeleton width={160} height={36} />
                    </div>
                    <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full lg:w-auto">
                        <Skeleton height={40} width={280} borderRadius={999} />
                        <div className="flex flex-row items-center gap-6">
                            <Skeleton width={42} height={42} borderRadius={8} />
                            {canExportPdf && (
                                <Skeleton width={85} height={42} borderRadius={8} />
                            )}
                            {canExportExcel && (
                                <Skeleton width={85} height={42} borderRadius={8} />
                            )}
                        </div>
                        {canCreate && (
                            <Skeleton height={40} width={160} borderRadius={8} />
                        )}
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="flex-1 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 md:px-0">
                        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg flex flex-col items-center text-center h-full"
                            >
                                {/* Avatar */}
                                <div className="mb-4 flex-shrink-0">
                                    <Skeleton circle width={80} height={80} />
                                </div>
                                {/* Title */}
                                <div className="w-full mb-1 flex justify-center">
                                    <Skeleton width="75%" height={24} containerClassName="w-full" />
                                </div>
                                {/* Subtitle */}
                                <div className="w-full mt-2 mb-2 flex justify-center">
                                    <Skeleton width="55%" height={18} containerClassName="w-full" />
                                </div>
                                {/* Address */}
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

export default SiteContentSkeleton;
