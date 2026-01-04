import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PartyDetailsSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="space-y-6">
        
        {/* 1. Header Skeleton (Back, Title, Actions) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={180} height={32} />
          </div>
          <div className="flex gap-4">
            <Skeleton width={140} height={42} borderRadius={8} />
            <Skeleton width={140} height={42} borderRadius={8} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Identity & Info */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            
            {/* 2. Main Identity Card Skeleton (Block 1) */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-start gap-6">
              <Skeleton width={96} height={96} borderRadius={12} className="flex-shrink-0" />
              <div className="flex-1 pt-2">
                <Skeleton width="50%" height={28} className="mb-3" />
                <Skeleton width="70%" height={18} />
              </div>
            </div>

            {/* 3. General Information Grid Skeleton (Block 2) */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex-1">
              <div className="flex items-center gap-2 mb-6">
                 <Skeleton width={32} height={32} borderRadius={8} /> {/* Icon Box */}
                 <Skeleton width={150} height={24} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton width={20} height={20} className="mt-1" />
                    <div className="flex-1">
                      <Skeleton width={60} height={12} className="mb-2" />
                      <Skeleton width="80%" height={16} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Description Placeholder */}
              <div className="border-t border-gray-100 pt-4 mt-6">
                 <Skeleton width={100} height={14} className="mb-2" />
                 <Skeleton count={2} width="100%" height={12} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stats & Map */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* 4. Total Orders Stat Card Skeleton (Block 3) */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex justify-between items-center min-h-[128px]">
               <div className="space-y-2">
                  <Skeleton width={100} height={24} />
                  <Skeleton width={80} height={14} />
               </div>
               <div className="flex items-center gap-3">
                  <Skeleton width={40} height={40} />
                  <Skeleton width={44} height={44} borderRadius={12} />
               </div>
            </div>

            {/* 5. Map Block Skeleton (Block 4) */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col flex-1">
               <div className="p-4 border-b border-gray-100">
                  <Skeleton width={120} height={20} />
               </div>
               <div className="flex-1 min-h-[250px] relative">
                  <Skeleton height="100%" containerClassName="h-full block" />
               </div>
               <div className="p-4 bg-gray-50 border-t">
                  <Skeleton height={40} width="100%" borderRadius={8} />
               </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Orders Table */}
          <div className="lg:col-span-3 mt-2">
            {/* 6. Orders Table Skeleton (Block 5) */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
               {/* Deep Blue Header Placeholder */}
               <div className="bg-secondary p-4">
                  <Skeleton width="100%" height={24} baseColor="#1e3a8a" highlightColor="#2563eb" />
               </div>
               <div className="p-0">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-gray-100 p-4">
                       <Skeleton width="100%" height={24} />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default PartyDetailsSkeleton;