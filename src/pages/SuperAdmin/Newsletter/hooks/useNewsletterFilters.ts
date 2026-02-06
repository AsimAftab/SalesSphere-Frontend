import { useState, useEffect, useMemo } from 'react';
import type { Subscriber } from '../types';
import { ITEMS_PER_PAGE } from '../constants';

export const useNewsletterFilters = (subscribers: Subscriber[]) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterActive, setFilterActive] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter subscribers based on search and active status
    const filteredSubscribers = useMemo(() => {
        let result = subscribers;

        // Filter by active status
        if (filterActive !== null) {
            result = result.filter(s => s.isActive === filterActive);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(s => s.email.toLowerCase().includes(q));
        }

        return result;
    }, [subscribers, searchQuery, filterActive]);

    // Pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedSubscribers = filteredSubscribers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterActive]);

    // Get only active subscribers for selection
    const activeSubscribers = useMemo(() =>
        filteredSubscribers.filter(s => s.isActive),
        [filteredSubscribers]
    );

    return {
        searchQuery,
        setSearchQuery,
        filterActive,
        setFilterActive,
        filteredSubscribers,
        paginatedSubscribers,
        activeSubscribers,
        pagination: {
            currentPage,
            onPageChange: setCurrentPage,
            itemsPerPage: ITEMS_PER_PAGE,
            totalItems: filteredSubscribers.length,
        },
    };
};
