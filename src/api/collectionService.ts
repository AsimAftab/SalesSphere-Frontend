import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

// --- 1. Interface Segregation ---

export interface Collection {
    id: string;
    _id: string;
    partyId: string;
    partyName: string;
    paidAmount: number;
    paymentMode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay';
    receivedDate: string;
    chequeNumber?: string;
    chequeStatus?: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';
    chequeDate?: string;
    bankName?: string;
    createdBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    notes?: string;
    images?: string[];
}

export interface NewCollectionData {
    partyId: string;
    paidAmount: number;
    paymentMode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay';
    receivedDate: string;
    chequeNumber?: string;
    chequeStatus?: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';
    chequeDate?: string;
    bankName?: string;
    notes?: string;
    images?: File[];
}

export interface BulkDeleteResult {
    success: number;
    failed: number;
    errors: string[];
}

// --- 2. API Response Interface ---

interface ApiCollectionResponse {
    _id: string;
    party?: { _id: string; partyName?: string; companyName?: string } | string;
    amountReceived?: number;
    paidAmount?: number;
    paymentMethod?: string;
    receivedDate?: string;
    chequeNumber?: string;
    chequeStatus?: string;
    chequeDate?: string;
    bankName?: string;
    createdBy?: { _id: string; name: string };
    createdAt?: string;
    updatedAt?: string;
    description?: string;
    notes?: string;
    images?: string[];
}

// --- 3. Mapper Logic ---

/**
 * CollectionMapper - Transforms API response data to frontend Collection domain model.
 */
class CollectionMapper {
    static toFrontend(apiCollection: ApiCollectionResponse): Collection {
        let paymentMode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay' = 'Cash';
        switch (apiCollection.paymentMethod) {
            case 'cash': paymentMode = 'Cash'; break;
            case 'cheque': paymentMode = 'Cheque'; break;
            case 'bank_transfer': paymentMode = 'Bank Transfer'; break;
            case 'qr': paymentMode = 'QR Pay'; break;
            default: paymentMode = 'Cash';
        }

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
            partyId: typeof apiCollection.party === 'object' ? apiCollection.party?._id : (apiCollection.party || ''),
            partyName: (typeof apiCollection.party === 'object' ? apiCollection.party?.partyName : undefined) || 'Unknown Party',
            paidAmount: apiCollection.amountReceived || apiCollection.paidAmount || 0,
            paymentMode: paymentMode,
            receivedDate: apiCollection.receivedDate ? new Date(apiCollection.receivedDate).toLocaleDateString('en-CA') : (apiCollection.createdAt ? new Date(apiCollection.createdAt).toLocaleDateString('en-CA') : ''),
            chequeNumber: apiCollection.chequeNumber,
            chequeStatus: chequeStatus,
            chequeDate: apiCollection.chequeDate ? new Date(apiCollection.chequeDate).toLocaleDateString('en-CA') : undefined,
            bankName: apiCollection.bankName,
            createdBy: {
                _id: apiCollection.createdBy?._id || '',
                name: apiCollection.createdBy?.name || 'Unknown'
            },
            createdAt: apiCollection.createdAt || '',
            updatedAt: apiCollection.updatedAt ? new Date(apiCollection.updatedAt).toLocaleDateString('en-CA') : '',
            notes: apiCollection.description || apiCollection.notes,
            images: apiCollection.images || [],
        };
    }

    static toApiPayload(collectionData: Partial<NewCollectionData>): Record<string, string | number | undefined> {
        const payload: Record<string, string | number | undefined> = {};

        if (collectionData.partyId) payload.party = collectionData.partyId;
        if (collectionData.paidAmount !== undefined) payload.amountReceived = collectionData.paidAmount;

        if (collectionData.paymentMode) {
            switch (collectionData.paymentMode) {
                case 'Cash': payload.paymentMethod = 'cash'; break;
                case 'Cheque': payload.paymentMethod = 'cheque'; break;
                case 'Bank Transfer': payload.paymentMethod = 'bank_transfer'; break;
                case 'QR Pay': payload.paymentMethod = 'qr'; break;
                default: payload.paymentMethod = 'cash';
            }
        }

        if (collectionData.receivedDate) payload.receivedDate = collectionData.receivedDate;
        if (collectionData.chequeNumber) payload.chequeNumber = collectionData.chequeNumber;
        if (collectionData.chequeStatus) {
            payload.chequeStatus = collectionData.chequeStatus.toLowerCase();
        }
        if (collectionData.chequeDate) payload.chequeDate = collectionData.chequeDate;
        if (collectionData.bankName) payload.bankName = collectionData.bankName;
        if (collectionData.notes) payload.description = collectionData.notes;

        return payload;
    }
}

