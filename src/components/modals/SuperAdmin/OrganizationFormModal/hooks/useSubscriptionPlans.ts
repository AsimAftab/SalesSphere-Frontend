import { useState, useEffect } from 'react';
import { subscriptionPlanService } from '@/api/SuperAdmin/subscriptionPlanService';

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
                const allPlans = await subscriptionPlanService.getAll();
                if (allPlans && allPlans.length > 0) {
                    const options = allPlans.map(plan => {
                        const isCustom = plan.tier === 'custom';
                        const planId = plan.id || plan._id;
                        return {
                            label: isCustom ? `${plan.name} (Custom)` : plan.name,
                            // Prefix to distinguish types in the single dropdown
                            value: isCustom ? `CUST:${planId}` : `STD:${planId}`
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
