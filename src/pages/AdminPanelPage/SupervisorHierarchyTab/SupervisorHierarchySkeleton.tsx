import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/** Skeleton for a single table row */
const TableRowSkeleton: React.FC = () => (
    <tr className="border-b border-gray-100">
        {/* S.No */}
        <td className="px-5 py-3.5">
            <Skeleton width={20} height={14} />
        </td>
        {/* Employee Name */}
        <td className="px-5 py-3.5">
            <Skeleton width={130} height={14} />
        </td>
        {/* Employee Role */}
        <td className="px-5 py-3.5">
            <Skeleton width={90} height={14} />
        </td>
        {/* Employee Supervisor */}
        <td className="px-5 py-3.5">
            <Skeleton width={120} height={14} />
        </td>
        {/* Supervisor Role */}
        <td className="px-5 py-3.5">
            <Skeleton width={90} height={14} />
        </td>
        {/* View Details */}
        <td className="px-5 py-3.5">
            <Skeleton width={80} height={14} />
        </td>
        {/* Actions */}
        <td className="px-5 py-3.5">
            <div className="flex gap-2">
                <Skeleton width={28} height={28} borderRadius={6} />
                <Skeleton width={28} height={28} borderRadius={6} />
            </div>
        </td>
    </tr>
);

/** Skeleton for the table */
const TableSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead className="bg-secondary text-white text-sm">
                    <tr>
                        <th className="px-5 py-3 text-left font-semibold">
                            <Skeleton width={40} height={14} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.3)" />
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                            <Skeleton width={110} height={14} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.3)" />
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                            <Skeleton width={100} height={14} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.3)" />
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                            <Skeleton width={130} height={14} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.3)" />
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                            <Skeleton width={110} height={14} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.3)" />
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                            <Skeleton width={80} height={14} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.3)" />
                        </th>
                        <th className="px-5 py-3 text-left font-semibold">
                            <Skeleton width={50} height={14} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.3)" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array(10).fill(0).map((_, i) => (
                        <TableRowSkeleton key={i} />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

/** Complete Supervisor Hierarchy Tab Skeleton */
const SupervisorHierarchySkeleton: React.FC = () => (
    <>
        {/* Page Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <div>
                <Skeleton width={260} height={30} className="mb-1" />
                <Skeleton width={320} height={14} />
            </div>
            <Skeleton width={150} height={38} borderRadius={8} />
        </div>

        {/* Table Skeleton */}
        <div className="flex flex-col h-full px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6 overflow-hidden">
            <TableSkeleton />
        </div>
    </>
);

export default SupervisorHierarchySkeleton;
