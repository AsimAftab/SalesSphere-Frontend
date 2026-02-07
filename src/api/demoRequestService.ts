import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';
import { fetchCsrfToken } from './authService';

export interface DemoRequestPayload {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  country: string;
  preferredDate: Date;
  message?: string;
}

interface DemoRequestResponse {
  status: string;
  message: string;
  data?: {
    id: string;
    createdAt: string;
  };
}

/**
 * Public demo request service (no auth required)
 */
export const demoRequestService = {
  /**
   * Submit a demo request
   * @route POST /auth/schedule-demo
   */
  submit: async (payload: DemoRequestPayload): Promise<DemoRequestResponse> => {
    // Ensure CSRF token is available for public endpoint
    await fetchCsrfToken();

    try {
      const response = await api.post<DemoRequestResponse>(
        API_ENDPOINTS.demoRequests.SUBMIT,
        {
          fullName: payload.name,
          email: payload.email,
          phone: payload.phoneNumber,
          company: payload.companyName,
          country: payload.country,
          preferredDate: payload.preferredDate.toLocaleDateString('en-CA'),
          message: payload.message,
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to submit demo request');
    }
  },
};

export default demoRequestService;