// --- 4. Endpoint Configuration ---

const COLLECTION_ENDPOINTS: EndpointConfig = {
    BASE: API_ENDPOINTS.collections.BASE,
    DETAIL: API_ENDPOINTS.collections.DETAIL,
    BULK_DELETE: API_ENDPOINTS.collections.BULK_DELETE,
};

// --- 5. CollectionRepositoryClass - Extends BaseRepository ---

/**
 * CollectionRepositoryClass - Extends BaseRepository for standard CRUD operations.
 */
class CollectionRepositoryClass extends BaseRepository<Collection, ApiCollectionResponse, NewCollectionData, Partial<NewCollectionData>> {
    protected readonly endpoints = COLLECTION_ENDPOINTS;

    protected mapToFrontend(apiData: ApiCollectionResponse): Collection {
        return CollectionMapper.toFrontend(apiData);
    }

    protected mapToPayload(data: NewCollectionData | Partial<NewCollectionData>): Record<string, unknown> {
        return CollectionMapper.toApiPayload(data);
    }

    // --- Entity-specific methods ---

    /**
     * Fetches all bank names.
     */
    async getBankNames(): Promise<{ _id: string; name: string }[]> {
        try {
            const response = await api.get(API_ENDPOINTS.collections.BANK_NAMES);
            return response.data.success ? response.data.data : [];
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to fetch bank names');
        }
    }

    /**
     * Creates a new bank name.
     */
    async createBankName(name: string): Promise<{ _id: string; name: string }> {
        try {
            const response = await api.post(API_ENDPOINTS.collections.BANK_NAMES, { name });
            return response.data.data;
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to create bank name');
        }
    }

    /**
     * Updates a bank name by ID.
     */
    async updateBankName(id: string, name: string): Promise<{ _id: string; name: string }> {
        try {
            const response = await api.put(API_ENDPOINTS.collections.BANK_NAME_DETAIL(id), { name });
            return response.data.data;
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to update bank name');
        }
    }

    /**
     * Deletes a bank name by ID.
     */
    async deleteBankName(id: string): Promise<boolean> {
        try {
            const response = await api.delete(API_ENDPOINTS.collections.BANK_NAME_DETAIL(id));
            return response.data.success;
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to delete bank name');
        }
    }

    /**
     * Uploads an image to a collection's image slot.
     */
    async uploadCollectionImage(collectionId: string, imageNumber: number, file: File): Promise<{ images?: string[] }> {
        try {
            const formData = new FormData();
            formData.append('imageNumber', imageNumber.toString());
            formData.append('image', file);

            const response = await api.post(API_ENDPOINTS.collections.IMAGE_BASE(collectionId), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to upload image');
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to upload collection image');
        }
    }

    /**
     * Creates a new collection with optional image uploads.
     */
    async createCollectionWithImages(collectionData: NewCollectionData): Promise<Collection> {
        try {
            const payload = CollectionMapper.toApiPayload(collectionData);
            const response = await api.post(this.endpoints.BASE, payload);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create collection');
            }

            let collection = CollectionMapper.toFrontend(response.data.data);

            if (collectionData.images && collectionData.images.length > 0) {
                const imagesToUpload = collectionData.images.slice(0, 2);

                for (let i = 0; i < imagesToUpload.length; i++) {
                    await this.uploadCollectionImage(collection.id, i + 1, imagesToUpload[i]);
                }

                collection = await this.getById(collection.id);
            }

            return collection;
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to create collection');
        }
    }

