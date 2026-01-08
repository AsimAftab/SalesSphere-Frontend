import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ExpensesSkeletonProps {
  rows?: number;
  permissions?: {
    canDelete: boolean;
  };
}

export const ExpensesSkeleton: React.FC<ExpensesSkeletonProps> = ({ rows = 10, permissions }) => (
  <div className="w-full flex flex-col p-4 sm:p-0 space-y-8 pb-10">

    {/* 1. HEADER */}
    <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div className="text-left shrink-0">
        <Skeleton width={220} height={30} className="mb-2" />
        <Skeleton width={260} height={12} />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 flex-1 justify-end">
        {/* Search */}
        <div className="w-full lg:w-80">
          <Skeleton height={40} borderRadius={20} />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap justify-end">
          <Skeleton width={42} height={40} borderRadius={8} />
          <Skeleton width={80} height={40} borderRadius={8} />
          <Skeleton width={80} height={40} borderRadius={8} />
          <Skeleton width={150} height={40} borderRadius={8} />
        </div>
      </div>
    </div>

    {/* 2. DESKTOP TABLE (8 columns + checkbox) */}
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full border-collapse">
        <tbody className="divide-y divide-gray-50">
          {Array(rows).fill(0).map((_, i) => (
            <tr key={i} className="h-16">
              {permissions?.canDelete !== false && (
                <td className="px-5 py-4"><Skeleton width={18} height={18} /></td>
              )}
              <td className="px-5 py-4"><Skeleton width={30} height={14} /></td>
              <td className="px-5 py-4"><Skeleton width={140} height={14} /></td>
              <td className="px-5 py-4"><Skeleton width={100} height={14} /></td>
              <td className="px-5 py-4"><Skeleton width={80} height={14} /></td>
              <td className="px-5 py-4"><Skeleton width={160} height={14} /></td>
              <td className="px-5 py-4"><Skeleton width={70} height={22} borderRadius={4} /></td>
              <td className="px-5 py-4"><Skeleton width={90} height={14} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* 3. MOBILE CARDS */}
    <div className="md:hidden w-full space-y-4 pb-10">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          {/* Top */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Skeleton width={20} height={20} borderRadius={4} />
              <Skeleton circle width={40} height={40} />
              <div className="space-y-1">
                <Skeleton width={40} height={8} />
                <Skeleton width={120} height={14} />
              </div>
            </div>
            <Skeleton width={75} height={22} borderRadius={20} />
          </div>

          {/* Middle */}
          <div className="space-y-3 pl-[2.75rem] mb-4">
            {Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Skeleton circle width={14} height={14} />
                <Skeleton width={idx % 2 === 0 ? "65%" : "45%"} height={12} />
              </div>
            ))}
          </div>

          {/* Button */}
          <Skeleton width="100%" height={38} borderRadius={8} />
        </div>
      ))}
    </div>

  </div>
);
