import { useState, useEffect, useCallback } from 'react';
import { getArchivedBeatPlans } from '../../../../../api/beatPlanService';
import type { BeatPlan } from '../../../../../api/beatPlanService';

interface UseCompletedBeatPlansReturn {
    beatPlans: BeatPlan[];
    loading: boolean;
    error: string | null;
    totalPlans: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    refreshPlans: () => Promise<void>;
}

export const useCompletedBeatPlans = (searchQuery: string = ''): UseCompletedBeatPlansReturn => {
    const [beatPlans, setBeatPlans] = useState<BeatPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPlans, setTotalPlans] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch ALL archived plans (backend now returns all)
            const response = await getArchivedBeatPlans();

            if (response.success) {
                setBeatPlans(response.data);
                // Initial total is just raw length
                setTotalPlans(response.data.length);
            } else {
                setError('Failed to fetch completed beat plans');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset to page 1 when search changes? Client side filter doesn't need to reset API page, 
    // but maybe we want to reset the pagination of the view.
    // However, if we filter the current page, we stay on current page.

    const filteredBeatPlans = beatPlans.filter(plan => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const matchesName = plan.name.toLowerCase().includes(query);
        const matchesEmployee = plan.employees?.some(emp => emp.name.toLowerCase().includes(query));
        return matchesName || matchesEmployee;
    });

    // Client-side pagination logic
    const totalFiltered = filteredBeatPlans.length;
    const totalPagesCount = Math.ceil(totalFiltered / itemsPerPage);

    // Ensure current page is valid
    const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPagesCount));

    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const paginatedPlans = filteredBeatPlans.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Update totalPlans and totalPages based on filtered data
    useEffect(() => {
        setTotalPlans(totalFiltered);
        setTotalPages(totalPagesCount);
        // If current page becomes invalid after filtering, reset it
        if (currentPage > totalPagesCount && totalPagesCount > 0) {
            setCurrentPage(totalPagesCount);
        } else if (currentPage === 0 && totalPagesCount > 0) { // Handle case where currentPage might be 0 initially
            setCurrentPage(1);
        } else if (totalPagesCount === 0 && currentPage !== 1) { // If no plans, reset to page 1
            setCurrentPage(1);
        }
    }, [totalFiltered, totalPagesCount, currentPage]);


    const refreshPlans = async () => {
        await fetchPlans();
    };

    return {
        beatPlans: paginatedPlans,
        loading,
        error,
        totalPlans,
        currentPage,
        itemsPerPage,
        totalPages,
        setCurrentPage,
        refreshPlans,
    };
};
