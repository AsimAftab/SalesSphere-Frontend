import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
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

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
    rows = 10,
    isFilterVisible = false,
    canBulkDelete = false, // Though bulk delete button is dynamic, we keep prop for consistency if needed
    canUpdate = false,
    canDelete = false,
    canCreate = false,
    canBulkUpload = false,
    canExport = false
}) => {
    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div className="w-full flex flex-col">

                {/* Header Skeleton: Mirrors your Row 1 & Row 2 layout */}
                <div className="flex flex-col gap-0 mb-8 px-1">
                    {/* Row 1: Title and Discovery Controls */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <Skeleton width={160} height={36} />
                        <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full">
                            <Skeleton height={40} width={280} borderRadius={999} /> {/* Search bar */}
                            <div className="flex items-center gap-6">
                                <Skeleton height={40} width={40} borderRadius={8} /> {/* Filter icon */}
                                {canExport && <Skeleton height={40} width={80} borderRadius={8} />} {/* Export icon */}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Add Buttons Row - Right Aligned */}
                    <div className="flex flex-row items-center justify-end gap-6 w-full border-t border-gray-100 mt-4 pt-4">
                        {/* Bulk Delete button is dynamic (hidden by default), so usually no skeleton needed for initial load. 
                             But if we really wanted it, we'd check canBulkDelete. 
                             However, standard initial load doesn't show it. Removing placeholder to match "no selection" state. */}

                        {canBulkUpload && <Skeleton height={40} width={140} borderRadius={8} />} {/* Bulk Upload */}
                        {canCreate && <Skeleton height={40} width={160} borderRadius={8} />} {/* Add Product */}
                    </div>
                </div>

                {/* 2. Filter Bar Skeleton */}
                {isFilterVisible && (
                    <div className="mb-6 px-4 sm:px-0 flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <Skeleton height={40} borderRadius={8} />
                        </div>
                    </div>
                )}


                {/* 3. Desktop Table Skeleton */}
                <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mx-1">
                    <table className="w-full">
                        <tbody className="divide-y divide-gray-50">
                            {Array(rows).fill(0).map((_, i) => (
                                <tr key={i} className="h-16">
                                    {canBulkDelete && (
                                        <td className="px-5 py-3"><Skeleton width={20} height={20} /></td> /* Selection */
                                    )}
                                    <td className="px-5 py-3"><Skeleton width={20} height={20} /></td> {/* S.No */}
                                    <td className="px-5 py-3"><Skeleton circle width={40} height={40} /></td> {/* Image */}
                                    <td className="px-5 py-3"><Skeleton width={100} height={16} /></td> {/* Serial No. */}
                                    <td className="px-5 py-3"><Skeleton width={200} height={16} /></td> {/* Product Name */}
                                    <td className="px-5 py-3"><Skeleton width={120} height={16} /></td> {/* Category */}
                                    <td className="px-5 py-3"><Skeleton width={80} height={16} /></td>  {/* Price */}
                                    <td className="px-5 py-3"><Skeleton width={60} height={16} /></td>  {/* Stock */}
                                    {(canUpdate || canDelete) && (
                                        <td className="px-5 py-3">
                                            <div className="flex gap-3">
                                                <Skeleton width={20} height={20} />
                                                <Skeleton width={20} height={20} />
                                            </div>
                                        </td> /* Actions */
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. Mobile Card Skeleton */}
                <div className="md:hidden space-y-4 px-1">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton width={64} height={64} borderRadius={12} />
                                <div className="flex-1">
                                    <Skeleton width="70%" height={16} className="mb-2" />
                                    <Skeleton width="40%" height={12} />
                                </div>
                                {canBulkDelete && <Skeleton width={20} height={20} borderRadius={4} />}
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50">
                                <Skeleton height={30} />
                                <Skeleton height={30} />
                            </div>
                            {(canUpdate || canDelete) && (
                                <div className="flex justify-end gap-6 pt-1">
                                    <Skeleton width={50} height={15} />
                                    <Skeleton width={50} height={15} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </SkeletonTheme>
    );
};

export default ProductSkeleton;
