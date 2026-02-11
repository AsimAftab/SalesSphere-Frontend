import React from 'react';
import { MobileCard, MobileCardList } from '@/components/ui';

interface Estimate {
    id: string;
    _id: string;
    estimateNumber: string;
    partyName: string;
    totalAmount: number;
    dateTime: string;
    createdBy: { name: string };
}

interface EstimateListMobileProps {
    estimates: Estimate[];
    selection: {
        selectedIds: string[];
    };
    onToggleSelect: (id: string) => void;
    onDelete?: (id: string) => void;
    canDelete?: boolean;
    canBulkDelete?: boolean;
}

const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const EstimateListMobile: React.FC<EstimateListMobileProps> = ({
    estimates,
    selection,
    onToggleSelect,
    canBulkDelete = true
}) => {
    return (
        <MobileCardList isEmpty={estimates.length === 0} emptyMessage="No estimates found">
            {estimates.map((est: Estimate, index: number) => {
                const estimateId = est._id || est.id;
                return (
                    <MobileCard
                        key={estimateId}
                        id={estimateId}
                        header={{
                            selectable: canBulkDelete,
                            isSelected: selection.selectedIds.includes(estimateId),
                            onToggleSelection: () => onToggleSelect(estimateId),
                            serialNumber: index + 1,
                            titleLabel: "Estimate",
                            title: est.estimateNumber,
                        }}
                        details={[
                            {
                                label: "Party Name",
                                value: est.partyName,
                                fullWidth: true,
                                valueClassName: "font-semibold text-gray-800"
                            },
                            {
                                label: "Amount",
                                value: formatCurrency(est.totalAmount),
                                valueClassName: "font-bold text-secondary"
                            },
                            {
                                label: "Created By",
                                value: est.createdBy?.name || '-'
                            },
                        ]}
                        detailsLayout="grid"
                        actions={[
                            {
                                label: "View Details",
                                href: `/estimate/${estimateId}`,
                                variant: 'primary'
                            }
                        ]}
                        actionsFullWidth={true}
                    />
                );
            })}
        </MobileCardList>
    );
};

export default EstimateListMobile;
