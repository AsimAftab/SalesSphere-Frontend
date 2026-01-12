import React from 'react';
import type { Collection } from '../../../api/collectionService';

interface CollectionMobileListProps {
    collections: Collection[];
    selectedIds: string[];
    onToggleSelection: (id: string) => void;
    onViewDetails?: (collection: Collection) => void;
    permissions: {
        canBulkDelete: boolean;
        canViewDetail: boolean;
    };
    currentPage: number;
    itemsPerPage: number;
}

export const CollectionMobileList: React.FC<CollectionMobileListProps> = ({
    collections,
    selectedIds,
    onToggleSelection,
    onViewDetails,
    permissions,
    itemsPerPage,
    currentPage
}) => {
    const formatCurrency = (amount: number) => {
        return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Helper to determine payment mode badge appearance
    const getPaymentModeConfig = (mode: string) => {
        switch (mode) {
            case 'Cash': return { label: 'Cash', className: 'bg-green-100 text-green-700' };
            case 'Cheque': return { label: 'Cheque', className: 'bg-blue-100 text-blue-700' };
            case 'Bank Transfer': return { label: 'Bank Transfer', className: 'bg-purple-100 text-purple-700' };
            case 'QR Pay': return { label: 'QR Pay', className: 'bg-indigo-100 text-indigo-700' };
            default: return { label: mode, className: 'bg-gray-100 text-gray-700' };
        }
    };

    return (
        <div className="space-y-4">
            {collections.map((collection, index) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                const isSelected = selectedIds.includes(collection.id);
                const paymentModeConfig = getPaymentModeConfig(collection.paymentMode);

                return (
                    <div
                        key={collection.id}
                        className={`bg-white rounded-xl shadow-sm border transition-all overflow-hidden ${isSelected ? 'border-secondary' : 'border-gray-200'
                            }`}
                    >
                        <div className="p-4 space-y-3">
                            {/* Header: Checkbox + Serial # + Party Name + Payment Mode Badge */}
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3 items-start">
                                    {permissions.canBulkDelete && (
                                        <div className="pt-1">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onToggleSelection(collection.id)}
                                                className="w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary cursor-pointer"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-gray-500 text-xs text-left">#{serialNumber}</div>
                                        <h3 className="font-bold text-gray-900 text-base">{collection.partyName}</h3>
                                    </div>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${paymentModeConfig.className}`}>
                                    {paymentModeConfig.label}
                                </span>
                            </div>

                            {/* Amount */}
                            <div className="text-2xl font-bold text-gray-900 pt-1">
                                {formatCurrency(collection.paidAmount)}
                            </div>

                            {/* Grid: Received Date & Created By */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <div className="text-gray-500 text-xs mb-1">Received Date</div>
                                    <div className="font-semibold text-gray-900">{formatDate(collection.receivedDate)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-xs mb-1">Created By</div>
                                    <div className="font-semibold text-gray-900">{collection.createdBy.name}</div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Button: Full width, light blue */}
                        {permissions.canViewDetail && (
                            <button
                                onClick={() => onViewDetails?.(collection)}
                                className="w-full py-3 bg-[#eff6ff] text-[#2563eb] text-sm font-bold hover:bg-blue-100 transition-colors border-t border-blue-100"
                            >
                                View Details
                            </button>
                        )}
                    </div>
                );
            })}

            {collections.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                    No collections found
                </div>
            )}
        </div>
    );
};
