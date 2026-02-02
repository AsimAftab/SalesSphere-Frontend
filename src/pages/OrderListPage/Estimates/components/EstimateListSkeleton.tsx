import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface EstimateListSkeletonProps {
    canDelete?: boolean;
    canBulkDelete?: boolean;
    canCreate?: boolean;
    canExportPdf?: boolean;
}

/**
 * EstimateListSkeleton - Permission-aware skeleton that matches the actual table structure
 * Shows/hides columns based on user permissions to avoid visual jump when data loads
 */
const EstimateListSkeleton: React.FC<EstimateListSkeletonProps> = ({
    canDelete = true,
    canBulkDelete = true,
    canCreate = true,
    canExportPdf = true
}) => (
    <div className="flex-1 flex flex-col">
        {/* Header Section - Matches EstimateListHeader */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
            {/* Title */}
            <Skeleton width={160} height={36} borderRadius={4} />

            {/* Actions Wrapper */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                {/* Search Bar */}
                <Skeleton height={40} width={280} borderRadius={999} />

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <Skeleton height={40} width={40} borderRadius={8} />
                        {canExportPdf && <Skeleton height={40} width={84} borderRadius={8} />}
                    </div>
                </div>

                {/* Create Button */}
                {canCreate && <Skeleton height={40} width={130} borderRadius={8} />}
            </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full border-collapse">
                {/* Table Header */}
                <thead className="text-xs">
                    <tr>
                        {/* Checkbox column - Only if user has bulkDelete permission */}
                        {canBulkDelete && <th className="px-5 py-3 text-left"><Skeleton width={18} height={18} borderRadius={4} /></th>}
                        <th className="px-5 py-3 text-left"><Skeleton width={40} height={14} /></th>
                        <th className="px-5 py-3 text-left"><Skeleton width={100} height={14} /></th>
                        <th className="px-5 py-3 text-left"><Skeleton width={80} height={14} /></th>
                        <th className="px-5 py-3 text-left"><Skeleton width={70} height={14} /></th>
                        <th className="px-5 py-3 text-left"><Skeleton width={80} height={14} /></th>
                        <th className="px-5 py-3 text-left"><Skeleton width={50} height={14} /></th>
                        {/* Action column - Only if user has delete permission */}
                        {canDelete && <th className="px-5 py-3 text-left"><Skeleton width={45} height={14} /></th>}
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                    {[...Array(10)].map((_, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            {canBulkDelete && <td className="px-5 py-3"><Skeleton width={18} height={18} borderRadius={4} /></td>}
                            <td className="px-5 py-3"><Skeleton width={20} height={16} /></td>
                            <td className="px-5 py-3"><Skeleton width={90} height={16} /></td>
                            <td className="px-5 py-3"><Skeleton width={100} height={16} /></td>
                            <td className="px-5 py-3"><Skeleton width={70} height={16} /></td>
                            <td className="px-5 py-3"><Skeleton width={65} height={16} /></td>
                            <td className="px-5 py-4"><Skeleton width={70} height={16} /></td>
                            {canDelete && <td className="px-5 py-3"><Skeleton width={24} height={24} borderRadius={999} /></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 px-1">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                            {canBulkDelete && <Skeleton width={18} height={18} borderRadius={4} />}
                            <div>
                                <Skeleton width={80} height={10} className="mb-1" />
                                <Skeleton width={120} height={16} />
                            </div>
                        </div>
                        {canDelete && <Skeleton width={24} height={24} borderRadius={999} />}
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
                        <div>
                            <Skeleton width={60} height={10} className="mb-1" />
                            <Skeleton width={100} height={14} />
                        </div>
                        <div>
                            <Skeleton width={60} height={10} className="mb-1" />
                            <Skeleton width={80} height={14} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default EstimateListSkeleton;