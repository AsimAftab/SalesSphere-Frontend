import React from 'react';
import { type Collection } from '@/api/collectionService';
import { MobileCard, MobileCardList } from '@/components/ui';
import { formatDateToLocalISO } from '@/utils/dateUtils';

interface PartyCollectionsMobileListProps {
    collections: Collection[];
    partyId: string;
}

const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '-';
    return `RS ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return formatDateToLocalISO(new Date(dateString));
};

const getPaymentModeStyle = (mode: string) => {
    switch (mode?.toLowerCase()) {
        case 'cash': return 'bg-green-100 text-green-800 border-green-200';
        case 'cheque': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'online': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const PartyCollectionsMobileList: React.FC<PartyCollectionsMobileListProps> = ({ collections, partyId }) => {
    return (
        <MobileCardList isEmpty={collections.length === 0} emptyMessage="No collections found">
            {collections.map((collection, index) => (
                <MobileCard
                    key={collection.id || collection._id}
                    id={collection.id || collection._id}
                    header={{
                        serialNumber: index + 1,
                        titleLabel: 'Collection',
                        title: collection.paymentMode,
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
                            valueClassName: 'font-bold text-gray-900',
                        },
                        {
                            label: 'Date',
                            value: formatDate(collection.receivedDate),
                        },
                        {
                            label: 'Created By',
                            value: collection.createdBy?.name || '-',
                            fullWidth: true,
                        },
                    ]}
                    actions={[
                        {
                            label: 'View Details',
                            href: `/collection/${collection.id || collection._id}`,
                            linkState: { from: 'party-details', partyId: partyId },
                            variant: 'secondary',
                        },
                    ]}
                />
            ))}
        </MobileCardList>
    );
};
