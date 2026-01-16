import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOdometerStats } from '../../../../api/odometerService';
import type { OdometerStat } from '../../../../api/odometerService';

const useOdometerRecordsManager = () => {
    const [stats, setStats] = useState<OdometerStat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // For now we don't have filters, but we can add them later
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

    // --- Filter State ---
    const [filters, setFilters] = useState({
        employees: [] as string[],
        dateRange: { start: null, end: null } as { start: Date | null, end: Date | null },
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // In a real app, we would pass page/limit/filters here
                const response = await fetchOdometerStats();
                setStats(response.data);
                // setTotalItems(response.total); // Not used for client-side filtering currently
            } catch (error) {
                // Silently fail
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage, searchQuery]); // Note: real search/filter usually triggers fetch, but we do client-side filtering below for now as per previous pattern

    // --- Filtering Logic (Client-Side for Mock) ---
    const filteredStats = stats.filter((item) => {
        // Search
        const term = searchQuery.toLowerCase();
        const matchesSearch = term === "" ||
            item.employee.name.toLowerCase().includes(term) ||
            item.employee.role.toLowerCase().includes(term);

        // Employee Filter
        const matchesEmployee = filters.employees.length === 0 ||
            filters.employees.includes(item.employee.name);

        // Date Range Filter (Overlap Logic)
        const matchesDate = (() => {
            if (!filters.dateRange.start) return true; // No filter applied

            const filterStart = new Date(filters.dateRange.start);
            filterStart.setHours(0, 0, 0, 0);

            const filterEnd = filters.dateRange.end ? new Date(filters.dateRange.end) : new Date(filterStart);
            filterEnd.setHours(23, 59, 59, 999); // End of day

            const itemStart = new Date(item.dateRange.start);
            const itemEnd = new Date(item.dateRange.end);
            itemStart.setHours(0, 0, 0, 0);
            itemEnd.setHours(0, 0, 0, 0);

            // Check overlap: (StartA <= EndB) and (EndA >= StartB)
            return itemStart <= filterEnd && itemEnd >= filterStart;
        })();

        return matchesSearch && matchesEmployee && matchesDate;
    });

    // --- Derived Options ---
    const employeeOptions = Array.from(new Set(stats.map(stat => stat.employee.name)))
        .map(name => ({ label: name, value: name }));

    const navigate = useNavigate();

    const handleResetFilters = () => {
        setSearchQuery("");
        setFilters({ employees: [], dateRange: { start: null, end: null } });
        setCurrentPage(1);
    };

    const handleViewDetails = (employeeId: string) => {
        navigate(`/odometer/employee/${employeeId}`);
    };

    const actions = {
        setCurrentPage,
        setSearchQuery,
        setIsFilterVisible,
        setFilters,
        onResetFilters: handleResetFilters,
        onViewDetails: handleViewDetails
    };

    return {
        state: {
            stats: filteredStats, // Return filtered data
            loading,
            totalItems: filteredStats.length, // Update count based on filter
            currentPage,
            searchQuery,
            isFilterVisible,
            filters,
            employeeOptions
        },
        actions
    };
};

export default useOdometerRecordsManager;
