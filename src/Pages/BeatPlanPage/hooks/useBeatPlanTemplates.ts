import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
    getBeatPlanLists,
    deleteBeatPlanList,
} from '../../../api/beatPlanService';
import type { BeatPlanList } from '../../../api/beatPlanService';
import { formatFilterDate } from '../../../utils/dateUtils';

export interface BeatListFilters {
    createdBy: string[];
    month: string[];
    date: Date | null;
}

interface UseBeatPlanTemplatesReturn {
    templates: BeatPlanList[];
    loading: boolean;
    error: string | null;
    totalTemplates: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setCurrentPage: (page: number) => void;
    refreshTemplates: () => Promise<void>;
    handleDeleteTemplate: (id: string) => Promise<void>;
    filters: BeatListFilters;
    setFilters: (filters: BeatListFilters) => void;
    uniqueCreators: string[];
    filteredTemplates: BeatPlanList[];
}

export const useBeatPlanTemplates = (): UseBeatPlanTemplatesReturn => {
    const [allTemplates, setAllTemplates] = useState<BeatPlanList[]>([]);
    const [displayedTemplates, setDisplayedTemplates] = useState<BeatPlanList[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<BeatPlanList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalTemplates, setTotalTemplates] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Filters State
    const [filters, setFilters] = useState<BeatListFilters>({
        createdBy: [],
        month: [],
        date: null
    });

    // Derived State for Dropdown Options
    const [uniqueCreators, setUniqueCreators] = useState<string[]>([]);

    // Fetch ALL templates initially
    const fetchTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch without params to get all (as per user request)
            const response = await getBeatPlanLists();

            if (response.success) {
                setAllTemplates(response.data);

                // Extract unique creators
                const creators = Array.from(new Set(
                    response.data
                        .map(t => t.createdBy?.name)
                        .filter(name => !!name)
                )).sort();
                setUniqueCreators(creators);
            } else {
                setError('Failed to fetch templates');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to load beat plan templates');
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect: Filter and Paginate
    useEffect(() => {
        let filtered = allTemplates;

        // 1. Client-Side Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(template =>
                template.name.toLowerCase().includes(query) ||
                template.createdBy?.name.toLowerCase().includes(query)
            );
        }

        // 2. Filters
        // Created By
        if (filters.createdBy.length > 0) {
            filtered = filtered.filter(t =>
                t.createdBy?.name && filters.createdBy.includes(t.createdBy.name)
            );
        }

        // Month
        if (filters.month.length > 0) {
            filtered = filtered.filter(t => {
                if (!t.createdAt) return false;
                const date = new Date(t.createdAt);
                const monthName = date.toLocaleString('default', { month: 'long' });
                return filters.month.includes(monthName);
            });
        }

        // Date
        if (filters.date) {
            // Compare dates using local time to avoid timezone offsets
            const filterDateStr = formatFilterDate(filters.date);

            filtered = filtered.filter(t => {
                if (!t.createdAt) return false;
                const templateDate = new Date(t.createdAt);

                // Compare with local date string of the record
                const templateDateStr = formatFilterDate(templateDate);
                return templateDateStr === filterDateStr;
            });
        }

        setFilteredTemplates(filtered);
        setTotalTemplates(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));

        // 3. Pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const width = filtered.slice(startIndex, startIndex + itemsPerPage);

        setDisplayedTemplates(width);

        // Reset page if search results shrink below current page
        if (currentPage > 1 && width.length === 0 && filtered.length > 0) {
            setCurrentPage(1);
        }

    }, [allTemplates, searchQuery, filters, currentPage, itemsPerPage]);

    // Initial load
    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    // Refresh handler
    const refreshTemplates = async () => {
        await fetchTemplates();
    };

    const handleDeleteTemplate = async (id: string) => {
        try {
            const response = await deleteBeatPlanList(id);
            if (response.success) {
                toast.success('Beat plan template deleted successfully');
                // Optimistic update locally
                setAllTemplates(prev => {
                    const updated = prev.filter(t => t._id !== id);
                    // Re-calculate creators if needed, or just leave it (lazy update is usually fine)
                    return updated;
                });
            }
        } catch (err: unknown) {
            console.error('Error deleting template:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to delete template');
        }
    };

    return {
        templates: displayedTemplates,
        loading,
        error,
        totalTemplates,
        currentPage,
        itemsPerPage,
        totalPages,
        searchQuery,
        setSearchQuery,
        setCurrentPage,
        refreshTemplates,
        handleDeleteTemplate,
        filters,
        setFilters,
        uniqueCreators,
        filteredTemplates
    };
};
