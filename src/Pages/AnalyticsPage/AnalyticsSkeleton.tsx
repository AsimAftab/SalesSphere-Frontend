import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { type AnalyticsPermissions } from './useAnalytics';

interface AnalyticsSkeletonProps {
    permissions: AnalyticsPermissions;
}

const AnalyticsSkeleton: React.FC<AnalyticsSkeletonProps> = ({ permissions }) => {
    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div className="flex flex-col h-full w-full">

                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        <Skeleton width={160} height={32} />
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">

                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ height: "55%" }}>

                        <div className="lg:col-span-3 flex flex-col h-full">

                            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                <Skeleton height={22} width={150} className="mb-3" />
                                <Skeleton height={35} borderRadius={8} className="mb-3" />
                                <Skeleton height={35} borderRadius={8} />
                            </div>

                            {permissions.canViewMonthlyOverview && (
                                <div className="flex flex-col gap-6 flex-grow">
                                    <Skeleton height={100} borderRadius={12} />
                                    <Skeleton height={100} borderRadius={12} />
                                </div>
                            )}
                        </div>

                        {permissions.canViewSalesTrend && (
                            <div className="lg:col-span-9 h-full">
                                <Skeleton height={"100%"} borderRadius={12} />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {permissions.canViewCategorySales && (
                            <div className="h-full min-h-[400px]">
                                <Skeleton height={"100%"} borderRadius={12} />
                            </div>
                        )}

                        {permissions.canViewTopProducts && (
                            <div className="h-full min-h-[400px]">
                                <Skeleton height={"100%"} borderRadius={12} />
                            </div>
                        )}

                        {permissions.canViewTopParties && (
                            <div className="h-full min-h-[400px]">
                                <Skeleton height={"100%"} borderRadius={12} />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default AnalyticsSkeleton;