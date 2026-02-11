import React from 'react';
import type { Collection } from '@/api/collectionService';
import { formatDisplayDate } from '@/utils/dateUtils';
import { MobileCard, MobileCardList } from '@/components/ui';

interface PartyCollectionsMobileListProps {
    collections: Collection[];
    partyId: string;
}

const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

export const PartyCollectionsMobileList: React.FC<PartyCollectionsMobileListProps> = ({ collections, partyId }) => {
    return (
        <MobileCardList isEmpty={collections.length === 0} emptyMessage="No collections found">
            {collections.map((collection, index) => (
                <MobileCard
                    key={collection.id}
                    id={collection.id}
                    header={{
                        serialNumber: index + 1,
                        title: collection.receivedDate ? formatDisplayDate(collection.receivedDate) : 'N/A',
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
                            label: 'Created By',
                            value: collection.createdBy?.name || '-',
                        },
                    ]}
                    detailsLayout="grid"
                    actions={[
                        {
                            label: 'View Details',
                            href: `/collection/${collection.id}`,
                            linkState: { from: 'party-details', partyId },
                            variant: 'primary',
                        },
                    ]}
                    actionsFullWidth={true}
                />
            ))}
        </MobileCardList>
    );
};
