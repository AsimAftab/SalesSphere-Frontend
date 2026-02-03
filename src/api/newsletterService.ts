import api from './api';
import { API_ENDPOINTS } from './endpoints';

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
    subscribe: (email: string, source: string = 'website') =>
        api.post<SubscribeResponse>(API_ENDPOINTS.newsletter.SUBSCRIBE, { email, source }),
};

export default newsletterService;
