import api from '../api';
import { API_ENDPOINTS } from '../endpoints';
import { handleApiError } from '../errors';

/* -------------------------
    TYPES & INTERFACES
------------------------- */

export type PaymentMode = 'cash' | 'qr_pay' | 'cheque' | 'bank_transfer' | 'others';

// Image with slot information for proper tracking
export interface PaymentProofImage {
  imageUrl: string;
  imageNumber: 1 | 2;
}

export interface OrganizationPayment {
  _id: string;
  organizationId: string;
  organizationName: string;
  ownerName: string;
  ownerAddress: string;
  paymentMode: PaymentMode;
  otherPaymentMode?: string;
  amount: number;
  dateReceived: string;
  receivedBy: string | { _id: string; name: string; email: string };
  proofImages: PaymentProofImage[];
  description?: string;
  currentPlanName?: string;
  upgradedPlanName?: string;
  createdBy: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

// Internal API response type (before transformation)
// API may return images in different formats
interface ApiProofImage {
  imageUrl?: string;
  url?: string;  // Alternative property name
  imageNumber?: number;
}

interface ApiOrganizationPayment {
  _id: string;
  organizationId: string;
  organizationName: string;
  ownerName: string;
  ownerAddress: string;
  paymentMode: PaymentMode;
  otherPaymentMode?: string;
  amount: number;
  dateReceived: string;
  receivedBy: string | { _id: string; name: string; email: string };
  proofImages: Array<string | ApiProofImage> | null | undefined;
  description?: string;
  currentPlanName?: string;
  upgradedPlanName?: string;
  createdBy: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

/**
 * Extract URL from various possible formats
 */
const extractImageUrl = (img: string | ApiProofImage): string => {
  if (typeof img === 'string') {
    return img;
  }
  // Check for both imageUrl and url properties
  return img.imageUrl || img.url || '';
};

/**
 * Transform API response to frontend format
 * Handles proofImages which may be objects or strings
 * Preserves imageNumber for proper slot tracking
 */
const transformPayment = (apiPayment: ApiOrganizationPayment): OrganizationPayment => ({
  ...apiPayment,
  proofImages: Array.isArray(apiPayment.proofImages)
    ? apiPayment.proofImages
        .map((img, index): PaymentProofImage => {
          const imageUrl = extractImageUrl(img);
          const imageNumber = (typeof img === 'object' && img.imageNumber)
            ? img.imageNumber
            : index + 1;
          return {
            imageUrl,
            imageNumber: imageNumber as 1 | 2,
          };
        })
        .filter(img => img.imageUrl) // Remove any with empty URLs
    : [],
});

export interface CreatePaymentRequest {
  paymentMode: PaymentMode;
  otherPaymentMode?: string;
  amount: number;
  dateReceived: string | Date;
  receivedBy: string;
  description?: string;
  upgradedPlanName?: string;
}

export interface UpdatePaymentRequest {
  paymentMode?: PaymentMode;
  otherPaymentMode?: string;
  amount?: number;
  dateReceived?: string | Date;
  receivedBy?: string;
  description?: string;
  upgradedPlanName?: string;
}

interface ApiPaymentListResponse {
  status: string;
  count: number;
  data: ApiOrganizationPayment[];
}

interface ApiPaymentResponse {
  status: string;
  message: string;
  data: ApiOrganizationPayment;
}

export interface ImageUploadResponse {
  status: string;
  message: string;
  data: {
    imageNumber: number;
    imageUrl: string;
  };
}

/* -------------------------
    API SERVICES
------------------------- */

/**
 * Create a new payment record for an organization
 * @param orgId - Organization ID
 * @param paymentData - Payment details
 */
export const createPayment = async (
  orgId: string,
  paymentData: CreatePaymentRequest
): Promise<OrganizationPayment> => {
  try {
    const { data } = await api.post<ApiPaymentResponse>(
      API_ENDPOINTS.organizations.PAYMENTS(orgId),
      {
        ...paymentData,
        dateReceived: paymentData.dateReceived instanceof Date
          ? paymentData.dateReceived.toISOString()
          : paymentData.dateReceived,
      }
    );
    return transformPayment(data.data);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to create payment record');
  }
};

/**
 * Fetch all payments for an organization
 * @param orgId - Organization ID
 * @param params - Optional query parameters (page, limit, sort)
 */
export const fetchOrgPayments = async (
  orgId: string,
  params?: { page?: number; limit?: number; sort?: string }
): Promise<OrganizationPayment[]> => {
  try {
    const { data } = await api.get<ApiPaymentListResponse>(
      API_ENDPOINTS.organizations.PAYMENTS(orgId),
      { params }
    );
    return (data.data || []).map(transformPayment);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch payments');
  }
};

/**
 * Get a specific payment by ID
 * @param orgId - Organization ID
 * @param paymentId - Payment ID
 */
export const getPaymentById = async (
  orgId: string,
  paymentId: string
): Promise<OrganizationPayment> => {
  try {
    const { data } = await api.get<ApiPaymentResponse>(
      API_ENDPOINTS.organizations.PAYMENT_DETAIL(orgId, paymentId)
    );
    return transformPayment(data.data);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to fetch payment details');
  }
};

/**
 * Update a payment record
 * @param orgId - Organization ID
 * @param paymentId - Payment ID
 * @param updates - Fields to update
 */
export const updatePayment = async (
  orgId: string,
  paymentId: string,
  updates: UpdatePaymentRequest
): Promise<OrganizationPayment> => {
  try {
    const payload = {
      ...updates,
      dateReceived: updates.dateReceived instanceof Date
        ? updates.dateReceived.toISOString()
        : updates.dateReceived,
    };

    const { data } = await api.put<ApiPaymentResponse>(
      API_ENDPOINTS.organizations.PAYMENT_DETAIL(orgId, paymentId),
      payload
    );
    return transformPayment(data.data);
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to update payment');
  }
};

/**
 * Delete a payment record
 * @param orgId - Organization ID
 * @param paymentId - Payment ID
 */
export const deletePayment = async (
  orgId: string,
  paymentId: string
): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.organizations.PAYMENT_DETAIL(orgId, paymentId));
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to delete payment');
  }
};

