import api from './api';

// --- 1. Interface Segregation ---

/**
 * Collection Interface - Payment collection from parties
 */
export interface Collection {
    id: string;
    _id: string;

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

    // Audit trail
    createdBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;

    // Optional
    notes?: string;
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
        // Map backend paymentMethod to frontend paymentMode
        let paymentMode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay' = 'Cash';
        switch (apiCollection.paymentMethod) {
            case 'cash': paymentMode = 'Cash'; break;
            case 'cheque': paymentMode = 'Cheque'; break;
            case 'bank_transfer': paymentMode = 'Bank Transfer'; break;
            case 'qr': paymentMode = 'QR Pay'; break;
            default: paymentMode = 'Cash';
        }

        // Map backend chequeStatus (lowercase) to frontend (Capitalized)
        let chequeStatus: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced' | undefined = undefined;
        if (apiCollection.chequeStatus) {
            const status = apiCollection.chequeStatus.toLowerCase();
            switch (status) {
                case 'pending': chequeStatus = 'Pending'; break;
                case 'deposited': chequeStatus = 'Deposited'; break;
                case 'cleared': chequeStatus = 'Cleared'; break;
                case 'bounced': chequeStatus = 'Bounced'; break;
                default: chequeStatus = 'Pending';
            }
        }

        return {
            id: apiCollection._id,
            _id: apiCollection._id,
            partyId: apiCollection.party?._id || apiCollection.party, // Handle both populated and formatted ID
            partyName: apiCollection.party?.partyName || 'Unknown Party',
            paidAmount: apiCollection.amountReceived || apiCollection.paidAmount || 0,
            paymentMode: paymentMode,
            receivedDate: apiCollection.receivedDate ? new Date(apiCollection.receivedDate).toLocaleDateString('en-CA') : (apiCollection.createdAt ? new Date(apiCollection.createdAt).toLocaleDateString('en-CA') : ''),

            // Cheque fields
            chequeNumber: apiCollection.chequeNumber,
            chequeStatus: chequeStatus,
            chequeDate: apiCollection.chequeDate ? new Date(apiCollection.chequeDate).toLocaleDateString('en-CA') : undefined,
            bankName: apiCollection.bankName,

            // Audit
            createdBy: {
                _id: apiCollection.createdBy?._id || '',
                name: apiCollection.createdBy?.name || 'Unknown'
            },
            createdAt: apiCollection.createdAt ? new Date(apiCollection.createdAt).toLocaleDateString('en-CA') : '',
            updatedAt: apiCollection.updatedAt ? new Date(apiCollection.updatedAt).toLocaleDateString('en-CA') : '',

            // Optional
            notes: apiCollection.description || apiCollection.notes,
            images: apiCollection.images || [],
        };
    }

    static toApiPayload(collectionData: Partial<NewCollectionData>): any {
        const payload: any = {};

        // 1. Map partyId -> party
        if (collectionData.partyId) payload.party = collectionData.partyId;

        // 2. Map paidAmount -> amountReceived
        if (collectionData.paidAmount !== undefined) payload.amountReceived = collectionData.paidAmount;

        // 3. Map paymentMode -> paymentMethod (with enum conversion)
        if (collectionData.paymentMode) {
            switch (collectionData.paymentMode) {
                case 'Cash': payload.paymentMethod = 'cash'; break;
                case 'Cheque': payload.paymentMethod = 'cheque'; break;
                case 'Bank Transfer': payload.paymentMethod = 'bank_transfer'; break;
                case 'QR Pay': payload.paymentMethod = 'qr'; break; // Backend expects 'qr'
                default: payload.paymentMethod = 'cash';
            }
        }

        if (collectionData.receivedDate) payload.receivedDate = collectionData.receivedDate;

        // Cheque-specific
        if (collectionData.chequeNumber) payload.chequeNumber = collectionData.chequeNumber;

        // 4. Map chequeStatus (Capitalized) -> backend (lowercase)
        if (collectionData.chequeStatus) {
            payload.chequeStatus = collectionData.chequeStatus.toLowerCase();
        }

        if (collectionData.chequeDate) payload.chequeDate = collectionData.chequeDate;
        if (collectionData.bankName) payload.bankName = collectionData.bankName;

        // Optional
        if (collectionData.notes) payload.description = collectionData.notes;

        return payload;
    }
}

// --- 3. Centralized Endpoints ---

const ENDPOINTS = {
    BASE: '/collections',
    DETAIL: (id: string) => `/collections/${id}`,
    CHEQUE_STATUS: (id: string) => `/collections/${id}/cheque-status`,
    BULK_DELETE: '/collections/bulk-delete',
    IMAGE_BASE: (id: string) => `/collections/${id}/images`,
    IMAGE_SPECIFIC: (id: string, num: number) => `/collections/${id}/images/${num}`,
};

// --- 4. Repository Pattern ---

export const CollectionRepository = {
    /**
     * Get all collections (with optional filtering)
     * Using limit: 1000 for client-side filtering pattern
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
     * Update collection details
     */
    async updateCollection(collectionId: string, updatedData: Partial<NewCollectionData>): Promise<Collection> {
        const payload = CollectionMapper.toApiPayload(updatedData);
        try {
            const response = await api.put(ENDPOINTS.DETAIL(collectionId), payload);
            if (response.data.success) {
                return CollectionMapper.toFrontend(response.data.data);
            }
            throw new Error(response.data.message || 'Failed to update collection');
        } catch (error: any) {
            console.error('API Error Response:', error.response?.data);
            throw error;
        }
    },

    /**
     * Update cheque status
     */
    async updateChequeStatus(
        collectionId: string,
        status: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced',
        depositDate?: string
    ): Promise<Collection> {
        const response = await api.patch(ENDPOINTS.CHEQUE_STATUS(collectionId), {
            chequeStatus: status.toLowerCase(), // Convert to lowercase for backend
            ...(depositDate && { depositDate }),
        });

        if (response.data.success) {
            return CollectionMapper.toFrontend(response.data.data);
        }
        throw new Error(response.data.message || 'Failed to update cheque status');
    },

    /**
     * Upload collection image
     */
    async uploadCollectionImage(collectionId: string, imageNumber: number, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('imageNumber', imageNumber.toString());
        formData.append('image', file);

        const response = await api.post(ENDPOINTS.IMAGE_BASE(collectionId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to upload image');
    },

    /**
     * Delete collection image
     */
    async deleteCollectionImage(collectionId: string, imageNumber: number): Promise<boolean> {
        const response = await api.delete(ENDPOINTS.IMAGE_SPECIFIC(collectionId, imageNumber));
        if (response.data.success) {
            return true;
        }
        throw new Error(response.data.message || 'Failed to delete image');
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
        const response = await api.delete(ENDPOINTS.BULK_DELETE, {
            data: { ids: collectionIds }
        });
        return response.data.success;
    }
};

// --- 5. Clean Named Exports ---

export const {
    getCollections,
    getCollectionDetails,
    createCollection,
    updateCollection,
    updateChequeStatus,
    uploadCollectionImage,
    deleteCollectionImage,
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
