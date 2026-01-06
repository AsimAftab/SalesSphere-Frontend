import api from '../api';

// --- Types ---
export interface SubscriptionPlan {
    _id: string;
    name: string;
    tier: 'basic' | 'standard' | 'premium' | 'custom';
    description: string;
    enabledModules: string[];
    maxEmployees: number;
    price: {
        amount: number;
        currency: string;
        billingCycle: string;
    };
    isSystemPlan: boolean;
    isActive: boolean;
}

interface ApiResponse<T> {
    status: string;
    data: T;
    count?: number;
}

// --- Subscription Plan Service ---
export const subscriptionPlanService = {
    /**
     * Get all available subscription plans
     * @route GET /api/v1/subscriptions/plans
     */
    getAll: () =>
        api.get<ApiResponse<SubscriptionPlan[]>>('/subscriptions/plans'),

    /**
     * Get a single plan by ID
     * @route GET /api/v1/subscriptions/plans/:id
     */
    getById: (planId: string) =>
        api.get<ApiResponse<SubscriptionPlan>>(`/subscriptions/plans/${planId}`),
};

export default subscriptionPlanService;
