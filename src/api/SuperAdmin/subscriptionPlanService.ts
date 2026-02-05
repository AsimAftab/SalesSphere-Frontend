import api from '../api';
import { API_ENDPOINTS } from '../endpoints';
import { BaseRepository } from '../base';
import type { EndpointConfig } from '../base';
import { handleApiError } from '../errors';

// --- 1. Interface Definitions ---

export interface SubscriptionPlan {
    id: string;
    _id?: string; // For backward compatibility
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
    moduleFeatures?: Record<string, Record<string, boolean>>;
    isSystemPlan: boolean;
    isActive: boolean;
    organizationCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSubscriptionPlanData {
    name: string;
    tier: 'basic' | 'standard' | 'premium' | 'custom';
    description?: string;
    enabledModules?: string[];
    maxEmployees?: number;
    price?: {
        amount: number;
        currency: string;
        billingCycle: string;
    };
    moduleFeatures?: Record<string, Record<string, boolean>>;
    isSystemPlan?: boolean;
    isActive?: boolean;
    organizationId?: string; // For custom plans
}

export type UpdateSubscriptionPlanData = Partial<CreateSubscriptionPlanData>;

// --- 2. Backend API Interface (Raw Shape) ---

interface ApiSubscriptionPlan {
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
    moduleFeatures?: Record<string, Record<string, boolean>>;
    isSystemPlan: boolean;
    isActive: boolean;
    organizationCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

// --- 3. Mapper Logic ---

export class SubscriptionPlanMapper {
    static toFrontend(apiPlan: ApiSubscriptionPlan): SubscriptionPlan {
        return {
            id: apiPlan._id,
            _id: apiPlan._id, // Backward compatibility
            name: apiPlan.name,
            tier: apiPlan.tier,
            description: apiPlan.description,
            enabledModules: apiPlan.enabledModules || [],
            maxEmployees: apiPlan.maxEmployees,
            price: apiPlan.price,
            moduleFeatures: apiPlan.moduleFeatures,
            isSystemPlan: apiPlan.isSystemPlan,
            isActive: apiPlan.isActive,
            organizationCount: apiPlan.organizationCount,
            createdAt: apiPlan.createdAt,
            updatedAt: apiPlan.updatedAt,
        };
    }

    static toPayload(data: CreateSubscriptionPlanData | UpdateSubscriptionPlanData): Record<string, unknown> {
        return {
            ...(data.name && { name: data.name }),
            ...(data.tier && { tier: data.tier }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.enabledModules && { enabledModules: data.enabledModules }),
            ...(data.maxEmployees !== undefined && { maxEmployees: data.maxEmployees }),
            ...(data.price && { price: data.price }),
            ...(data.moduleFeatures && { moduleFeatures: data.moduleFeatures }),
            ...(data.isSystemPlan !== undefined && { isSystemPlan: data.isSystemPlan }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
            ...(data.organizationId && { organizationId: data.organizationId }),
        };
    }
}

// --- 4. Endpoint Configuration ---

const SUBSCRIPTION_PLAN_ENDPOINTS: EndpointConfig = {
    BASE: API_ENDPOINTS.subscriptions.PLANS,
    DETAIL: API_ENDPOINTS.subscriptions.PLAN_DETAIL,
};

// --- 5. SubscriptionPlanRepositoryClass - Extends BaseRepository ---

class SubscriptionPlanRepositoryClass extends BaseRepository<
    SubscriptionPlan,
    ApiSubscriptionPlan,
    CreateSubscriptionPlanData,
    UpdateSubscriptionPlanData
> {
    protected readonly endpoints = SUBSCRIPTION_PLAN_ENDPOINTS;

    protected mapToFrontend(apiData: ApiSubscriptionPlan): SubscriptionPlan {
        return SubscriptionPlanMapper.toFrontend(apiData);
    }

    protected mapToPayload(data: CreateSubscriptionPlanData | UpdateSubscriptionPlanData): Record<string, unknown> {
        return SubscriptionPlanMapper.toPayload(data);
    }

    /**
     * Create a custom plan for an organization
     * @route POST /api/v1/subscriptions/plans/custom
     */
    async createCustom(planData: CreateSubscriptionPlanData): Promise<SubscriptionPlan> {
        try {
            const payload = this.mapToPayload(planData);
            const response = await api.post(API_ENDPOINTS.subscriptions.PLANS_CUSTOM, payload);
            const item = this.extractSingleData(response.data);
            return this.mapToFrontend(item);
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to create custom plan');
        }
    }

    /**
     * Get all custom plans
     * @route GET /api/v1/subscriptions/plans/custom
     */
    async getCustomPlans(): Promise<SubscriptionPlan[]> {
        try {
            const response = await api.get(API_ENDPOINTS.subscriptions.PLANS_CUSTOM);
            const items = this.extractArrayData(response.data);
            return items.map((item) => this.mapToFrontend(item));
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to fetch custom plans');
        }
    }

    // Override base methods to add error handling
    async getAll(): Promise<SubscriptionPlan[]> {
        try {
            return await super.getAll();
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to fetch subscription plans');
        }
    }

    async getById(id: string): Promise<SubscriptionPlan> {
        try {
            return await super.getById(id);
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to fetch subscription plan');
        }
    }

    async create(data: CreateSubscriptionPlanData): Promise<SubscriptionPlan> {
        try {
            return await super.create(data);
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to create subscription plan');
        }
    }

    async update(id: string, data: UpdateSubscriptionPlanData): Promise<SubscriptionPlan> {
        try {
            return await super.update(id, data);
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to update subscription plan');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            return await super.delete(id);
        } catch (error: unknown) {
            throw handleApiError(error, 'Failed to delete subscription plan');
        }
    }
}

// Create singleton instance
const subscriptionPlanRepositoryInstance = new SubscriptionPlanRepositoryClass();

// --- 6. Public API - Backward Compatible Service Object ---

export const subscriptionPlanService = {
    /**
     * Get all available subscription plans
     */
    getAll: () => subscriptionPlanRepositoryInstance.getAll(),

    /**
     * Get a single plan by ID
     */
    getById: (planId: string) => subscriptionPlanRepositoryInstance.getById(planId),

    /**
     * Create a new subscription plan
     */
    create: (planData: CreateSubscriptionPlanData) => subscriptionPlanRepositoryInstance.create(planData),

    /**
     * Update a subscription plan
     */
    update: (planId: string, planData: UpdateSubscriptionPlanData) =>
        subscriptionPlanRepositoryInstance.update(planId, planData),

    /**
     * Delete a subscription plan
     */
    delete: (planId: string) => subscriptionPlanRepositoryInstance.delete(planId),

    /**
     * Create a custom plan for an organization
     */
    createCustom: (planData: CreateSubscriptionPlanData) =>
        subscriptionPlanRepositoryInstance.createCustom(planData),

    /**
     * Get all custom plans
     */
    getCustomPlans: () => subscriptionPlanRepositoryInstance.getCustomPlans(),
};

// --- 7. Named Exports ---

export const {
    getAll: getAllSubscriptionPlans,
    getById: getSubscriptionPlanById,
    create: createSubscriptionPlan,
    update: updateSubscriptionPlan,
    delete: deleteSubscriptionPlan,
    createCustom: createCustomPlan,
    getCustomPlans,
} = subscriptionPlanService;

export default subscriptionPlanService;
