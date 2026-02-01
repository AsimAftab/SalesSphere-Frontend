import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const ProspectDetailsSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="flex-1 flex flex-col h-full overflow-hidden space-y-6">

        {/* 1. Header & Actions Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={200} height={32} borderRadius={8} />
          </div>
          <div className="flex gap-3">
            <Skeleton width={140} height={40} borderRadius={8} />
            <Skeleton width={80} height={40} borderRadius={8} />
            <Skeleton width={100} height={40} borderRadius={8} />
          </div>
        </div>

        {/* 2. Main Info & Map Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Main Card + Info Card */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Main Card Skeleton */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <div className="flex items-start gap-6">
                <Skeleton width={80} height={80} borderRadius={12} />
                <div className="flex-1 pt-2">
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="90%" height={20} className="mt-2" />
                </div>
              </div>
            </div>

            {/* Info Card Skeleton */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex-1">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton width={32} height={32} borderRadius={8} />
                <Skeleton width={200} height={24} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={i === 5 ? 'sm:col-span-2' : ''}>
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="70%" height={20} className="mt-1" />
                  </div>
                ))}
              </div>

              {/* Description Section */}
              <div className="border-t border-gray-100 pt-4 mt-6 space-y-2">
                <Skeleton width={100} height={14} />
                <Skeleton count={2} width="100%" height={14} />
              </div>
            </div>
          </div>

          {/* Right: Map Block Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="p-6 pb-0">
                <div className="flex items-center gap-3">
                  <Skeleton width={40} height={40} borderRadius={8} />
                  <Skeleton width={100} height={28} />
                </div>
                <div className="h-px bg-gray-200 -mx-6 my-3" />
              </div>

              {/* Content */}
              <div className="px-6 pb-6 flex-1 flex flex-col space-y-6">
                {/* Map placeholder */}
                <div className="flex-1 min-h-[240px] rounded-xl overflow-hidden">
                  <Skeleton height={480} borderRadius={12} />
                </div>

                {/* Open in Google Maps button */}
                <Skeleton height={48} borderRadius={8} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Interests Section Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Skeleton width={40} height={40} borderRadius={8} />
              <div>
                <Skeleton width={180} height={20} />
                <Skeleton width={280} height={14} className="mt-1" />
              </div>
            </div>
            <Skeleton width={110} height={28} borderRadius={20} />
          </div>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <Skeleton width="70%" height={16} />
                </div>
                {/* Brands */}
                <div className="p-4 space-y-3">
                  <Skeleton width={60} height={14} />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton width={70} height={30} borderRadius={6} />
                    <Skeleton width={55} height={30} borderRadius={6} />
                    <Skeleton width={80} height={30} borderRadius={6} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Image Gallery Section Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton width={150} height={24} />
            <Skeleton width={100} height={40} borderRadius={8} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="aspect-square" borderRadius={12} />
            ))}
          </div>
        </div>

      </div>
    </SkeletonTheme>
  );
};

export default ProspectDetailsSkeleton;
