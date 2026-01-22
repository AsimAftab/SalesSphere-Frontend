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
 * Payment mode options for filtering and forms.
 */
export const PAYMENT_MODE_OPTIONS: string[] = ["Cash", "Cheque", "Bank Transfer", "QR Pay"];

/**
 * Cheque status options for filtering and display.
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
