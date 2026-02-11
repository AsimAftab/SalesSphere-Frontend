import api from '../api';
import { API_ENDPOINTS } from '../endpoints';
import { handleApiError } from '../errors';
import type { SubscribersResponse } from '@/pages/SuperAdminPages/Newsletter/types';
import type { NewsletterPayload } from '@/components/modals/SuperAdmin/SendNewsletterModal';

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

/**
 * Admin Newsletter Service
 * Requires authentication
 */
export const newsletterAdminService = {
    /**
     * Get all subscribers with optional filters
     * @route GET /newsletter/subscribers
     */
    getSubscribers: async (params?: { isActive?: boolean; search?: string }) => {
        try {
            return await api.get<SubscribersResponse>(API_ENDPOINTS.newsletter.SUBSCRIBERS, { params });
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to fetch newsletter subscribers');
        }
    },

    /**
     * Unsubscribe a user by email
     * @route GET /newsletter/unsubscribe/:email
     */
    unsubscribe: async (email: string) => {
        try {
            return await api.get<ApiResponse<null>>(API_ENDPOINTS.newsletter.UNSUBSCRIBE(email));
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to unsubscribe user');
        }
    },

    /**
     * Resubscribe/reactivate a user by email (Admin only)
     * @route POST /newsletter/resubscribe/:email
     */
    resubscribe: async (email: string) => {
        try {
            return await api.post<ApiResponse<null>>(API_ENDPOINTS.newsletter.RESUBSCRIBE(email));
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to resubscribe user');
        }
    },

    /**
     * Send newsletter to subscribers
     * @route POST /newsletter/send
     */
    sendNewsletter: async (payload: NewsletterPayload) => {
        try {
            return await api.post<ApiResponse<{ sentCount: number }>>(API_ENDPOINTS.newsletter.SEND, payload);
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to send newsletter');
        }
    },
};

export default newsletterAdminService;
