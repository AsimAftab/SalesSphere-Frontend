import api from '../api';
import { API_ENDPOINTS } from '../endpoints';
import type { SubscribersResponse } from '@/pages/SuperAdmin/newsletter/types';
import type { NewsletterPayload } from '@/components/modals/superadmin/SendNewsletterModal';

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
    getSubscribers: (params?: { isActive?: boolean; search?: string }) =>
        api.get<SubscribersResponse>(API_ENDPOINTS.newsletter.SUBSCRIBERS, { params }),

    /**
     * Unsubscribe a user by email
     * @route GET /newsletter/unsubscribe/:email
     */
    unsubscribe: (email: string) =>
        api.get<ApiResponse<null>>(API_ENDPOINTS.newsletter.UNSUBSCRIBE(email)),

    /**
     * Resubscribe/reactivate a user by email (Admin only)
     * @route POST /newsletter/resubscribe/:email
     */
    resubscribe: (email: string) =>
        api.post<ApiResponse<null>>(API_ENDPOINTS.newsletter.RESUBSCRIBE(email)),

    /**
     * Send newsletter to subscribers
     * @route POST /newsletter/send
     */
    sendNewsletter: (payload: NewsletterPayload) =>
        api.post<ApiResponse<{ sentCount: number }>>(API_ENDPOINTS.newsletter.SEND, payload),
};

export default newsletterAdminService;
