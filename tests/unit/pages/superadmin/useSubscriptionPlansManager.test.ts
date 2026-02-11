import { describe, it, expect } from 'vitest';

// Extracted logic from useSubscriptionPlansManager

interface SubscriptionPlan {
    _id: string;
    name: string;
    tier: string;
    isSystemPlan: boolean;
    isActive: boolean;
}

// Tier sorting logic
function sortSystemPlansByTier(plans: SubscriptionPlan[]): SubscriptionPlan[] {
    const tierOrder: Record<string, number> = { basic: 0, standard: 1, premium: 2 };
    return plans
        .filter(p => p.isSystemPlan)
        .sort((a, b) => (tierOrder[a.tier] ?? 3) - (tierOrder[b.tier] ?? 3));
}

// Search filtering for custom plans
function filterCustomPlans(plans: SubscriptionPlan[], searchQuery: string): SubscriptionPlan[] {
    if (!searchQuery.trim()) return plans;
    const q = searchQuery.toLowerCase();
    return plans.filter(p => p.name.toLowerCase().includes(q));
}

// Pagination logic
function paginatePlans(
    plans: SubscriptionPlan[],
    currentPage: number,
    itemsPerPage: number
): SubscriptionPlan[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return plans.slice(startIndex, startIndex + itemsPerPage);
}

// Test data
const mockSystemPlans: SubscriptionPlan[] = [
    { _id: '1', name: 'Premium Plan', tier: 'premium', isSystemPlan: true, isActive: true },
    { _id: '2', name: 'Basic Plan', tier: 'basic', isSystemPlan: true, isActive: true },
    { _id: '3', name: 'Standard Plan', tier: 'standard', isSystemPlan: true, isActive: true },
];

const mockCustomPlans: SubscriptionPlan[] = [
    { _id: '4', name: 'Enterprise Special', tier: 'custom', isSystemPlan: false, isActive: true },
    { _id: '5', name: 'Startup Pack', tier: 'custom', isSystemPlan: false, isActive: true },
    { _id: '6', name: 'Agency Plan', tier: 'custom', isSystemPlan: false, isActive: true },
    { _id: '7', name: 'Enterprise Plus', tier: 'custom', isSystemPlan: false, isActive: false },
    { _id: '8', name: 'Small Business', tier: 'custom', isSystemPlan: false, isActive: true },
    { _id: '9', name: 'Pro Team', tier: 'custom', isSystemPlan: false, isActive: true },
    { _id: '10', name: 'Growth Plan', tier: 'custom', isSystemPlan: false, isActive: true },
];

describe('Subscription Plans Manager - Tier Sorting', () => {
    it('should sort system plans by tier order: basic, standard, premium', () => {
        const result = sortSystemPlansByTier(mockSystemPlans);
        expect(result).toHaveLength(3);
        expect(result[0].tier).toBe('basic');
        expect(result[1].tier).toBe('standard');
        expect(result[2].tier).toBe('premium');
    });

    it('should only include system plans', () => {
        const mixedPlans = [...mockSystemPlans, ...mockCustomPlans];
        const result = sortSystemPlansByTier(mixedPlans);
        expect(result).toHaveLength(3);
        expect(result.every(p => p.isSystemPlan)).toBe(true);
    });

    it('should handle empty array', () => {
        const result = sortSystemPlansByTier([]);
        expect(result).toHaveLength(0);
    });

    it('should handle unknown tier by placing at end', () => {
        const plansWithUnknown: SubscriptionPlan[] = [
            { _id: '1', name: 'Unknown Plan', tier: 'unknown', isSystemPlan: true, isActive: true },
            { _id: '2', name: 'Basic Plan', tier: 'basic', isSystemPlan: true, isActive: true },
        ];
        const result = sortSystemPlansByTier(plansWithUnknown);
        expect(result[0].tier).toBe('basic');
        expect(result[1].tier).toBe('unknown');
    });

    it('should handle single plan', () => {
        const singlePlan: SubscriptionPlan[] = [
            { _id: '1', name: 'Basic Plan', tier: 'basic', isSystemPlan: true, isActive: true },
        ];
        const result = sortSystemPlansByTier(singlePlan);
        expect(result).toHaveLength(1);
        expect(result[0].tier).toBe('basic');
    });
});

describe('Subscription Plans Manager - Search Filter', () => {
    it('should return all plans when search query is empty', () => {
        const result = filterCustomPlans(mockCustomPlans, '');
        expect(result).toHaveLength(7);
    });

    it('should return all plans when search query is whitespace', () => {
        const result = filterCustomPlans(mockCustomPlans, '   ');
        expect(result).toHaveLength(7);
    });

    it('should filter plans by name', () => {
        const result = filterCustomPlans(mockCustomPlans, 'Enterprise');
        expect(result).toHaveLength(2);
        expect(result.every(p => p.name.includes('Enterprise'))).toBe(true);
    });

    it('should be case insensitive', () => {
        const result = filterCustomPlans(mockCustomPlans, 'STARTUP');
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Startup Pack');
    });

    it('should handle partial matches', () => {
        const result = filterCustomPlans(mockCustomPlans, 'Plan');
        // Agency Plan, Growth Plan contain "Plan"
        expect(result).toHaveLength(2);
    });

    it('should return empty array when no matches', () => {
        const result = filterCustomPlans(mockCustomPlans, 'NonExistent');
        expect(result).toHaveLength(0);
    });

    it('should handle special characters in search', () => {
        const result = filterCustomPlans(mockCustomPlans, 'Plan+');
        expect(result).toHaveLength(0);
    });
});

describe('Subscription Plans Manager - Pagination', () => {
    it('should return first page correctly', () => {
        const result = paginatePlans(mockCustomPlans, 1, 3);
        expect(result).toHaveLength(3);
        expect(result[0]._id).toBe('4');
        expect(result[2]._id).toBe('6');
    });

    it('should return second page correctly', () => {
        const result = paginatePlans(mockCustomPlans, 2, 3);
        expect(result).toHaveLength(3);
        expect(result[0]._id).toBe('7');
        expect(result[2]._id).toBe('9');
    });

    it('should handle last page with fewer items', () => {
        const result = paginatePlans(mockCustomPlans, 3, 3);
        expect(result).toHaveLength(1);
        expect(result[0]._id).toBe('10');
    });

    it('should return empty array for page beyond data', () => {
        const result = paginatePlans(mockCustomPlans, 10, 3);
        expect(result).toHaveLength(0);
    });

    it('should handle itemsPerPage of 6 (default)', () => {
        const result = paginatePlans(mockCustomPlans, 1, 6);
        expect(result).toHaveLength(6);
    });

    it('should return remaining items on second page with itemsPerPage of 6', () => {
        const result = paginatePlans(mockCustomPlans, 2, 6);
        expect(result).toHaveLength(1);
    });

    it('should handle empty array', () => {
        const result = paginatePlans([], 1, 6);
        expect(result).toHaveLength(0);
    });
});

describe('Subscription Plans Manager - Combined Operations', () => {
    it('should filter then paginate correctly', () => {
        // First filter by "Enterprise"
        const filtered = filterCustomPlans(mockCustomPlans, 'Enterprise');
        expect(filtered).toHaveLength(2);

        // Then paginate
        const paginated = paginatePlans(filtered, 1, 1);
        expect(paginated).toHaveLength(1);
    });

    it('should handle filter with no results then paginate', () => {
        const filtered = filterCustomPlans(mockCustomPlans, 'xyz');
        expect(filtered).toHaveLength(0);

        const paginated = paginatePlans(filtered, 1, 6);
        expect(paginated).toHaveLength(0);
    });
});
