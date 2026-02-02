import { useState, useEffect, useCallback } from 'react';
import { getSystemOverview } from '@/api/SuperAdmin/systemOverviewService';
import { OrganizationMapper, type Organization } from '@/api/SuperAdmin/organizationService';
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

            // Get raw data from system overview API
            const data = await getSystemOverview();
            const orgList = data.organizations?.list || [];

            // Transform to frontend model using the Service Mapper (SOLID)
            // Note: The API response structure matches what OrganizationMapper expects
            const mappedOrgs = orgList.map(apiOrg => OrganizationMapper.toFrontendModel(apiOrg, apiOrg.owner));

            setOrganizations(mappedOrgs);

            // Fetch Subscription Plans for filters
            try {
                const plansResponse = await subscriptionPlanService.getAll();
                // Filter for plans that are clearly identified as Custom
                const plans = plansResponse.data.data
                    .filter(p => p.tier === 'custom' || !p.isSystemPlan)
                    .map(p => p.name);
                setCustomPlans([...new Set(plans)]);
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
