/**
 * Collection Module Constants
 * 
 * Centralized constants for the Collection feature.
 * Follows Single Responsibility Principle by isolating configuration data.
 */

/**
 * Month options for filtering collections by received date month.
 */
export const MONTH_OPTIONS: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/**
 * Payment mode options with UI metadata.
 * Used for dropdowns, filtering, and display.
 */
export const PAYMENT_MODES = [
    { value: 'Cash', label: 'Cash', icon: '💵' },
    { value: 'Cheque', label: 'Cheque', icon: '🏦' },
    { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏧' },
    { value: 'QR Pay', label: 'QR Pay', icon: '📱' },
] as const;

/**
 * Simple string array of payment mode values for Zod schemas.
 */
export const PAYMENT_MODE_VALUES = ['Cash', 'Cheque', 'Bank Transfer', 'QR Pay'] as const;

/**
 * @deprecated Use PAYMENT_MODES instead
 */
export const PAYMENT_MODE_OPTIONS: string[] = ["Cash", "Cheque", "Bank Transfer", "QR Pay"];

/**
 * Cheque status options with UI metadata.
 */
export const CHEQUE_STATUSES = [
    { value: 'Pending', label: 'Pending', color: 'yellow' },
    { value: 'Deposited', label: 'Deposited', color: 'blue' },
    { value: 'Cleared', label: 'Cleared', color: 'green' },
    { value: 'Bounced', label: 'Bounced', color: 'red' },
] as const;

/**
 * Simple string array of cheque status values for Zod schemas.
 */
export const CHEQUE_STATUS_VALUES = ['Pending', 'Deposited', 'Cleared', 'Bounced'] as const;

/**
 * @deprecated Use CHEQUE_STATUSES instead
 */
export const CHEQUE_STATUS_OPTIONS = ["Pending", "Deposited", "Cleared", "Bounced"] as const;

/**
 * Maximum number of images allowed per collection.
 */
export const MAX_COLLECTION_IMAGES = 2;

/**
 * Maximum length for collection notes/description.
 */
export const MAX_NOTES_LENGTH = 200;

/**
 * Interface for party dropdown options.
 * Used consistently across Collection forms.
 */
export interface PartyOption {
    id: string;
    companyName: string;
}

/**
 * Type for payment mode values.
 */
export type PaymentModeOption = typeof PAYMENT_MODE_OPTIONS[number];

/**
 * Type for cheque status values.
 */
export type ChequeStatusOption = typeof CHEQUE_STATUS_OPTIONS[number];
