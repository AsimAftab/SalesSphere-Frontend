import { useState, useMemo } from 'react';
import type { Organization } from '../../../../../api/SuperAdmin/organizationService';
import type { OrganizationFilters } from '../types';

export const useOrganizationFilters = (data: Organization[], customPlans: string[] = []) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [filters, setFilters] = useState<OrganizationFilters>({
        date: null,
        expiryDate: null,
        employees: [],
        plans: [], // Plan Duration
        planNames: [], // Plan Name
        statuses: [],
        months: []
    });

    // Derive unique options from data
    const filterOptions = useMemo(() => {
        const employees = Array.from(new Set(data.map(item => item.owner).filter(Boolean)));

        // Plan Durations (existing logic)
        const derivedDurations = Array.from(new Set(data.map(item => item.subscriptionType).filter(Boolean) as string[]));

        // Plan Names (New Logic)
        const derivedPlanNames = Array.from(new Set(data.map(item => {
            if (item.customPlanId && typeof item.customPlanId === 'object' && 'name' in item.customPlanId) {
                return item.customPlanId.name;
            }
            if (item.subscriptionType) {
                // Determine display name for standard plans (usually just the duration + "Plan")
                // Or if there's specific logic for Basic/Standard/Premium, add here.
                // For now, consistent with Card:
                return `${item.subscriptionType.replace(/(\d+)([a-zA-Z]+)/, '$1 $2')} Plan`;
            }
            return null;
        }).filter(Boolean) as string[]));

        const statuses = Array.from(new Set(data.map(item => item.status).filter(Boolean)));

        return {
            employees,
            plans: derivedDurations,
            planNames: derivedPlanNames,
            statuses
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, customPlans]);

    // Filtering Logic
    const filteredData = useMemo(() => {
        return data.filter(item => {
            // 1. Search Query (Name or Owner)
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                (item.name?.toLowerCase().includes(query) || '') ||
                (item.owner?.toLowerCase().includes(query) || '');

            if (!matchesSearch) return false;

            // 2. Date Filter (Created Date)
            if (filters.date) {
                const itemDate = new Date(item.createdDate);
                const filterDate = new Date(filters.date);
                if (
                    itemDate.getDate() !== filterDate.getDate() ||
                    itemDate.getMonth() !== filterDate.getMonth() ||
                    itemDate.getFullYear() !== filterDate.getFullYear()
                ) {
                    return false;
                }
            }

            // 3. Expiry Date Filter
            if (filters.expiryDate) {
                if (!item.subscriptionExpiry) return false;
                const itemDate = new Date(item.subscriptionExpiry);
                const filterDate = new Date(filters.expiryDate);
                if (
                    itemDate.getDate() !== filterDate.getDate() ||
                    itemDate.getMonth() !== filterDate.getMonth() ||
                    itemDate.getFullYear() !== filterDate.getFullYear()
                ) {
                    return false;
                }
            }

            // 4. Employee (Owner) Filter
            if (filters.employees.length > 0) {
                if (!filters.employees.includes(item.owner)) return false;
            }

            // 5. Plan Duration Filter (mapped to filters.plans)
            if (filters.plans.length > 0) {
                const planDuration = item.subscriptionType || 'Unknown';
                if (!filters.plans.includes(planDuration)) return false;
            }

            // 6. Plan Name Filter (New)
            if (filters.planNames.length > 0) {
                let itemName = 'Unknown';
                if (item.customPlanId && typeof item.customPlanId === 'object' && 'name' in item.customPlanId) {
                    itemName = item.customPlanId.name;
                } else if (item.subscriptionType) {
                    itemName = `${item.subscriptionType.replace(/(\d+)([a-zA-Z]+)/, '$1 $2')} Plan`;
                }

                if (!filters.planNames.includes(itemName)) return false;
            }

            // 7. Status Filter
            if (filters.statuses.length > 0) {
                if (!filters.statuses.includes(item.status)) return false;
            }

            // 8. Month Filter (Creation Month)
            if (filters.months.length > 0) {
                const itemMonth = new Date(item.createdDate).toLocaleString('default', { month: 'long' });
                if (!filters.months.includes(itemMonth)) return false;
            }

            return true;
        });
    }, [data, searchQuery, filters]);

    return {
        searchQuery,
        setSearchQuery,
        isFilterVisible,
        setIsFilterVisible,
        filters,
        setFilters,
        filteredData,
        filterOptions
    };
};
