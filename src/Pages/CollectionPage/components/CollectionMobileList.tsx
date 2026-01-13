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
        <div className="w-full space-y-4 pb-10">
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
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">#{serialNumber}</div>
                                        <h3 className="text-sm font-bold text-gray-900">{collection.partyName}</h3>
                                    </div>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${paymentModeConfig.className}`}>
                                    {paymentModeConfig.label}
                                </span>
                            </div>

                            {/* Amount */}
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Amount Received</span>
                                <div className="text-sm font-bold text-secondary pt-1">
                                    {formatCurrency(collection.paidAmount)}
                                </div>
                            </div>

                            {/* Grid: Received Date & Created By */}
                            <div className="grid grid-cols-2 gap-y-3 pt-2">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Received Date</span>
                                    <div className="text-xs text-gray-600">{formatDate(collection.receivedDate)}</div>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Created By</span>
                                    <div className="text-xs text-gray-600">{collection.createdBy.name}</div>
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
