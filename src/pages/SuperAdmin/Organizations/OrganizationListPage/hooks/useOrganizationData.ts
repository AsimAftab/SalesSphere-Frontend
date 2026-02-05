import { useState, useEffect, useCallback } from 'react';
import { fetchAllOrganizations, type Organization } from '@/api/SuperAdmin/organizationService';
import { subscriptionPlanService } from '@/api/SuperAdmin/subscriptionPlanService';
import { toast } from 'react-hot-toast';

export const useOrganizationData = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [customPlans, setCustomPlans] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrganizations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch organizations with userCount from /organizations/all
            const mappedOrgs = await fetchAllOrganizations();

            setOrganizations(mappedOrgs);

            // Fetch Subscription Plans for filters
            try {
                const allPlans = await subscriptionPlanService.getAll();
                // Filter for plans that are clearly identified as Custom
                const plans = allPlans
                    .filter((p) => p.tier === 'custom' || !p.isSystemPlan)
                    .map((p) => p.name);
                setCustomPlans([...new Set(plans)] as string[]);
            } catch (planErr) {
                console.error("Failed to fetch subscription plans:", planErr);
                // Non-critical error, don't block main UI
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to load organizations";
            console.error("Error fetching organizations:", err);
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    return {
        organizations,
        customPlans,
        loading,
        error,
        refreshComponents: fetchOrganizations
    };
};
