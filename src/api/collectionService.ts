import api from './api';

// --- 1. Interface Segregation ---

/**
 * Collection Interface - Payment collection from parties
 */
export interface Collection {
    id: string;
    _id: string;
    collectionNumber: string;

    // Party Information
    partyId: string;
    partyName: string;

    // Payment Details
    paidAmount: number;
    paymentMode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay';
    receivedDate: string;

    // Cheque-specific fields
    chequeNumber?: string;
    chequeStatus?: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';
    chequeDate?: string;
    bankName?: string;

    // Additional fields for other payment modes
    transactionId?: string;
    upiId?: string;

    // Audit trail
    createdBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;

    // Optional
    notes?: string;
    receiptUrl?: string;
    images?: string[];
}

/**
 * New Collection Data for creation
 */
export interface NewCollectionData {
    partyId: string;
    paidAmount: number;
    paymentMode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay';
    receivedDate: string;

    // Conditional fields
    chequeNumber?: string;
    chequeStatus?: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';
    chequeDate?: string;
    bankName?: string;
    transactionId?: string;
    upiId?: string;
    notes?: string;
}

/**
 * Bulk Delete Result
 */
export interface BulkDeleteResult {
    success: number;
    failed: number;
    errors: string[];
}

// --- 2. Mapper Logic ---

class CollectionMapper {
    static toFrontend(apiCollection: any): Collection {
        return {
            id: apiCollection._id,
            _id: apiCollection._id,
            collectionNumber: apiCollection.collectionNumber || apiCollection.collectionNo,
            partyId: apiCollection.party?._id || apiCollection.partyId,
            partyName: apiCollection.party?.partyName || apiCollection.partyName,
            paidAmount: apiCollection.paidAmount || apiCollection.amount || 0,
            paymentMode: apiCollection.paymentMode || 'Cash',
            receivedDate: apiCollection.receivedDate || apiCollection.collectionDate || apiCollection.createdAt,

            // Cheque fields
            chequeNumber: apiCollection.chequeNumber,
            chequeStatus: apiCollection.chequeStatus,
            chequeDate: apiCollection.chequeDate,
            bankName: apiCollection.bankName,

            // Other payment modes
            transactionId: apiCollection.transactionId || apiCollection.referenceNumber,
            upiId: apiCollection.upiId,

            // Audit
            createdBy: {
                _id: apiCollection.createdBy?._id || '',
                name: apiCollection.createdBy?.name || 'Unknown'
            },
            createdAt: apiCollection.createdAt,
            updatedAt: apiCollection.updatedAt,

            // Optional
            notes: apiCollection.notes || apiCollection.remarks,
            receiptUrl: apiCollection.receiptUrl,
        };
    }

    static toApiPayload(collectionData: Partial<NewCollectionData>): any {
        const payload: any = {};

        if (collectionData.partyId) payload.partyId = collectionData.partyId;
        if (collectionData.paidAmount !== undefined) payload.amount = collectionData.paidAmount; // Backend likely expects 'amount'
        if (collectionData.paymentMode) payload.paymentMode = collectionData.paymentMode;
        if (collectionData.receivedDate) payload.receivedDate = collectionData.receivedDate;

        // Cheque-specific
        if (collectionData.chequeNumber) payload.chequeNumber = collectionData.chequeNumber;
        if (collectionData.chequeStatus) payload.chequeStatus = collectionData.chequeStatus;
        if (collectionData.chequeDate) payload.chequeDate = collectionData.chequeDate;
        if (collectionData.bankName) payload.bankName = collectionData.bankName;

        // Other payment modes
        if (collectionData.transactionId) payload.transactionId = collectionData.transactionId;
        if (collectionData.upiId) payload.upiId = collectionData.upiId;

        // Optional
        if (collectionData.notes) payload.notes = collectionData.notes;

        return payload;
    }
}

// --- 3. Centralized Endpoints ---

const ENDPOINTS = {
    BASE: '/collections',
    DETAIL: (id: string) => `/collections/${id}`,
    CHEQUE_STATUS: (id: string) => `/collections/${id}/cheque-status`,
    BULK_DELETE: '/collections/bulk-delete',
};

// --- 4. Repository Pattern ---

export const CollectionRepository = {
    /**
     * Get all collections (with optional filtering)
     * Using limit: 1000 for client-side filtering pattern (like ExpensesPage)
     */
    async getCollections(params?: { limit?: number; page?: number }): Promise<Collection[]> {
        const response = await api.get(ENDPOINTS.BASE, {
            params: {
                limit: params?.limit || 1000,
                page: params?.page || 1,
            },
        });

        if (response.data.success && Array.isArray(response.data.data)) {
            return response.data.data.map(CollectionMapper.toFrontend);
        }
        return [];
    },

    /**
     * Get single collection details
     */
    async getCollectionDetails(collectionId: string): Promise<Collection> {
        const response = await api.get(ENDPOINTS.DETAIL(collectionId));
        if (!response.data.success) {
            throw new Error('Collection not found');
        }
        return CollectionMapper.toFrontend(response.data.data);
    },

    /**
     * Create new collection
     */
    async createCollection(collectionData: NewCollectionData): Promise<Collection> {
        const payload = CollectionMapper.toApiPayload(collectionData);
        console.log('Sending Payload to API:', payload); // Debug payload
        try {
            const response = await api.post(ENDPOINTS.BASE, payload);
            if (response.data.success) {
                return CollectionMapper.toFrontend(response.data.data);
            }
            throw new Error(response.data.message || 'Failed to create collection');
        } catch (error: any) {
            console.error('API Error Response:', error.response?.data);
            throw error;
        }
    },

    /**
     * Update cheque status (for cheque payment mode only)
     */
    async updateChequeStatus(
        collectionId: string,
        status: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced',
        depositDate?: string
    ): Promise<Collection> {
        const response = await api.put(ENDPOINTS.CHEQUE_STATUS(collectionId), {
            chequeStatus: status,
            ...(depositDate && { depositDate }),
        });

        if (response.data.success) {
            return CollectionMapper.toFrontend(response.data.data);
        }
        throw new Error(response.data.message || 'Failed to update cheque status');
    },

    /**
     * Delete single collection
     */
    async deleteCollection(collectionId: string): Promise<boolean> {
        const response = await api.delete(ENDPOINTS.DETAIL(collectionId));
        return response.data.success;
    },

    /**
     * Bulk delete collections
     */
    async bulkDeleteCollections(collectionIds: string[]): Promise<boolean> {
        const response = await api.post(ENDPOINTS.BULK_DELETE, {
            collectionIds,
        });
        return response.data.success;
    },
};

// --- 5. Clean Named Exports ---

export const {
    getCollections,
    getCollectionDetails,
    createCollection,
    updateChequeStatus,
    deleteCollection,
    bulkDeleteCollections,
} = CollectionRepository;

// --- 6. Constants ---

export const PAYMENT_MODES = [
    { value: 'Cash', label: 'Cash', icon: '💵' },
    { value: 'Cheque', label: 'Cheque', icon: '🏦' },
    { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏧' },
    { value: 'QR Pay', label: 'QR Pay', icon: '📱' },
] as const;

export const CHEQUE_STATUSES = [
    { value: 'Pending', label: 'Pending', color: 'yellow' },
    { value: 'Deposited', label: 'Deposited', color: 'blue' },
    { value: 'Cleared', label: 'Cleared', color: 'green' },
    { value: 'Bounced', label: 'Bounced', color: 'red' },
] as const;

export type PaymentMode = typeof PAYMENT_MODES[number]['value'];
export type ChequeStatus = typeof CHEQUE_STATUSES[number]['value'];
