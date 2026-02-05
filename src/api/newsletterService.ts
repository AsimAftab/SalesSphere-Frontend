import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';
import { fetchCsrfToken } from './authService';

interface SubscribeResponse {
    status: string;
    message: string;
}

/**
 * Public newsletter service (no auth required for subscribe)
 */
export const newsletterService = {
    /**
     * Subscribe to the newsletter
     * @route POST /newsletter/subscribe
     */
    subscribe: async (email: string, source: string = 'website') => {
        // Ensure CSRF token is available for public endpoint
        await fetchCsrfToken();

        try {
            return await api.post<SubscribeResponse>(API_ENDPOINTS.newsletter.SUBSCRIBE, { email, source });
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to subscribe to newsletter');
        }
    },
};

export default newsletterService;
