import React from 'react';
import Skeleton from 'react-loading-skeleton';

export const ExpensesSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <div className="w-full space-y-8 pb-10">
    
    {/* --- 1. HEADER SKELETON --- */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-4 md:px-1">
      {/* Page Title placeholder */}
      <Skeleton width={220} height={38} /> 

      <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-4 w-full">
        {/* Search Bar placeholder */}
        <div className="relative w-full lg:w-80">
          <Skeleton height={40} borderRadius={20} />
        </div>
        
        {/* Action Buttons (Filter Toggle, PDF, Excel) */}
        <div className="flex items-center gap-3">
          <Skeleton width={42} height={40} borderRadius={8} /> 
          <Skeleton width={80} height={40} borderRadius={8} /> 
          <Skeleton width={80} height={40} borderRadius={8} /> 
        </div>

        {/* Create Button placeholder */}
        <Skeleton width={160} height={40} borderRadius={8} />
      </div>
    </div>

    {/* --- 2. MAIN CONTENT AREA (Filter Bar Skeleton Removed per request) --- */}
    <div className="w-full">
      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 h-12">
            <tr>
              <th className="px-5 w-10"><Skeleton width={18} height={18} /></th>
              {Array(8).fill(0).map((_, i) => (
                <th key={i} className="px-5 text-left"><Skeleton width={70} /></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array(rows).fill(0).map((_, i) => (
              <tr key={i} className="h-16">
                <td className="px-5"><Skeleton width={18} height={18} /></td>
                {Array(8).fill(0).map((_, j) => (
                  <td key={j} className="px-5"><Skeleton width="80%" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW (Full-Width Cards) --- */}
      <div className="md:hidden flex flex-col gap-4 w-full">
        {Array(rows).fill(0).map((_, i) => (
          <div key={i} className="w-full p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            {/* Card Top Row: Avatar and Badge placeholders */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Skeleton width={20} height={20} />
                <Skeleton circle width={40} height={40} />
                <div className="space-y-1">
                  <Skeleton width={40} height={8} />
                  <Skeleton width={110} height={14} />
                </div>
              </div>
              <Skeleton width={75} height={22} borderRadius={20} />
            </div>

            {/* Card Middle Details (Indented to match mobile layout) */}
            <div className="space-y-3 pl-[3.25rem] mb-4">
              {Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Skeleton circle width={14} height={14} /> 
                  <Skeleton width={idx % 2 === 0 ? "60%" : "40%"} height={12} />
                </div>
              ))}
            </div>

            {/* View Details Button placeholder */}
            <Skeleton width="100%" height={38} borderRadius={8} />
          </div>
        ))}
      </div>
    </div>
  </div>
);