import React from 'react';
import Skeleton from 'react-loading-skeleton';

export const  MiscellaneouSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <div className="w-full space-y-8 pb-10">
    
    {/* --- 1. HEADER SKELETON (Always Visible) --- */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-4 md:px-1">
      {/* Page Title & Subtitle logic from Misc Page */}
      <div className="space-y-2">
        <Skeleton width={220} height={38} /> {/* Main Title */}
        <div className="hidden md:block">
           <Skeleton width={250} height={16} /> {/* Optional Subtitle */}
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-4 w-full">
        {/* Search Bar placeholder */}
        <div className="relative w-full lg:w-80">
          <Skeleton height={40} borderRadius={20} />
        </div>
        
        {/* Action Buttons (Filter Toggle, PDF, Excel) */}
        <div className="flex items-center gap-3">
          <Skeleton width={42} height={42} borderRadius={8} /> 
          <Skeleton width={80} height={42} borderRadius={8} /> 
          <Skeleton width={80} height={42} borderRadius={8} /> 
        </div>

        {/* Create Button placeholder */}
        <Skeleton width={160} height={42} borderRadius={8} />
      </div>
    </div>

    {/* --- 2. MAIN CONTENT AREA --- */}
    <div className="w-full">
      
      {/* --- DESKTOP VIEW (Table Skeleton) --- */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 h-14 border-b">
            <tr>
              <th className="px-5 w-10"><Skeleton width={18} height={18} /></th>
              {Array(8).fill(0).map((_, i) => (
                <th key={i} className="px-5 text-left"><Skeleton width={70} /></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array(rows).fill(0).map((_, rowIndex) => (
              <tr key={rowIndex} className="h-20">
                <td className="px-5 text-center"><Skeleton width={18} height={18} /></td>
                {/* S.No column */}
                <td className="px-5"><Skeleton width={20} /></td>
                {/* Submitter/Avatar column */}
                <td className="px-5">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={40} height={40} />
                    <div className="flex-1">
                      <Skeleton width={100} height={14} />
                      <Skeleton width={60} height={10} />
                    </div>
                  </div>
                </td>
                {/* Other data columns */}
                {Array(6).fill(0).map((_, colIndex) => (
                  <td key={colIndex} className="px-5">
                    <Skeleton width={colIndex === 3 ? "90%" : "70%"} height={14} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW (Full-Width Card Skeletons) --- */}
      <div className="md:hidden flex flex-col gap-4 w-full">
        {Array(rows).fill(0).map((_, i) => (
          <div key={i} className="w-full p-4 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
            {/* Card Top: Checkbox, Avatar, and Status Badge */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Skeleton width={20} height={20} />
                <Skeleton circle width={48} height={48} />
                <div className="space-y-1">
                  <Skeleton width={50} height={10} /> {/* Submitter label */}
                  <Skeleton width={120} height={14} /> {/* Name */}
                </div>
              </div>
              <Skeleton width={85} height={24} borderRadius={20} /> {/* Status Badge */}
            </div>

            {/* Card Content: Icon Rows (Indented to match layout) */}
            <div className="space-y-3 pl-[3.25rem]">
              {Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Skeleton circle width={15} height={15} /> 
                  <Skeleton width={idx % 2 === 0 ? "75%" : "50%"} height={14} />
                </div>
              ))}
            </div>

            {/* Bottom Button Placeholder */}
            <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
        ))}
      </div>
    </div>
  </div>
);