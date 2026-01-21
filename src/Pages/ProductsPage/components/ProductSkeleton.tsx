import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ProductSkeletonProps {
    rows?: number;
    isFilterVisible?: boolean;
    canBulkDelete?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canCreate?: boolean;
    canBulkUpload?: boolean;
    canExport?: boolean;
}

/**
 * ProductSkeleton - Loading skeleton for the Products page.
 * Matches the actual ProductTable layout with header and table structure.
 */
const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
    rows = 10,
    isFilterVisible = false,
    canBulkDelete = false,
    canUpdate = false,
    canDelete = false,
    canCreate = false,
    canBulkUpload = false,
    canExport = false
}) => {
    return (
        <div className="w-full flex flex-col">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-1">
                {/* Title Section */}
                <div className="text-left">
                    <Skeleton width={180} height={32} className="mb-2" />
                    <Skeleton width={240} height={16} />
                </div>

                {/* Actions Wrapper */}
                <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Search Bar */}
                    <Skeleton width={320} height={40} borderRadius={999} />

                    {/* Utility Buttons */}
                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                        <div className="flex gap-3">
                            <Skeleton width={42} height={42} borderRadius={8} /> {/* Filter */}
                            {canExport && (
                                <>
                                    <Skeleton width={84} height={42} borderRadius={8} />
                                    <Skeleton width={84} height={42} borderRadius={8} />
                                </>
                            )}
                            {canBulkUpload && <Skeleton width={100} height={42} borderRadius={8} />}
                        </div>

                        {canCreate && <Skeleton width={150} height={40} borderRadius={8} />}
                    </div>
                </div>
            </div>

            {/* Filter Bar Skeleton */}
            {isFilterVisible && (
                <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <Skeleton height={40} borderRadius={8} />
                    </div>
                </div>
            )}

            {/* Desktop Table Skeleton with Header */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {canBulkDelete && <th className="px-5 py-4 text-left w-12"><Skeleton width={16} height={16} /></th>}
                            <th className="px-5 py-4 text-left"><Skeleton width={30} height={14} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={50} height={14} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={80} height={14} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={120} height={14} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={80} height={14} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={60} height={14} /></th>
                            <th className="px-5 py-4 text-left"><Skeleton width={50} height={14} /></th>
                            {(canUpdate || canDelete) && <th className="px-5 py-4 text-left"><Skeleton width={60} height={14} /></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {Array(rows).fill(0).map((_, i) => (
                            <tr key={i}>
                                {canBulkDelete && <td className="px-5 py-3"><Skeleton width={16} height={16} /></td>}
                                <td className="px-5 py-3"><Skeleton width={30} height={14} /></td>
                                <td className="px-5 py-3"><Skeleton circle width={40} height={40} /></td>
                                <td className="px-5 py-3"><Skeleton width={100} height={14} /></td>
                                <td className="px-5 py-3"><Skeleton width={180} height={14} /></td>
                                <td className="px-5 py-3"><Skeleton width={100} height={14} /></td>
                                <td className="px-5 py-3"><Skeleton width={70} height={14} /></td>
                                <td className="px-5 py-3"><Skeleton width={50} height={14} /></td>
                                {(canUpdate || canDelete) && (
                                    <td className="px-5 py-3">
                                        <div className="flex gap-3">
                                            <Skeleton width={20} height={20} />
                                            <Skeleton width={20} height={20} />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Skeleton */}
            <div className="md:hidden space-y-4 px-0">
                {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <Skeleton width={64} height={64} borderRadius={12} />
                            <div className="flex-1">
                                <Skeleton width="70%" height={16} className="mb-2" />
                                <Skeleton width="40%" height={12} />
                            </div>
                            {canBulkDelete && <Skeleton width={20} height={20} borderRadius={4} />}
                        </div>

                        <div className="border-t border-gray-100 my-2" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Skeleton width={60} height={10} className="mb-1" />
                                <Skeleton width={90} height={14} />
                            </div>
                            <div>
                                <Skeleton width={60} height={10} className="mb-1" />
                                <Skeleton width={70} height={14} />
                            </div>
                        </div>

                        {/* Actions */}
                        {(canUpdate || canDelete) && (
                            <div className="flex justify-end gap-6 pt-2">
                                <Skeleton width={50} height={14} />
                                <Skeleton width={50} height={14} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSkeleton;