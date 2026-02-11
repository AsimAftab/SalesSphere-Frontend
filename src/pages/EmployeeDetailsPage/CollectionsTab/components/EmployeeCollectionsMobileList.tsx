import React from 'react';
import type { Collection } from '@/api/collectionService';
import { formatDisplayDate } from '@/utils/dateUtils';
import { MobileCard, MobileCardList } from '@/components/ui';

interface EmployeeCollectionsMobileListProps {
    collections: Collection[];
    employeeId?: string;
    employeeName?: string;
}

const formatCurrency = (amount: number) => {
    return `RS ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

const EmployeeCollectionsMobileList: React.FC<EmployeeCollectionsMobileListProps> = ({
    collections,
    employeeId,
    employeeName
}) => {
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
                            label: 'Party Name',
                            value: collection.partyName || '-',
                        },
                        {
                            label: 'Amount',
                            value: formatCurrency(collection.paidAmount),
                            valueClassName: 'font-bold text-secondary',
                        },
                    ]}
                    detailsLayout="grid"
                    actions={[
                        {
                            label: 'View Details',
                            href: `/collection/${collection.id}`,
                            linkState: { from: 'employee-collections', employeeId, employeeName },
                            variant: 'primary',
                        },
                    ]}
                    actionsFullWidth={true}
                />
            ))}
        </MobileCardList>
    );
};

export default EmployeeCollectionsMobileList;
