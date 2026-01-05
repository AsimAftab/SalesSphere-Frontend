import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
          
          {/* Left: General Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border p-6 h-full">
              {/* Profile Header */}
              <div className="flex items-center gap-5 mb-10">
                <Skeleton width={64} height={64} borderRadius={16} />
                <div className="space-y-2">
                  <Skeleton width={250} height={28} />
                  <Skeleton width={180} height={16} />
                </div>
              </div>

              {/* Info Grid (Matches DetailItem layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton width={36} height={36} borderRadius={8} />
                    <div className="space-y-1">
                      <Skeleton width={60} height={12} />
                      <Skeleton width={120} height={18} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Section */}
              <div className="mt-10 pt-6 border-t border-gray-100 space-y-2">
                <Skeleton width={100} height={14} />
                <Skeleton count={2} width="100%" height={14} />
              </div>
            </div>
          </div>

          {/* Right: Map Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden h-full flex flex-col min-h-[400px]">
              <div className="p-4 border-b">
                <Skeleton width={120} height={20} />
              </div>
              <div className="flex-1">
                <Skeleton height="100%" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Interests Section Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton circle width={24} height={24} />
            <Skeleton width={180} height={24} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 space-y-3">
                <Skeleton width={80} height={12} />
                <div className="flex gap-2">
                  <Skeleton width={40} height={20} borderRadius={6} />
                  <Skeleton width={50} height={20} borderRadius={6} />
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