/**
 * Upload a proof image for a payment (max 2 images, 5MB each)
 * @param orgId - Organization ID
 * @param paymentId - Payment ID
 * @param file - Image file to upload
 * @param imageNumber - Image slot number (1 or 2)
 */
export const uploadPaymentImage = async (
  orgId: string,
  paymentId: string,
  file: File,
  imageNumber: 1 | 2
): Promise<ImageUploadResponse['data']> => {
  try {
    const formData = new FormData();
    formData.append('proofImage', file);
    formData.append('imageNumber', String(imageNumber));

    const { data } = await api.post<ImageUploadResponse>(
      API_ENDPOINTS.organizations.PAYMENT_IMAGES(orgId, paymentId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data;
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to upload proof image');
  }
};

/**
 * Delete a specific proof image from a payment
 * @param orgId - Organization ID
 * @param paymentId - Payment ID
 * @param imageNumber - Image number (1 or 2)
 */
export const deletePaymentImage = async (
  orgId: string,
  paymentId: string,
  imageNumber: 1 | 2
): Promise<void> => {
  try {
    await api.delete(
      API_ENDPOINTS.organizations.PAYMENT_IMAGE_DETAIL(orgId, paymentId, imageNumber)
    );
  } catch (error: unknown) {
    throw handleApiError(error, 'Failed to delete proof image');
  }
};

/* -------------------------
    EXPORT DEFAULT
------------------------- */

const organizationPaymentService = {
  createPayment,
  fetchOrgPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  uploadPaymentImage,
  deletePaymentImage,
};

export default organizationPaymentService;
