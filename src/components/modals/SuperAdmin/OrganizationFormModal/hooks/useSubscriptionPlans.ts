import { useState, useEffect } from 'react';
import { subscriptionPlanService } from '@/api/SuperAdmin/subscriptionPlanService';
import type { SubscriptionPlan } from '@/api/SuperAdmin/subscriptionPlanService';

export interface PlanOption {
    label: string;
    value: string;
}

export const useSubscriptionPlans = () => {
    const [planOptions, setPlanOptions] = useState<PlanOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const response = await subscriptionPlanService.getAll();
                if (response.data && response.data.data) {
                    const allPlans: SubscriptionPlan[] = response.data.data;

                    const options = allPlans.map(plan => {
                        const isCustom = plan.tier === 'custom';
                        return {
                            label: isCustom ? `${plan.name} (Custom)` : plan.name,
                            // Prefix to distinguish types in the single dropdown
                            value: isCustom ? `CUST:${plan._id}` : `STD:${plan._id}`
                        };
                    });

                    setPlanOptions(options);
                }
            } catch (error) {
                console.error("Failed to fetch subscription plans", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    return { planOptions, loading };
};
