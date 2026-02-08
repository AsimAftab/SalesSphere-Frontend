import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CustomFieldsTabSkeleton: React.FC = () => {
  return (
    <>
      {/* Page Header Skeleton */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <Skeleton width={200} height={28} />
        <Skeleton width={320} height={16} className="mt-1" />
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden bg-gray-100 px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6">
        {/* Left Sidebar Skeleton - hidden on mobile */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Sidebar Header */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Skeleton width={36} height={36} borderRadius={8} />
                <div>
                  <Skeleton width={100} height={18} />
                  <Skeleton width={150} height={14} className="mt-1" />
                </div>
              </div>
            </div>
            {/* Sidebar Items */}
            <div className="py-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <Skeleton width={28} height={28} borderRadius={6} />
                  <Skeleton width={110 + Math.random() * 30} height={16} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile DropDown Skeleton */}
        <div className="lg:hidden">
          <Skeleton height={46} borderRadius={12} />
        </div>

        {/* Right Panel Skeleton */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Skeleton width={36} height={36} borderRadius={8} className="hidden sm:block" />
              <div>
                <Skeleton width={160} height={18} />
                <Skeleton width={220} height={14} className="mt-1" />
              </div>
            </div>
            <Skeleton width={70} height={28} borderRadius={14} />
          </div>

          {/* Search Bar */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center gap-3">
            <Skeleton height={40} borderRadius={20} containerClassName="flex-1" />
            <Skeleton width={90} height={40} borderRadius={20} />
          </div>

          {/* Table Rows */}
          <div className="flex-1">
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-4 sm:px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton width={20} height={16} />
                    <Skeleton width={140 + Math.random() * 80} height={16} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton width={20} height={20} />
                    <Skeleton width={20} height={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomFieldsTabSkeleton;
