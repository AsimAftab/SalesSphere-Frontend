import React from 'react';
import { Eye } from 'lucide-react';
import type { Collection } from '@/api/collectionService';

interface CollectionTableProps {
    collections: Collection[];
    selectedIds: string[];
    onToggleSelection: (id: string) => void;
    onSelectAll: (ids: string[]) => void;
    onViewDetails?: (collection: Collection) => void;
    permissions: {
        canBulkDelete: boolean;
    };
    currentPage: number;
    itemsPerPage: number;
}

export const CollectionTable: React.FC<CollectionTableProps> = ({
    collections,
    selectedIds,
    onToggleSelection,
    onSelectAll,
    onViewDetails,
    permissions,
    currentPage,
    itemsPerPage
}) => {
    const allSelected = collections.length > 0 && collections.every(c => selectedIds.includes(c.id));
    const someSelected = collections.some(c => selectedIds.includes(c.id)) && !allSelected;

    const handleSelectAll = () => {
        if (allSelected) {
            onSelectAll([]);
        } else {
            onSelectAll(collections.map(c => c.id));
        }
    };



    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full border-collapse">
                <thead className="bg-secondary text-white text-sm">
                    <tr>
                        {/* Checkbox Column */}
                        {permissions.canBulkDelete && (
                            <th className="px-5 py-3 text-left w-12">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={input => {
                                        if (input) input.indeterminate = someSelected;
                                    }}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 accent-white cursor-pointer"
                                />
                            </th>
                        )}

                        {/* S.No */}
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                            S.NO.
                        </th>

                        {/* Party Name */}
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                            Party Name
                        </th>

                        {/* Amount Received */}
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                            Amount Received
                        </th>

                        {/* Payment Mode */}
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                            Payment Mode
                        </th>

                        {/* Received Date */}
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                            Received Date
                        </th>

                        {/* Created By */}
                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                            Created By
                        </th>

                        {/* View Details */}

                        <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                            View Details
                        </th>

                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                    {collections.map((collection, index) => {
                        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        const isSelected = selectedIds.includes(collection.id);

                        return (
                            <tr
                                key={collection.id}
                                className={`transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-200'}`}
                            >
                                {/* Checkbox */}
                                {permissions.canBulkDelete && (
                                    <td className="px-5 py-4">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggleSelection(collection.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-secondary cursor-pointer"
                                        />
                                    </td>
                                )}

                                {/* S.No */}
                                <td className="px-5 py-3 text-black text-sm">
                                    {serialNumber}
                                </td>

                                {/* Party Name */}
                                <td className="px-5 py-3 text-black text-sm max-w-[180px]">
                                    {collection.partyName}
                                </td>

                                {/* Amount Received */}
                                <td className="px-5 py-3 text-black text-sm">
                                    Rs. {collection.paidAmount.toLocaleString('en-IN')}
                                </td>

                                {/* Payment Mode - Plain Text */}
                                <td className="px-5 py-3 text-black text-sm">
                                    {collection.paymentMode}
                                </td>

                                {/* Received Date */}
                                <td className="px-5 py-3 text-black text-sm">
                                    {collection.receivedDate}
                                </td>

                                {/* Created By */}
                                <td className="px-5 py-3 text-black text-sm">
                                    {collection.createdBy.name}
                                </td>

                                {/* View Details */}
                                {

                                    <td className="px-5 py-3 text-sm">
                                        <button
                                            onClick={() => onViewDetails?.(collection)}
                                            className="text-blue-500 hover:underline font-black text-sm tracking-tighter flex items-center gap-1"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </td>

                                }
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {
                collections.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No collections found
                    </div>
                )
            }
        </div >
    );
};