    /**
     * Updates an existing collection with optional new image uploads.
     */
    async updateCollectionWithImages(collectionId: string, updatedData: Partial<NewCollectionData>): Promise<Collection> {
        try {
            const payload = CollectionMapper.toApiPayload(updatedData);
            const response = await api.put(this.endpoints.DETAIL(collectionId), payload);

            let collection = CollectionMapper.toFrontend(response.data.data);

            if (updatedData.images && updatedData.images.length > 0) {
                const imagesToUpload = updatedData.images.slice(0, 2);

                for (let i = 0; i < imagesToUpload.length; i++) {
                    await this.uploadCollectionImage(collectionId, i + 1, imagesToUpload[i]);
                }

                collection = await this.getById(collectionId);
            }

            if (response.data.success) {
                return collection;
            }
            throw new Error(response.data.message || 'Failed to update collection');
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to update collection');
        }
    }

    /**
     * Updates the cheque status for a cheque payment collection.
     */
    async updateChequeStatus(
        collectionId: string,
        status: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced',
        depositDate?: string
    ): Promise<Collection> {
        try {
            const response = await api.patch(API_ENDPOINTS.collections.CHEQUE_STATUS(collectionId), {
                chequeStatus: status.toLowerCase(),
                ...(depositDate && { depositDate }),
            });

            if (response.data.success) {
                return CollectionMapper.toFrontend(response.data.data);
            }
            throw new Error(response.data.message || 'Failed to update cheque status');
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to update cheque status');
        }
    }

    /**
     * Deletes a specific image from a collection.
     */
    async deleteCollectionImage(collectionId: string, imageNumber: number): Promise<boolean> {
        try {
            const response = await api.delete(API_ENDPOINTS.collections.IMAGE_SPECIFIC(collectionId, imageNumber));
            if (response.data.success) {
                return true;
            }
            throw new Error(response.data.message || 'Failed to delete image');
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to delete collection image');
        }
    }
}

// Create singleton instance
const collectionRepositoryInstance = new CollectionRepositoryClass();

// --- 6. CollectionRepository - Public API maintaining backward compatibility ---

export const CollectionRepository = {
    // Standard CRUD (from BaseRepository)
    getCollections: (params?: Record<string, string | number | undefined>) => collectionRepositoryInstance.getAll(params),
    getCollectionDetails: (collectionId: string) => collectionRepositoryInstance.getById(collectionId),
    deleteCollection: (collectionId: string) => collectionRepositoryInstance.delete(collectionId),
    bulkDeleteCollections: (collectionIds: string[]) => collectionRepositoryInstance.bulkDelete(collectionIds),

    // Entity-specific methods
    createCollection: (collectionData: NewCollectionData) => collectionRepositoryInstance.createCollectionWithImages(collectionData),
    updateCollection: (collectionId: string, updatedData: Partial<NewCollectionData>) =>
        collectionRepositoryInstance.updateCollectionWithImages(collectionId, updatedData),
    updateChequeStatus: (collectionId: string, status: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced', depositDate?: string) =>
        collectionRepositoryInstance.updateChequeStatus(collectionId, status, depositDate),
    uploadCollectionImage: (collectionId: string, imageNumber: number, file: File) =>
        collectionRepositoryInstance.uploadCollectionImage(collectionId, imageNumber, file),
    deleteCollectionImage: (collectionId: string, imageNumber: number) =>
        collectionRepositoryInstance.deleteCollectionImage(collectionId, imageNumber),

    // Bank names
    getBankNames: () => collectionRepositoryInstance.getBankNames(),
    createBankName: (name: string) => collectionRepositoryInstance.createBankName(name),
    updateBankName: (id: string, name: string) => collectionRepositoryInstance.updateBankName(id, name),
    deleteBankName: (id: string) => collectionRepositoryInstance.deleteBankName(id),
};

// --- 7. Clean Named Exports ---

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
    getBankNames,
    createBankName,
    updateBankName,
    deleteBankName,
} = CollectionRepository;

// --- 8. Constants Re-exports ---
export { PAYMENT_MODES, CHEQUE_STATUSES, PAYMENT_MODE_VALUES, CHEQUE_STATUS_VALUES } from '@/pages/CollectionPage/components/CollectionConstants';

export type PaymentMode = 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay';
export type ChequeStatus = 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';
