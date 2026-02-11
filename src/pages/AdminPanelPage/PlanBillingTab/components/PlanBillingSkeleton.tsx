import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const InfoBlockSkeleton: React.FC = () => (
  <div className="flex items-start gap-3">
    <Skeleton width={36} height={36} borderRadius={8} />
    <div>
      <Skeleton width={80} height={10} className="mb-1" />
      <Skeleton width={110} height={14} />
    </div>
  </div>
);

const PlanBillingSkeleton: React.FC = () => (
  <>
    {/* Page Header Skeleton */}
    <div className="px-4 sm:px-6 pt-4 sm:pt-6">
      <Skeleton width={220} height={30} className="mb-1" />
      <Skeleton width={320} height={14} />
    </div>

    <div className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 py-4 sm:py-6 gap-6">
      {/* Sub-tab Navigation Skeleton */}
      <div className="flex gap-2">
        <Skeleton width={100} height={38} borderRadius={8} />
        <Skeleton width={140} height={38} borderRadius={8} />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="rounded-lg bg-white border-2 border-gray-100 shadow-sm p-4 sm:p-6 flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton width={80} height={12} />
              <Skeleton width={100} height={28} />
            </div>
            <Skeleton width={44} height={44} circle />
          </div>
        ))}
      </div>

      {/* Detail Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Details Skeleton - 1 full-width + 4 items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton width={32} height={32} borderRadius={8} />
            <Skeleton width={160} height={20} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="sm:col-span-2">
              <InfoBlockSkeleton />
            </div>
            {Array(4).fill(0).map((_, i) => (
              <InfoBlockSkeleton key={i} />
            ))}
            <div className="sm:col-span-2">
              <InfoBlockSkeleton />
            </div>
          </div>
        </div>

        {/* Account Settings Skeleton - 8 items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton width={32} height={32} borderRadius={8} />
            <Skeleton width={140} height={20} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {Array(8).fill(0).map((_, i) => (
              <InfoBlockSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export default PlanBillingSkeleton;
