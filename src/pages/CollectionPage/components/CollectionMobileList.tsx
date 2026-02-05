import React from 'react';
import type { Collection } from '@/api/collectionService';
import { MobileCard, MobileCardList } from '@/components/ui';

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

const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getPaymentModeStyle = (mode: string) => {
    switch (mode) {
        case 'Cash': return 'bg-green-100 text-green-700';
        case 'Cheque': return 'bg-blue-100 text-blue-700';
        case 'Bank Transfer': return 'bg-purple-100 text-purple-700';
        case 'QR Pay': return 'bg-indigo-100 text-indigo-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export const CollectionMobileList: React.FC<CollectionMobileListProps> = ({
    collections,
    selectedIds,
    onToggleSelection,
    onViewDetails,
    permissions,
    itemsPerPage,
    currentPage
}) => {
    return (
        <MobileCardList
            isEmpty={collections.length === 0}
            emptyMessage="No collections found"
        >
            {collections.map((collection, index) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                const isSelected = selectedIds.includes(collection.id);

                return (
                    <MobileCard
                        key={collection.id}
                        id={collection.id}
                        header={{
                            selectable: permissions.canBulkDelete,
                            isSelected,
                            onToggleSelection: () => onToggleSelection(collection.id),
                            serialNumber,
                            title: collection.partyName,
                            badge: {
                                type: 'custom',
                                label: collection.paymentMode,
                                className: getPaymentModeStyle(collection.paymentMode),
                            },
                        }}
                        details={[
                            {
                                label: 'Amount',
                                value: formatCurrency(collection.paidAmount),
                                valueClassName: 'font-bold text-secondary',
                            },
                            {
                                label: 'Date',
                                value: formatDate(collection.receivedDate),
                            },
                            {
                                label: 'Created By',
                                value: collection.createdBy.name,
                            },
                        ]}
                        detailsLayout="grid"
                        actions={permissions.canViewDetail ? [
                            {
                                label: 'View Details',
                                onClick: () => onViewDetails?.(collection),
                                variant: 'primary',
                            },
                        ] : undefined}
                        actionsFullWidth={true}
                    />
                );
            })}
        </MobileCardList>
    );
};
