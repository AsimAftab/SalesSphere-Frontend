import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { getBeatPlans, deleteBeatPlan } from '../../../../../api/beatPlanService';
import type { BeatPlan } from '../../../../../api/beatPlanService';

interface UseActiveBeatPlansReturn {
    beatPlans: BeatPlan[];
    loading: boolean;
    error: string | null;
    totalPlans: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filters: ActiveBeatFilters;
    setFilters: (filters: ActiveBeatFilters) => void;
    setCurrentPage: (page: number) => void;
    refreshPlans: () => Promise<void>;
    handleDeletePlan: (id: string) => Promise<void>;
    uniqueEmployeeNames: string[];
}

export interface ActiveBeatFilters {
    status: string[];
    assignedTo: string[];
    date: Date | null;
    month: string[];
}

export const useActiveBeatPlans = (): UseActiveBeatPlansReturn => {
    const [allPlans, setAllPlans] = useState<BeatPlan[]>([]);
    const [displayedPlans, setDisplayedPlans] = useState<BeatPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [totalPlans, setTotalPlans] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    // Filters
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filters, setFilters] = useState<ActiveBeatFilters>({
        status: [],
        assignedTo: [],
        date: null,
        month: []
    });

    // Extract Unique Employees for Filter (Names)
    const uniqueEmployeeNames = useMemo(() => {
        const names = new Set<string>();
        allPlans.forEach(plan => {
            plan.employees.forEach(emp => {
                if (emp.name) names.add(emp.name);
            });
        });
        return Array.from(names).sort();
    }, [allPlans]);

    const fetchPlans = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch all for client-side filtering
            const response = await getBeatPlans({ limit: 1000 });
            if (response.success) {
                setAllPlans(response.data.filter(p => ['active', 'pending'].includes(p.status)));
            } else {
                setError('Failed to fetch beat plans');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to load beat plans');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Load
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Filtering & Pagination Logic
    useEffect(() => {
        let result = allPlans;

        // 1. Search (Name OR Assigned Employee Name)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(plan =>
                plan.name.toLowerCase().includes(q) ||
                plan.employees.some(emp => emp.name.toLowerCase().includes(q))
            );
        }

        // 2. Status Filter
        if (filters.status.length > 0) {
            result = result.filter(plan => filters.status.includes(plan.status));
        }

        // 3. Assigned To Filter (Match Names)
        if (filters.assignedTo.length > 0) {
            result = result.filter(plan =>
                plan.employees.some(emp => filters.assignedTo.includes(emp.name))
            );
        }

        // 4. Date Filter (Specific Date)
        if (filters.date) {
            result = result.filter(plan => {
                const planDate = new Date(plan.schedule.startDate);
                return planDate.toDateString() === filters.date?.toDateString();
            });
        }

        // 5. Month Filter (Month Names)
        if (filters.month.length > 0) {
            result = result.filter(plan => {
                const planDate = new Date(plan.schedule.startDate);
                const monthName = planDate.toLocaleString('default', { month: 'long' });
                return filters.month.includes(monthName);
            });
        }

        // Sort by Date Descending
        result.sort((a, b) => new Date(b.schedule.startDate).getTime() - new Date(a.schedule.startDate).getTime());

        setTotalPlans(result.length);
        setTotalPages(Math.ceil(result.length / itemsPerPage));

        // Pagination Slice
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginated = result.slice(startIndex, startIndex + itemsPerPage);

        setDisplayedPlans(paginated);

        // Reset page if needed
        if (currentPage > 1 && paginated.length === 0 && result.length > 0) {
            setCurrentPage(1);
        }

    }, [allPlans, searchQuery, filters, currentPage, itemsPerPage]);

    const refreshPlans = async () => {
        await fetchPlans();
    };

    const handleDeletePlan = async (id: string) => {
        try {
            const response = await deleteBeatPlan(id);
            if (response.success) {
                toast.success('Beat plan deleted successfully');
                setAllPlans(prev => prev.filter(p => p._id !== id));
            }
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete beat plan');
        }
    };

    return {
        beatPlans: displayedPlans,
        loading,
        error,
        totalPlans,
        currentPage,
        itemsPerPage,
        totalPages,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        setCurrentPage,
        refreshPlans,
        handleDeletePlan,
        uniqueEmployeeNames
    };
};
