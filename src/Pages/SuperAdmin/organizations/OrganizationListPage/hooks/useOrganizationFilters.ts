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
        plans: [],
        statuses: [],
        months: []
    });

    // Derive unique options from data
    const filterOptions = useMemo(() => {
        const employees = Array.from(new Set(data.map(item => item.owner).filter(Boolean)));

        // Merge derived plans from current data AND fetched available custom plans
        // This ensures if a custom plan is used but somehow not in the plan list, it's still filterable
        const derivedPlans = Array.from(new Set(data.map(item => item.subscriptionType).filter(Boolean) as string[]));

        // Status is static enum "Active"/"Inactive" usually, but can derive
        const statuses = Array.from(new Set(data.map(item => item.status).filter(Boolean)));

        return { employees, plans: derivedPlans, statuses, customPlans };
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

            // 3. Employee (Owner) Filter
            if (filters.employees.length > 0) {
                if (!filters.employees.includes(item.owner)) return false;
            }

            // 4. Plan Filter
            if (filters.plans.length > 0) {
                // Handle missing plan type gracefully
                const plan = item.subscriptionType || 'Unknown';
                if (!filters.plans.includes(plan)) return false;
            }

            // 5. Status Filter
            if (filters.statuses.length > 0) {
                if (!filters.statuses.includes(item.status)) return false;
            }

            // 6. Month Filter (Creation Month)
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
