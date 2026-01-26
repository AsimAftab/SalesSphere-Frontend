import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
    getBeatPlanLists,
    deleteBeatPlanList,
} from '../../../api/beatPlanService';
import type { BeatPlanList } from '../../../api/beatPlanService';

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
}

export const useBeatPlanTemplates = (): UseBeatPlanTemplatesReturn => {
    const [allTemplates, setAllTemplates] = useState<BeatPlanList[]>([]);
    const [displayedTemplates, setDisplayedTemplates] = useState<BeatPlanList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalTemplates, setTotalTemplates] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch ALL templates initially
    const fetchTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch without params to get all (as per user request)
            const response = await getBeatPlanLists();

            if (response.success) {
                setAllTemplates(response.data);
            } else {
                setError('Failed to fetch templates');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
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
            filtered = allTemplates.filter(template =>
                template.name.toLowerCase().includes(query) ||
                template.createdBy?.name.toLowerCase().includes(query)
            );
        }

        setTotalTemplates(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));

        // 2. Pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const width = filtered.slice(startIndex, startIndex + itemsPerPage);

        setDisplayedTemplates(width);

        // Reset page if search results shrink below current page
        if (currentPage > 1 && width.length === 0 && filtered.length > 0) {
            setCurrentPage(1);
        }

    }, [allTemplates, searchQuery, currentPage, itemsPerPage]);

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
                setAllTemplates(prev => prev.filter(t => t._id !== id));
            }
        } catch (err: any) {
            console.error('Error deleting template:', err);
            toast.error(err.message || 'Failed to delete template');
        }
    };

    return {
        templates: displayedTemplates, // Expose filtered & paginated list
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
    };
};
