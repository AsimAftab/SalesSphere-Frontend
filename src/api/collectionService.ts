import api from './api';

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
// Update interface
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
    images?: File[]; // Added support for file uploads
}

/**
 * Bulk Delete Result
 */
export interface BulkDeleteResult {
    success: number;
    failed: number;
    errors: string[];
}

// --- 2. Internal API Types ---

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
 * Transforms API response data to frontend Collection domain model.
 * Handles field name mapping, enum normalization, and date formatting.
 */
class CollectionMapper {
    /**
     * Converts a raw API collection object to the frontend Collection type.
     * @param apiCollection - Raw collection data from the backend API
     * @returns Normalized Collection object for frontend consumption
     */
    static toFrontend(apiCollection: ApiCollectionResponse): Collection {
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
            partyId: typeof apiCollection.party === 'object' ? apiCollection.party?._id : (apiCollection.party || ''),
            partyName: (typeof apiCollection.party === 'object' ? apiCollection.party?.partyName : undefined) || 'Unknown Party',
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
            createdAt: apiCollection.createdAt || '',
            updatedAt: apiCollection.updatedAt ? new Date(apiCollection.updatedAt).toLocaleDateString('en-CA') : '',

            // Optional
            notes: apiCollection.description || apiCollection.notes,
            images: apiCollection.images || [],
        };
    }

    /**
     * Converts frontend form data to backend API payload format.
     * @param collectionData - Partial collection data from the form
     * @returns API-compatible payload object
     */
    static toApiPayload(collectionData: Partial<NewCollectionData>): Record<string, string | number | undefined> {
        const payload: Record<string, string | number | undefined> = {};

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

/**
 * Fetches all collections for the current organization.
 * @param params - Optional query parameters for filtering/pagination
 * @returns Array of Collection objects
 */
export async function getCollections(params?: Record<string, string | number | undefined>): Promise<Collection[]> {
    const response = await api.get(ENDPOINTS.BASE, { params });

    if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map(CollectionMapper.toFrontend);
    }
    return [];
}

/**
 * Fetches detailed information for a specific collection.
 * @param collectionId - The unique identifier of the collection
 * @returns The complete Collection object
 * @throws Error if collection is not found
 */
export async function getCollectionDetails(collectionId: string): Promise<Collection> {
    const response = await api.get(ENDPOINTS.DETAIL(collectionId));
    if (!response.data.success) {
        throw new Error('Collection not found');
    }
    return CollectionMapper.toFrontend(response.data.data);
}

/**
 * Uploads an image to a collection's image slot.
 * @param collectionId - The collection to upload the image to
 * @param imageNumber - The image slot number (1 or 2)
 * @param file - The image file to upload
 * @returns The updated image data from the server
 * @throws Error if upload fails
 */
export async function uploadCollectionImage(collectionId: string, imageNumber: number, file: File): Promise<{ images?: string[] }> {
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
}

/**
 * Creates a new collection with optional image uploads.
 * Images are uploaded sequentially to prevent backend race conditions.
 * @param collectionData - The collection data including optional images
 * @returns The created Collection object with all fields populated
 * @throws Error if creation or image upload fails
 */
export async function createCollection(collectionData: NewCollectionData): Promise<Collection> {
    const payload = CollectionMapper.toApiPayload(collectionData);
    // 1. Create the collection record
    const response = await api.post(ENDPOINTS.BASE, payload);
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create collection');
    }

    let collection = CollectionMapper.toFrontend(response.data.data);

    // 2. Upload images if present
    if (collectionData.images && collectionData.images.length > 0) {
        const imagesToUpload = collectionData.images.slice(0, 2);

        for (let i = 0; i < imagesToUpload.length; i++) {
            await uploadCollectionImage(
                collection.id,
                i + 1,
                imagesToUpload[i]
            );
        }

        // Fetch fresh details with images
        collection = await getCollectionDetails(collection.id);
    }

    return collection;
}

/**
 * Updates an existing collection with optional new image uploads.
 * Images are uploaded sequentially to prevent backend race conditions.
 * @param collectionId - The ID of the collection to update
 * @param updatedData - Partial collection data with fields to update
 * @returns The updated Collection object
 * @throws Error if update or image upload fails
 */
export async function updateCollection(collectionId: string, updatedData: Partial<NewCollectionData>): Promise<Collection> {
    const payload = CollectionMapper.toApiPayload(updatedData);
    const response = await api.put(ENDPOINTS.DETAIL(collectionId), payload);

    let collection = CollectionMapper.toFrontend(response.data.data);

    // Upload images if present (sequential)
    if (updatedData.images && updatedData.images.length > 0) {
        const imagesToUpload = updatedData.images.slice(0, 2);

        for (let i = 0; i < imagesToUpload.length; i++) {
            await uploadCollectionImage(
                collectionId,
                i + 1,
                imagesToUpload[i]
            );
        }

        // Fetch fresh details with images
        collection = await getCollectionDetails(collectionId);
    }

    if (response.data.success) {
        return collection;
    }
    throw new Error(response.data.message || 'Failed to update collection');
}

/**
 * Updates the cheque status for a cheque payment collection.
 * @param collectionId - The ID of the collection
 * @param status - The new cheque status
 * @param depositDate - Optional deposit date for 'Deposited' status
 * @returns The updated Collection object
 * @throws Error if update fails
 */
export async function updateChequeStatus(
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
}

/**
 * Deletes a specific image from a collection.
 * @param collectionId - The ID of the collection
 * @param imageNumber - The image slot number to delete (1 or 2)
 * @returns true if deletion was successful
 * @throws Error if deletion fails
 */
export async function deleteCollectionImage(collectionId: string, imageNumber: number): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.IMAGE_SPECIFIC(collectionId, imageNumber));
    if (response.data.success) {
        return true;
    }
    throw new Error(response.data.message || 'Failed to delete image');
}

/**
 * Permanently deletes a collection.
 * @param collectionId - The ID of the collection to delete
 * @returns true if deletion was successful
 */
export async function deleteCollection(collectionId: string): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.DETAIL(collectionId));
    return response.data.success;
}

/**
 * Deletes multiple collections in a single operation.
 * @param collectionIds - Array of collection IDs to delete
 * @returns true if bulk deletion was successful
 */
export async function bulkDeleteCollections(collectionIds: string[]): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.BULK_DELETE, {
        data: { ids: collectionIds }
    });
    return response.data.success;
}

export const CollectionRepository = {
    getCollections,
    getCollectionDetails,
    createCollection,
    updateCollection,
    updateChequeStatus,
    uploadCollectionImage,
    deleteCollectionImage,
    deleteCollection,
    bulkDeleteCollections,
};

// --- 5. Clean Named Exports ---
// (Removed redundant destructuring as functions are exported directly)


// --- 6. Constants (Re-exported from CollectionConstants for backward compatibility) ---
export { PAYMENT_MODES, CHEQUE_STATUSES, PAYMENT_MODE_VALUES, CHEQUE_STATUS_VALUES } from '../Pages/CollectionPage/components/CollectionConstants';

export type PaymentMode = 'Cash' | 'Cheque' | 'Bank Transfer' | 'QR Pay';
export type ChequeStatus = 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';

