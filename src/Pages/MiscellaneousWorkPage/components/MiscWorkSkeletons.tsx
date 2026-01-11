import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { type MiscWorkPermissions } from './useMiscellaneousManager';

interface MiscellaneouSkeletonProps {
  rows?: number;
  isFilterVisible?: boolean;
  permissions: MiscWorkPermissions; // ADDED: Permission awareness
}

export const MiscellaneouSkeleton: React.FC<MiscellaneouSkeletonProps> = ({
  rows = 10,
  isFilterVisible = false,
  permissions
}) => {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Header Skeleton */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-4 sm:px-0">
        <div className="text-left shrink-0">
          <Skeleton width={180} height={32} className="mb-2" />
          <Skeleton width={240} height={16} />
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
          <div className="w-full lg:w-72 xl:w-80"><Skeleton height={44} borderRadius={22} /></div>
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            <div className="flex gap-3">
              {/* Condition: Only show filter skeleton if user can view filters/content */}
              <Skeleton width={42} height={42} borderRadius={8} />

              {/* Condition: Export buttons only shimmer if permission exists */}
              {permissions.canExportExcel && <Skeleton width={80} height={42} borderRadius={8} />}
              {permissions.canExportPdf && <Skeleton width={80} height={42} borderRadius={8} />}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar Skeleton */}
      {isFilterVisible && (
        <div className="mb-6 px-4 sm:px-0 flex flex-wrap gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex-1 min-w-[140px]"><Skeleton height={40} borderRadius={8} /></div>
          ))}
        </div>
      )}

      {/* 3. Desktop Table Skeleton */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          {/* Header Skeleton - Matches MiscWorkTable structure */}
          <thead className="text-sm border-b border-gray-100">
            <tr>
              {permissions.canDelete && (
                <th className="px-4 py-4 text-center w-12">
                  <Skeleton width={16} height={16} />
                </th>
              )}
              <th className="px-5 py-3 text-left"><Skeleton width={40} height={14} /></th>
              <th className="px-5 py-3 text-left"><Skeleton width={100} height={14} /></th>
              <th className="px-5 py-3 text-left"><Skeleton width={120} height={14} /></th>
              <th className="px-5 py-3 text-left"><Skeleton width={80} height={14} /></th>
              <th className="px-5 py-3 text-left"><Skeleton width={150} height={14} /></th>
              <th className="px-5 py-3 text-left"><Skeleton width={80} height={14} /></th>
              <th className="px-5 py-3 text-left"><Skeleton width={60} height={14} /></th>
              {permissions.canDelete && <th className="px-5 py-3 text-left"><Skeleton width={50} height={14} /></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array(rows).fill(0).map((_, i) => (
              <tr key={i} className="h-16">
                {/* Checkbox & Action Column only if canDelete */}
                {permissions.canDelete && <td className="px-4 py-4 text-center"><Skeleton width={18} height={18} /></td>}

                <td className="px-5 py-3"><Skeleton width={20} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={40} height={40} />
                    <div className="flex flex-col gap-1">
                      <Skeleton width={90} height={12} />
                      <Skeleton width={50} height={10} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3"><Skeleton width={110} height={12} /></td>
                <td className="px-5 py-3"><Skeleton width={80} height={12} /></td>
                <td className="px-5 py-3"><Skeleton width={180} height={12} /></td>
                <td className="px-5 py-3"><Skeleton width={70} height={12} /></td>
                <td className="px-5 py-3"><Skeleton width={60} height={12} /></td>

                {permissions.canDelete && <td className="px-5 py-3 text-center"><Skeleton circle width={32} height={32} /></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Mobile Card Skeleton */}
      <div className="md:hidden w-full space-y-4 pb-10 px-0">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {/* Checkbox only if canDelete */}
                {permissions.canDelete && <Skeleton width={20} height={20} borderRadius={4} />}
                <div className="flex items-center gap-3">
                  <Skeleton circle width={48} height={48} />
                  <div className="flex flex-col">
                    <Skeleton width={80} height={14} className="mb-1" />
                    <Skeleton width={50} height={10} />
                  </div>
                </div>
              </div>
              {/* Delete button only if canDelete */}
              {permissions.canDelete && <Skeleton width={32} height={32} borderRadius={8} />}
            </div>
            <div className="flex flex-col gap-3 mb-6 pl-12">
              {Array(4).fill(0).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton circle width={14} height={14} />
                  <Skeleton width="70%" height={12} />
                </div>
              ))}
            </div>
            <Skeleton width="100%" height={44} borderRadius={8} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiscellaneouSkeleton;