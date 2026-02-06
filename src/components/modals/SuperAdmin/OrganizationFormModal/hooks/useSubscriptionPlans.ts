import { useState, useEffect, useMemo } from 'react';
import { subscriptionPlanService } from '@/api/SuperAdmin/subscriptionPlanService';

export interface PlanOption {
    label: string;
    value: string;
}

export interface PlanData {
    id: string;
    name: string;
    maxEmployees: number;
    tier: string;
    isSystemPlan: boolean;
}

export const useSubscriptionPlans = () => {
    const [plansData, setPlansData] = useState<PlanData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);

                // Fetch both standard plans and custom plans in parallel
                const [allPlans, customPlans] = await Promise.all([
                    subscriptionPlanService.getAll(),
                    subscriptionPlanService.getCustomPlans().catch(() => []) // Gracefully handle if custom endpoint fails
                ]);

                // Combine and deduplicate plans (custom plans might already be in allPlans)
                const planMap = new Map<string, PlanData>();

                // Process all plans first
                if (allPlans && allPlans.length > 0) {
                    allPlans.forEach(plan => {
                        const planId = plan.id || plan._id;
                        if (planId) {
                            planMap.set(planId, {
                                id: planId,
                                name: plan.name,
                                maxEmployees: plan.maxEmployees || 0,
                                tier: plan.tier,
                                isSystemPlan: plan.isSystemPlan,
                            });
                        }
                    });
                }

                // Add custom plans (these will override if already present)
                if (customPlans && customPlans.length > 0) {
                    customPlans.forEach(plan => {
                        const planId = plan.id || plan._id;
                        if (planId) {
                            planMap.set(planId, {
                                id: planId,
                                name: plan.name,
                                maxEmployees: plan.maxEmployees || 0,
                                tier: plan.tier || 'custom', // Ensure tier is set to custom
                                isSystemPlan: plan.isSystemPlan ?? false,
                            });
                        }
                    });
                }

                setPlansData(Array.from(planMap.values()));
            } catch (error) {
                console.error("Failed to fetch subscription plans", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    // Separate options for standard/system plans (non-custom tiers OR isSystemPlan: true)
    const standardPlanOptions = useMemo<PlanOption[]>(() => {
        return plansData
            .filter(plan => plan.tier !== 'custom' && plan.isSystemPlan !== false)
            .map(plan => ({
                label: plan.name,
                value: plan.id,
            }));
    }, [plansData]);

    // Separate options for custom plans (tier === 'custom' OR isSystemPlan === false)
    const customPlanOptions = useMemo<PlanOption[]>(() => {
        return plansData
            .filter(plan => plan.tier === 'custom' || plan.isSystemPlan === false)
            .map(plan => ({
                label: plan.name,
                value: plan.id,
            }));
    }, [plansData]);

    // Combined options (for backward compatibility if needed)
    const planOptions = useMemo<PlanOption[]>(() => {
        return plansData.map(plan => ({
            label: plan.tier === 'custom' || !plan.isSystemPlan ? `${plan.name} (Custom)` : plan.name,
            value: plan.tier === 'custom' || !plan.isSystemPlan ? `CUST:${plan.id}` : `STD:${plan.id}`,
        }));
    }, [plansData]);

    // Helper to get max employees for a specific plan
    const getPlanMaxEmployees = (planId: string): number | null => {
        const plan = plansData.find(p => p.id === planId);
        return plan ? plan.maxEmployees : null;
    };

    return {
        planOptions,
        standardPlanOptions,
        customPlanOptions,
        plansData,
        loading,
        getPlanMaxEmployees
    };
};
