import React from 'react';
import { Images, Trash2, SquarePen } from 'lucide-react';
import type { OrganizationPayment } from '@/api/SuperAdmin';
import { DataTable, textColumn, type TableColumn } from '@/components/ui';
import { PAYMENT_MODE_LABELS } from '../types';

interface PaymentHistoryTableProps {
    data: OrganizationPayment[];
    onViewImage: (images: string[]) => void;
    onEdit: (payment: OrganizationPayment) => void;
    onDelete: (id: string) => void;
    startIndex: number;
}

/**
 * SRP: This component is strictly responsible for rendering the Desktop Table view.
 */
export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({
    data,
    onViewImage,
    onEdit,
    onDelete,
    startIndex,
}) => {
    const columns: TableColumn<OrganizationPayment>[] = [
        {
            key: 'dateReceived',
            label: 'Date Received',
            render: (_, payment) => {
                return payment.dateReceived
                    ? new Date(payment.dateReceived).toISOString().split('T')[0]
                    : '—';
            },
        },
        {
            key: 'amount',
            label: 'Amount Received',
            render: (_, payment) => `Rs. ${Number(payment.amount).toLocaleString('en-IN')}`,
        },
        textColumn<OrganizationPayment>('paymentMode', 'Payment Mode', (item) =>
            PAYMENT_MODE_LABELS[item.paymentMode] + (item.otherPaymentMode ? ` (${item.otherPaymentMode})` : '')
        ),
        {
            key: 'description',
            label: 'Description',
            render: (_, payment) => (
                <span title={payment.description}>
                    {payment.description || '—'}
                </span>
            ),
            cellClassName: 'max-w-[200px]',
        },
        textColumn<OrganizationPayment>('receivedBy', 'Received By', (item) =>
            typeof item.receivedBy === 'object' ? item.receivedBy.name : '—'
        ),
        {
            key: 'proofImages',
            label: 'Proof',
            render: (_, payment) => {
                const imageUrls = (payment.proofImages || []).map(img => img.imageUrl);
                return (
                    <button
                        type="button"
                        onClick={() => onViewImage(imageUrls)}
                        className="flex items-center gap-1.5 text-blue-600 font-black text-xs hover:underline disabled:text-gray-300 disabled:no-underline transition-all"
                        disabled={imageUrls.length === 0}
                    >
                        <Images size={14} strokeWidth={3} />
                        View ({imageUrls.length})
                    </button>
                );
            },
        },
        {
            key: 'action',
            label: 'Action',
            render: (_, payment) => (
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(payment)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-all active:scale-90"
                        title="Edit Entry"
                    >
                        <SquarePen size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(payment._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
                        title="Delete Entry"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DataTable<OrganizationPayment>
            data={data}
            columns={columns}
            getRowId={(item) => item._id}
            showSerialNumber
            startIndex={startIndex}
            hideOnMobile
            rowClassName={(_item, isSelected) =>
                `transition-colors duration-200 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-200'}`
            }
        />
    );
};

export default PaymentHistoryTable;
