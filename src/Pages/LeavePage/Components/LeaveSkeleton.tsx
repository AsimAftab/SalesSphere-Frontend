import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LeaveSkeletonProps {
  rows?: number;
  isFilterVisible?: boolean;
}

const LeaveSkeleton: React.FC<LeaveSkeletonProps> = ({ 
  rows = 10, 
  isFilterVisible = false 
}) => {
  return (
    <div className="w-full flex flex-col">
      {/* Header Skeleton */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="text-left">
          <Skeleton width={200} height={32} className="mb-2" />
          <Skeleton width={250} height={16} />
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
          <Skeleton width={300} height={44} borderRadius={22} />
          <div className="flex gap-3">
            <Skeleton width={42} height={42} borderRadius={8} />
            <Skeleton width={100} height={42} borderRadius={8} />
          </div>
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      {isFilterVisible && (
        <div className="mb-6 flex flex-wrap gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex-1 min-w-[140px]">
              <Skeleton height={40} borderRadius={8} />
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <tbody className="divide-y divide-gray-50">
            {Array(rows).fill(0).map((_, i) => (
              <tr key={i} className="h-16">
                <td className="px-5 py-4"><Skeleton width={20} height={20} /></td>
                <td className="px-5 py-4"><Skeleton width={150} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={100} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={120} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={40} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={80} height={24} borderRadius={20} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-4 px-0">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between mb-4">
              <Skeleton width={100} height={20} />
              <Skeleton width={70} height={24} borderRadius={20} />
            </div>
            <Skeleton count={3} className="mb-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveSkeleton;