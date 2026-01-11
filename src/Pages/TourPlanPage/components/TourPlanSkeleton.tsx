import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { type TourPlanPermissions } from './useTourManager';

interface TourPlanSkeletonProps {
  rows?: number;
  isFilterVisible?: boolean;
  permissions?: TourPlanPermissions;
}

const TourPlanSkeleton: React.FC<TourPlanSkeletonProps> = ({
  rows = 10,
  isFilterVisible = false,
  permissions = { canCreate: true, canUpdate: true, canDelete: true, canBulkDelete: true, canApprove: true, canExportPdf: true, canExportExcel: true }
}) => {
  const hasExport = permissions.canExportPdf || permissions.canExportExcel;
  const canBulkDelete = permissions.canBulkDelete;

  return (
    <div className="w-full flex flex-col">
      {/* 1. Header Skeleton */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-4 sm:px-0">
        <div className="text-left shrink-0">
          <Skeleton width={180} height={32} className="mb-2" />
          <Skeleton width={240} height={16} />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
          {/* Search Bar Skeleton */}
          <div className="w-full lg:w-72 xl:w-80">
            <Skeleton height={44} borderRadius={22} />
          </div>
          {/* Utilities Row Skeleton */}
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            <div className="flex gap-3">
              <Skeleton width={42} height={42} borderRadius={8} />
              {hasExport && <Skeleton width={80} height={42} borderRadius={8} />}
            </div>
            {canBulkDelete && <Skeleton width={100} height={40} borderRadius={8} />}
          </div>
          {/* Create Button Skeleton - Only if canCreate */}
          {permissions.canCreate && (
            <div className="w-full lg:w-auto">
              <Skeleton width="100%" height={44} borderRadius={8} className="lg:w-32" />
            </div>
          )}
        </div>
      </div>

      {/* 2. Filter Bar Skeleton */}
      {isFilterVisible && (
        <div className="mb-6 px-4 sm:px-0 flex flex-wrap gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex-1 min-w-[140px]">
              <Skeleton height={40} borderRadius={8} />
            </div>
          ))}
        </div>
      )}

      {/* 3. Desktop Table Skeleton */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {canBulkDelete && (
                <th className="px-5 py-3 text-left font-semibold"><Skeleton width={20} /></th>
              )}
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap"><Skeleton width={40} /></th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap"><Skeleton width={100} /></th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap"><Skeleton width={80} /></th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap"><Skeleton width={80} /></th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap"><Skeleton width={40} /></th>
              <th className="px-5 py-4 text-left font-semibold whitespace-nowrap"><Skeleton width={100} /></th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap"><Skeleton width={60} /></th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap"><Skeleton width={80} /></th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap"><Skeleton width={60} /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array(rows).fill(0).map((_, i) => (
              <tr key={i} className="h-16">
                {canBulkDelete && (
                  <td className="px-5 py-4"><Skeleton width={20} height={20} /></td>
                )}
                {/* 1. S.NO. */}
                <td className="px-5 py-4"><Skeleton width={30} height={14} /></td>
                {/* 2. Place of Visit */}
                <td className="px-5 py-4"><Skeleton width={120} height={14} /></td>
                {/* 3. Start Date */}
                <td className="px-5 py-4"><Skeleton width={90} height={14} /></td>
                {/* 4. End Date */}
                <td className="px-5 py-4"><Skeleton width={90} height={14} /></td>
                {/* 5. Days */}
                <td className="px-5 py-4"><Skeleton width={30} height={14} /></td>
                {/* 6. Created By (Avatar + Name) */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={36} height={36} />
                    <div className="flex flex-col gap-1">
                      <Skeleton width={100} height={14} />
                      <Skeleton width={60} height={10} />
                    </div>
                  </div>
                </td>
                {/* 7. Details */}
                <td className="px-5 py-4"><Skeleton width={80} height={14} /></td>
                {/* 8. Reviewer */}
                <td className="px-5 py-4"><Skeleton width={100} height={14} /></td>
                {/* 9. Status */}
                <td className="px-5 py-4"><Skeleton width={70} height={24} borderRadius={20} /></td>
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
                {canBulkDelete && <Skeleton width={20} height={20} borderRadius={4} />}
                <div className="flex flex-col">
                  <Skeleton width={60} height={10} className="mb-1" />
                  <Skeleton width={120} height={14} />
                </div>
              </div>
              <Skeleton width={70} height={24} borderRadius={20} />
            </div>

            <div className="flex flex-col gap-3 mb-4">
              {Array(4).fill(0).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton circle width={14} height={14} />
                  <Skeleton width={150} height={12} />
                </div>
              ))}
            </div>

            <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourPlanSkeleton;