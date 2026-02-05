import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTableSelection } from './useTableSelection';
import toast from 'react-hot-toast';

/**
 * Generic Entity Manager Hook Factory
 *
 * This hook provides a standardized way to manage entity state across pages,
 * reducing boilerplate while following the Facade pattern.
 *
 * Responsibilities:
 * - Data fetching with React Query
 * - Client-side filtering and search
 * - Pagination
 * - Selection state
 * - CRUD mutations
 *
 * @example
 * ```tsx
 * const expenseManager = useEntityManager<Expense>({
 *   queryKey: 'expenses',
 *   fetchFn: ExpenseRepository.getExpenses,
 *   searchKeys: ['title', 'category'],
 *   filterFn: (expense, filters) => {
 *     if (filters.status && expense.status !== filters.status) return false;
 *     return true;
 *   },
 *   mutations: {
 *     create: ExpenseRepository.createExpense,
 *     delete: ExpenseRepository.deleteExpense,
 *     bulkDelete: ExpenseRepository.bulkDeleteExpenses,
 *   }
 * });
 * ```
 */

// --- Types ---

export type FilterValue = string | number | boolean | string[] | Date | null | undefined;

export interface EntityManagerConfig<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    /** React Query cache key */
    queryKey: string | string[];
    /** Function to fetch entities */
    fetchFn: () => Promise<T[]>;
    /** Keys to search in (for simple string matching) */
    searchKeys?: (keyof T)[];
    /** Custom filter function */
    filterFn?: (entity: T, filters: Record<string, FilterValue>, searchTerm: string) => boolean;
    /** Custom sort function */
    sortFn?: (a: T, b: T) => number;
    /** Default sort (descending by createdAt) */
    defaultSortKey?: keyof T;
    /** Items per page */
    itemsPerPage?: number;
    /** Mutation functions */
    mutations?: {
        create?: (data: TCreate) => Promise<T>;
        update?: (id: string, data: TUpdate) => Promise<T>;
        delete?: (id: string) => Promise<boolean>;
        bulkDelete?: (ids: string[]) => Promise<boolean>;
    };
    /** Toast messages */
    messages?: {
        createSuccess?: string;
        createError?: string;
        updateSuccess?: string;
        updateError?: string;
        deleteSuccess?: string;
        deleteError?: string;
        bulkDeleteSuccess?: string;
        bulkDeleteError?: string;
    };
    /** Key extractor for items (defaults to 'id' or '_id') */
    getItemId?: (item: T) => string;
}

export interface EntityManagerState<T> {
    // Data
    items: T[];
    allFilteredItems: T[];
    isLoading: boolean;
    error: Error | null;

    // Pagination
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    startIndex: number;

    // Search & Filter
    searchTerm: string;
    filters: Record<string, FilterValue>;
    isFilterVisible: boolean;
    hasActiveFilters: boolean;

    // Selection
    selectedIds: string[];
    isAllSelected: boolean;

    // Mutation States
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export interface EntityManagerActions<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    // Pagination
    setCurrentPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;

    // Search & Filter
    setSearchTerm: (term: string) => void;
    setFilter: (key: string, value: FilterValue) => void;
    setFilters: (filters: Record<string, FilterValue>) => void;
    clearFilter: (key: string) => void;
    clearAllFilters: () => void;
    toggleFilterVisibility: () => void;

    // Selection
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;

    // CRUD Operations
    create: (data: TCreate) => Promise<T | undefined>;
    update: (id: string, data: TUpdate) => Promise<T | undefined>;
    delete: (id: string) => Promise<boolean>;
    bulkDelete: (ids: string[]) => Promise<boolean>;

    // Utilities
    refetch: () => void;
    reset: () => void;
}

export interface EntityManagerReturn<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    state: EntityManagerState<T>;
    actions: EntityManagerActions<T, TCreate, TUpdate>;
}

// --- Helper Functions ---

function normalizeQueryKey(key: string | string[]): string[] {
    return Array.isArray(key) ? key : [key];
}

// --- Main Hook ---

export function useEntityManager<T extends { _id?: string; id?: string }, TCreate = Partial<T>, TUpdate = Partial<T>>(
    config: EntityManagerConfig<T, TCreate, TUpdate>
): EntityManagerReturn<T, TCreate, TUpdate> {
    const {
        queryKey,
        fetchFn,
        searchKeys = [],
        filterFn,
        sortFn,
        defaultSortKey,
        itemsPerPage = 10,
        mutations = {},
        messages = {},
        // getItemId is available in config but not currently used in this hook
    } = config;

    const queryClient = useQueryClient();
    const normalizedQueryKey = normalizeQueryKey(queryKey);

    // --- Local State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTermState] = useState('');
    const [filters, setFiltersState] = useState<Record<string, FilterValue>>({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // --- Data Fetching ---
    const query = useQuery<T[], Error>({
        queryKey: normalizedQueryKey,
        queryFn: fetchFn,
        placeholderData: (prev) => prev,
    });

    const allItems = useMemo(() => query.data || [], [query.data]);

    // --- Filtering Logic ---
    const filteredItems = useMemo(() => {
        let result = [...allItems];

        // Apply search
        if (searchTerm && searchKeys.length > 0) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((item) =>
                searchKeys.some((key) => {
                    const value = item[key];
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchLower);
                    }
                    return false;
                })
            );
        }

        // Apply custom filter
        if (filterFn) {
            result = result.filter((item) => filterFn(item, filters, searchTerm));
        }

        // Apply sort
        if (sortFn) {
            result.sort(sortFn);
        } else if (defaultSortKey) {
            result.sort((a, b) => {
                const aVal = a[defaultSortKey];
                const bVal = b[defaultSortKey];
                if (aVal instanceof Date && bVal instanceof Date) {
                    return bVal.getTime() - aVal.getTime();
                }
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return new Date(bVal).getTime() - new Date(aVal).getTime();
                }
                return 0;
            });
        }

        return result;
    }, [allItems, searchTerm, searchKeys, filters, filterFn, sortFn, defaultSortKey]);

    // --- Pagination ---
    const totalItems = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = useMemo(
        () => filteredItems.slice(startIndex, startIndex + itemsPerPage),
        [filteredItems, startIndex, itemsPerPage]
    );

    // --- Selection ---
    const { selectedIds, toggleRow, clearSelection, selectMultiple } = useTableSelection(
        paginatedItems
    );

    // --- Filter State Checks ---
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(
            (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
        ) || searchTerm.length > 0;
    }, [filters, searchTerm]);

    // --- Auto-adjust page when filtered data changes ---
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // --- Mutations ---
    const createMutation = useMutation({
        mutationFn: mutations.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: normalizedQueryKey });
            toast.success(messages.createSuccess || 'Created successfully');
            setCurrentPage(1);
        },
        onError: (err: Error) => {
            toast.error(err.message || messages.createError || 'Failed to create');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TUpdate }) =>
            mutations.update?.(id, data) || Promise.reject(new Error('Update not configured')),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: normalizedQueryKey });
            toast.success(messages.updateSuccess || 'Updated successfully');
        },
        onError: (err: Error) => {
            toast.error(err.message || messages.updateError || 'Failed to update');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: mutations.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: normalizedQueryKey });
            toast.success(messages.deleteSuccess || 'Deleted successfully');
        },
        onError: (err: Error) => {
            toast.error(err.message || messages.deleteError || 'Failed to delete');
        },
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: mutations.bulkDelete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: normalizedQueryKey });
            toast.success(messages.bulkDeleteSuccess || 'Items deleted successfully');
            clearSelection();
        },
        onError: (err: Error) => {
            toast.error(err.message || messages.bulkDeleteError || 'Failed to delete items');
        },
    });

    // --- Action Handlers ---
    const setSearchTerm = useCallback((term: string) => {
        setSearchTermState(term);
        setCurrentPage(1);
    }, []);

    const setFilter = useCallback((key: string, value: FilterValue) => {
        setFiltersState((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
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
        setSearchTermState('');
        setCurrentPage(1);
    }, []);

    const selectAll = useCallback((ids: string[]) => {
        if (ids.length > 0) {
            selectMultiple(ids);
        } else {
            clearSelection();
        }
    }, [selectMultiple, clearSelection]);

    const reset = useCallback(() => {
        setCurrentPage(1);
        setSearchTermState('');
        setFiltersState({});
        setIsFilterVisible(false);
        clearSelection();
    }, [clearSelection]);

    // --- Return Facade ---
    return {
        state: {
            items: paginatedItems,
            allFilteredItems: filteredItems,
            isLoading: query.isFetching,
            error: query.error,

            currentPage,
            totalPages,
            totalItems,
            itemsPerPage,
            startIndex,

            searchTerm,
            filters,
            isFilterVisible,
            hasActiveFilters,

            selectedIds,
            isAllSelected: selectedIds.length === paginatedItems.length && paginatedItems.length > 0,

            isCreating: createMutation.isPending,
            isUpdating: updateMutation.isPending,
            isDeleting: deleteMutation.isPending || bulkDeleteMutation.isPending,
        },

        actions: {
            setCurrentPage,
            nextPage: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
            prevPage: () => setCurrentPage((p) => Math.max(p - 1, 1)),

            setSearchTerm,
            setFilter,
            setFilters,
            clearFilter,
            clearAllFilters,
            toggleFilterVisibility: () => setIsFilterVisible((prev) => !prev),

            toggleSelection: toggleRow,
            selectAll,
            clearSelection,

            create: async (data: TCreate) => {
                if (!mutations.create) return undefined;
                return createMutation.mutateAsync(data);
            },
            update: async (id: string, data: TUpdate) => {
                if (!mutations.update) return undefined;
                return updateMutation.mutateAsync({ id, data });
            },
            delete: async (id: string) => {
                if (!mutations.delete) return false;
                return deleteMutation.mutateAsync(id);
            },
            bulkDelete: async (ids: string[]) => {
                if (!mutations.bulkDelete) return false;
                return bulkDeleteMutation.mutateAsync(ids);
            },

            refetch: () => queryClient.invalidateQueries({ queryKey: normalizedQueryKey }),
            reset,
        },
    };
}

export default useEntityManager;
