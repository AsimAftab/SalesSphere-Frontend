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

    /**
     * Create a new subscription plan
     * @route POST /api/v1/subscriptions/plans
     */
    create: (planData: Partial<SubscriptionPlan>) =>
        api.post<ApiResponse<SubscriptionPlan>>('/subscriptions/plans', planData),

    /**
     * Update a subscription plan
     * @route PUT /api/v1/subscriptions/plans/:id
     */
    update: (planId: string, planData: Partial<SubscriptionPlan>) =>
        api.put<ApiResponse<SubscriptionPlan>>(`/subscriptions/plans/${planId}`, planData),

    /**
     * Delete a subscription plan
     * @route DELETE /api/v1/subscriptions/plans/:id
     */
    delete: (planId: string) =>
        api.delete<ApiResponse<null>>(`/subscriptions/plans/${planId}`),

    /**
     * Create a custom plan for an organization
     * @route POST /api/v1/subscriptions/plans/custom
     */
    createCustom: (planData: Partial<SubscriptionPlan> & { organizationId?: string }) =>
        api.post<ApiResponse<SubscriptionPlan>>('/subscriptions/plans/custom', planData),
};

export default subscriptionPlanService;
