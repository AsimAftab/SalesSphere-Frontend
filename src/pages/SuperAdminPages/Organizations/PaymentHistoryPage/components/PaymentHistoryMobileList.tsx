import React from 'react';
import { Images, Trash2, SquarePen } from 'lucide-react';
import type { OrganizationPayment } from '@/api/SuperAdmin/organizationPaymentService';
import { MobileCard, MobileCardList } from '@/components/ui';
import { PAYMENT_MODE_LABELS } from '../types';

interface PaymentHistoryMobileListProps {
    data: OrganizationPayment[];
    onViewImage: (images: string[]) => void;
    onEdit: (payment: OrganizationPayment) => void;
    onDelete: (id: string) => void;
}

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toISOString().split('T')[0];
};

export const PaymentHistoryMobileList: React.FC<PaymentHistoryMobileListProps> = ({
    data,
    onViewImage,
    onEdit,
    onDelete,
}) => (
    <MobileCardList isEmpty={data.length === 0} emptyMessage="No payments found">
        {data.map((payment, index) => (
            <MobileCard
                key={payment._id}
                id={payment._id}
                header={{
                    serialNumber: index + 1,
                    title: `Rs. ${Number(payment.amount).toLocaleString('en-IN')}`,
                    badge: {
                        type: 'custom',
                        label: PAYMENT_MODE_LABELS[payment.paymentMode],
                        className: 'bg-green-100 text-green-700',
                    },
                }}
                details={[
                    {
                        label: 'Date',
                        value: formatDate(payment.dateReceived),
                    },
                    {
                        label: 'Received By',
                        value: typeof payment.receivedBy === 'object' ? payment.receivedBy.name : '-',
                    },
                    {
                        label: 'Description',
                        value: payment.description || '-',
                        fullWidth: true,
                    },
                ]}
                detailsLayout="grid"
                actions={[
                    {
                        label: `View (${payment.proofImages?.length || 0})`,
                        onClick: () => onViewImage((payment.proofImages || []).map(img => img.imageUrl)),
                        icon: Images,
                        variant: 'primary',
                        visible: (payment.proofImages?.length ?? 0) > 0,
                    },
                    {
                        label: 'Edit',
                        onClick: () => onEdit(payment),
                        icon: SquarePen,
                        variant: 'secondary',
                    },
                    {
                        label: 'Delete',
                        onClick: () => onDelete(payment._id),
                        icon: Trash2,
                        variant: 'danger',
                    },
                ]}
                actionsFullWidth={false}
            />
        ))}
    </MobileCardList>
);

export default PaymentHistoryMobileList;
