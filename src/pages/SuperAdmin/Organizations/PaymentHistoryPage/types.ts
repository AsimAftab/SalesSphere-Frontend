import type { PaymentMode } from '@/api/SuperAdmin/organizationPaymentService';

export interface PaymentFilters {
    dateFrom: Date | null;
    dateTo: Date | null;
    paymentModes: string[];
    receivedBy: string[];
    months: string[];
    searchQuery: string;
}

export interface PaymentSummary {
    totalAmount: number;
    totalCount: number;
    lastPaymentDate: string | null;
}

export const INITIAL_FILTERS: PaymentFilters = {
    dateFrom: null,
    dateTo: null,
    paymentModes: [],
    receivedBy: [],
    months: [],
    searchQuery: '',
};

export const PAYMENT_MODE_OPTIONS = ['Cash', 'QR Pay', 'Cheque', 'Bank Transfer', 'Others'];

export const MONTH_OPTIONS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const PAYMENT_MODE_MAP: Record<string, PaymentMode> = {
    'Cash': 'cash',
    'QR Pay': 'qr_pay',
    'Cheque': 'cheque',
    'Bank Transfer': 'bank_transfer',
    'Others': 'others',
};

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
    cash: 'Cash',
    qr_pay: 'QR Pay',
    cheque: 'Cheque',
    bank_transfer: 'Bank Transfer',
    others: 'Others',
};
