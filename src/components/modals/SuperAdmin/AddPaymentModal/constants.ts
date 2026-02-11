import type { PaymentMode } from './types';

export interface PaymentModeOption {
    value: PaymentMode;
    label: string;
}

export const PAYMENT_MODE_OPTIONS: PaymentModeOption[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'qr_pay', label: 'QR Pay' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'others', label: 'Others' },
];

export const INITIAL_FORM_DATA = {
    paymentMode: '' as const,
    otherPaymentMode: '',
    amount: '' as const,
    dateReceived: new Date().toISOString().split('T')[0],
    description: '',
    upgradedPlanName: '',
    proofImages: [] as File[],
    existingImages: [] as string[],
};
