import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Combined hook for managing list state (pagination, search, filtering)
 *
 * This hook eliminates the need to manually coordinate usePagination, useSearch, and useFilter
 * by providing a unified interface for common list page patterns.
 *
 * @example
 * ```tsx
 * const {
 *   paginatedData,
 *   currentPage,
 *   searchValue,
 *   setSearchValue,
 *   filters,
 *   setFilter,
 *   totalItems,
 *   isLoading
 * } = useListState(data, {
 *   pageSize: 10,
 *   searchKeys: ['name', 'email'],
 *   filterKeys: ['status', 'role']
 * });
 * ```
 */

// --- Types ---

export type FilterValue = string | number | boolean | string[] | null | undefined;

export interface ListStateOptions<T> {
    /** Initial page number (1-indexed) */
    initialPage?: number;
    /** Items per page */
    pageSize?: number;
    /** Fields to search in */
    searchKeys?: (keyof T)[];
    /** Initial search value */
    initialSearch?: string;
    /** Debounce delay for search (ms) */
    searchDebounce?: number;
    /** Initial filter values */
    initialFilters?: Record<string, FilterValue>;
    /** Custom sort function */
    sortFn?: (a: T, b: T) => number;
    /** External loading state */
    isLoading?: boolean;
}

export interface ListStateReturn<T> {
    // Processed Data
    /** Data for current page (after search, filter, sort) */
    paginatedData: T[];
    /** All filtered data (before pagination) */
    filteredData: T[];
    /** Total count after filtering */
    totalFilteredItems: number;
    /** Original data count */
    totalItems: number;

    // Pagination
    currentPage: number;
    setCurrentPage: (page: number) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    totalPages: number;
    startIndex: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;

    // Search
    searchValue: string;
    setSearchValue: (value: string) => void;
    debouncedSearchValue: string;
    clearSearch: () => void;

    // Filters
    filters: Record<string, FilterValue>;
    setFilter: (key: string, value: FilterValue) => void;
    setFilters: (filters: Record<string, FilterValue>) => void;
    clearFilter: (key: string) => void;
    clearAllFilters: () => void;
    hasActiveFilters: boolean;
    activeFilterCount: number;

    // Loading
    isLoading: boolean;

    // Utilities
    reset: () => void;
    isEmpty: boolean;
    isFiltered: boolean;
}

// --- Debounce Hook ---

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

// --- Main Hook ---

export function useListState<T extends Record<string, unknown>>(
    data: T[],
    options: ListStateOptions<T> = {}
): ListStateReturn<T> {
    const {
        initialPage = 1,
        pageSize: initialPageSize = 10,
        searchKeys = [],
        initialSearch = '',
        searchDebounce = 300,
        initialFilters = {},
        sortFn,
        isLoading: externalLoading = false,
    } = options;

    // --- State ---
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [searchValue, setSearchValue] = useState(initialSearch);
    const [filters, setFiltersState] = useState<Record<string, FilterValue>>(initialFilters);

    // Debounced search for performance
    const debouncedSearchValue = useDebounce(searchValue, searchDebounce);

    // --- Computed Values ---

    // Filter data based on search and filters
    const filteredData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (debouncedSearchValue && searchKeys.length > 0) {
            const searchLower = debouncedSearchValue.toLowerCase();
            result = result.filter((item) =>
                searchKeys.some((key) => {
                    const value = item[key];
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchLower);
                    }
                    if (typeof value === 'number') {
                        return value.toString().includes(searchLower);
                    }
                    return false;
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([key, filterValue]) => {
            if (filterValue === null || filterValue === undefined || filterValue === '') {
                return;
            }
            if (Array.isArray(filterValue) && filterValue.length === 0) {
                return;
            }

            result = result.filter((item) => {
                const itemValue = item[key];

                // Array filter (multi-select)
                if (Array.isArray(filterValue)) {
                    return filterValue.includes(itemValue as string);
                }

                // Exact match
                return itemValue === filterValue;
            });
        });

        // Apply sort
        if (sortFn) {
            result.sort(sortFn);
        }

        return result;
    }, [data, debouncedSearchValue, searchKeys, filters, sortFn]);

    // Pagination calculations
    const totalFilteredItems = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalFilteredItems / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalFilteredItems);

    // Paginated data
    const paginatedData = useMemo(
        () => filteredData.slice(startIndex, endIndex),
        [filteredData, startIndex, endIndex]
    );

    // Filter state checks
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(
            (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
        );
    }, [filters]);

    const activeFilterCount = useMemo(() => {
        return Object.values(filters).filter(
            (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
        ).length;
    }, [filters]);

    const isFiltered = hasActiveFilters || debouncedSearchValue.length > 0;
    const isEmpty = totalFilteredItems === 0;

    // --- Handlers ---

    const handleSetCurrentPage = useCallback((page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const handleSetPageSize = useCallback((size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page
    }, []);

    const handleSetSearchValue = useCallback((value: string) => {
        setSearchValue(value);
        setCurrentPage(1); // Reset to first page on search
    }, []);

    const clearSearch = useCallback(() => {
        setSearchValue('');
        setCurrentPage(1);
    }, []);

    const setFilter = useCallback((key: string, value: FilterValue) => {
        setFiltersState((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    }, []);

    const setFilters = useCallback((newFilters: Record<string, FilterValue>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    }, []);

    const clearFilter = useCallback((key: string) => {
        setFiltersState((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setCurrentPage(1);
    }, []);

    const clearAllFilters = useCallback(() => {
        setFiltersState({});
        setCurrentPage(1);
    }, []);

    const reset = useCallback(() => {
        setCurrentPage(initialPage);
        setPageSize(initialPageSize);
        setSearchValue(initialSearch);
        setFiltersState(initialFilters);
    }, [initialPage, initialPageSize, initialSearch, initialFilters]);

    // Reset page when filtered data changes and current page is out of bounds
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return {
        // Processed Data
        paginatedData,
        filteredData,
        totalFilteredItems,
        totalItems: data.length,

        // Pagination
        currentPage,
        setCurrentPage: handleSetCurrentPage,
        pageSize,
        setPageSize: handleSetPageSize,
        totalPages,
        startIndex,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,

        // Search
        searchValue,
        setSearchValue: handleSetSearchValue,
        debouncedSearchValue,
        clearSearch,

        // Filters
        filters,
        setFilter,
        setFilters,
        clearFilter,
        clearAllFilters,
        hasActiveFilters,
        activeFilterCount,

        // Loading
        isLoading: externalLoading,

        // Utilities
        reset,
        isEmpty,
        isFiltered,
    };
}

export default useListState;
