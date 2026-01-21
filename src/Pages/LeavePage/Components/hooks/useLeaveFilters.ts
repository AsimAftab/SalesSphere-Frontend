import { useState, useMemo } from 'react';
import { type LeaveRequest } from '../../../../api/leaveService';
import { formatFilterDate, getMonthName } from '../../../../utils/dateUtils';

interface FilterValues {
    date: Date | null;
    employees: string[];
    statuses: string[];
    months: string[];
}

/**
 * Hook for managing filter state and applying filter logic
 * Single Responsibility: Filter state and logic only
 */
export const useLeaveFilters = (leaves: LeaveRequest[]) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [filters, setFilters] = useState<FilterValues>({
        date: null,
        employees: [],
        statuses: [],
        months: [],
    });

    // Apply all filters
    const filteredData = useMemo(() => {
        return leaves.filter((leave) => {
            // 1. Basic Search
            const matchesSearch =
                leave.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                leave.category.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Status Filter
            const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(leave.status);

            // 3. Start Date Filter (using centralized date utility)
            const matchesDate = !filters.date || (() => {
                const formattedFilterDate = formatFilterDate(filters.date);
                return leave.startDate === formattedFilterDate;
            })();

            // 4. Month Filter
            const monthName = getMonthName(leave.startDate);
            const matchesMonth = filters.months.length === 0 || filters.months.includes(monthName);

            // 5. Employee Filter
            const matchesEmployee = filters.employees.length === 0 || filters.employees.includes(leave.createdBy.name);

            return matchesSearch && matchesStatus && matchesDate && matchesMonth && matchesEmployee;
        });
    }, [leaves, searchQuery, filters]);

    // Filter options
    const filterOptions = useMemo(() => ({
        employees: Array.from(new Set(leaves.map(l => l.createdBy.name)))
    }), [leaves]);

    const resetFilters = () => {
        setSearchQuery("");
        setFilters({
            date: null,
            employees: [],
            statuses: [],
            months: [],
        });
    };

    return {
        searchQuery,
        setSearchQuery,
        isFilterVisible,
        setIsFilterVisible,
        filters,
        setFilters,
        filteredData,
        filterOptions,
        resetFilters
    };
};
