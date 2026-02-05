import React from 'react';
import { Skeleton, TableSkeleton, type TableColumnSkeleton } from '@/components/ui';

/**
 * OrderDetailsSkeleton
 *
 * NOTE: This component has unique layout requirements that prevent using DetailPageSkeleton:
 * - Invoice-style header with number and status badge
 * - Two-column details grid with organization and party cards
 * - Items table with specific column structure
 * - Three-column footer with creation details, delivery info (yellow bg), and pricing summary
 * - Specific styling for invoice document appearance
 */

/** Card skeleton for organization/party details */
const DetailsCardSkeleton: React.FC<{ titleWidth?: number }> = ({ titleWidth = 180 }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className={`h-5 w-[${titleWidth}px]`} style={{ width: titleWidth }} />
        </div>
        <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-4 w-[120px]" />
                </div>
            ))}
        </div>
    </div>
);

/** Items table columns configuration */
const itemsTableColumns: TableColumnSkeleton[] = [
    { width: 200, type: 'text' },  // Item name
    { width: 50, type: 'text' },   // Qty
    { width: 80, type: 'text' },   // Rate
    { width: 80, type: 'text' },   // Amount
];

const OrderDetailsSkeleton: React.FC = () => {
    return (
        <div className="w-full bg-white md:rounded-xl md:shadow-xl p-6 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between md:items-start pb-4 border-b border-gray-200">
                <div>
                    {/* Invoice Number */}
                    <Skeleton className="h-9 w-[200px] mb-3" />
                    {/* Status Badge */}
                    <Skeleton className="h-7 w-[100px] rounded-full" />
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
                    {/* Action Button */}
                    <Skeleton className="h-10 w-[140px] rounded-md" />
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 my-8">
                {/* Organization Details */}
                <DetailsCardSkeleton titleWidth={180} />
                {/* Party Details */}
                <DetailsCardSkeleton titleWidth={140} />
            </div>

            {/* Items Table */}
            <div className="my-8">
                <TableSkeleton
                    rows={4}
                    columns={itemsTableColumns}
                    showCheckbox={false}
                    showSerialNumber={true}
                    className="border-gray-200"
                    hideOnMobile={false}
                />
            </div>

            {/* Pricing & Creation Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Column 1: Creation Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-5 w-[140px]" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[60%]" />
                    </div>
                </div>

                {/* Column 2: Delivery Details */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-5 w-[140px]" />
                    </div>
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-6 w-[160px]" />
                </div>

                {/* Column 3: Summary Pricing */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-5 w-[100px]" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-[60px]" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-[80px]" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                        <div className="flex justify-between pt-4 border-t">
                            <Skeleton className="h-6 w-[60px]" />
                            <Skeleton className="h-6 w-[100px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsSkeleton;
