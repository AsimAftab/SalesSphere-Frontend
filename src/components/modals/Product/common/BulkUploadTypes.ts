/**
 * BulkUploadProduct Types
 * Type definitions for bulk product upload functionality
 * Re-exports existing types from productService for consistency
 */

import type { BulkProductData } from '../../../../api/productService';

// Re-export for convenience
export type { BulkProductData };

/**
 * Props for the BulkUploadProductsModal component
 */
export interface BulkUploadProductsModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Optional organization name for display */
    organizationName?: string;
    /** Callback to handle bulk product update - uses existing BulkProductData type */
    onBulkUpdate: (products: BulkProductData[]) => Promise<BulkUploadResult>;
    /** Optional callback after successful upload */
    onUploadSuccess?: (count: number) => void;
}

/**
 * Result structure from bulk upload API
 */
export interface BulkUploadResult {
    success?: boolean;
    data?: {
        successfullyImported?: number;
    };
    length?: number;
}

/**
 * Raw Excel row data before transformation
 */
export interface ExcelRowData {
    'Product Name'?: string | object;
    'Category'?: string | object;
    'Price'?: string | number | object;
    'Stock (Qty)'?: string | number | object;
    'Serial No'?: string | object;
    [key: string]: unknown;
}

/**
 * Template column configuration
 */
export interface TemplateColumn {
    header: string;
    key: string;
    width: number;
}

/**
 * Upload result state
 */
export interface UploadResultState {
    successfullyImported: number;
}
