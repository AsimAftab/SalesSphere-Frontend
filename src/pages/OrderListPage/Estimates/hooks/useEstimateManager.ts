import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEstimates, deleteEstimate, bulkDeleteEstimates, type Estimate } from '@/api/estimateService';
import toast from 'react-hot-toast';

const useEstimateManager = () => {
    const queryClient = useQueryClient();
    const ITEMS_PER_PAGE = 10;

    // --- State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
    const [selectedEstimateIds, setSelectedEstimateIds] = useState<string[]>([]);
    const [estimateToDelete, setEstimateToDelete] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        parties: [] as string[],
        creators: [] as string[],
    });

    // --- Data Fetching ---
    const { data: estimates, isLoading, error } = useQuery({
        queryKey: ['estimates'],
        queryFn: getEstimates,
        staleTime: 1000 * 60 * 5,
    });

    // --- Mutations (with optimistic updates) ---
    const deleteMutation = useMutation({
        mutationFn: deleteEstimate,

        // Optimistic delete
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['estimates'] });
            const previousEstimates = queryClient.getQueryData<Estimate[]>(['estimates']);

            if (previousEstimates) {
                queryClient.setQueryData<Estimate[]>(['estimates'],
                    previousEstimates.filter(est => est._id !== id && est.id !== id)
                );
            }

            return { previousEstimates };
        },

        onSuccess: () => {
            toast.success("Estimate removed successfully");
            queryClient.invalidateQueries({ queryKey: ['estimates'] });
            setIsDeleteModalOpen(false);
            setEstimateToDelete(null);
        },

        onError: (_err, _id, context) => {
            if (context?.previousEstimates) {
                queryClient.setQueryData(['estimates'], context.previousEstimates);
            }
            toast.error("Could not delete estimate");
        }
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: bulkDeleteEstimates,

        // Optimistic bulk delete
        onMutate: async (ids: string[]) => {
            await queryClient.cancelQueries({ queryKey: ['estimates'] });
            const previousEstimates = queryClient.getQueryData<Estimate[]>(['estimates']);

            if (previousEstimates) {
                queryClient.setQueryData<Estimate[]>(['estimates'],
                    previousEstimates.filter(est => !ids.includes(est._id) && !ids.includes(est.id))
                );
            }

            return { previousEstimates };
        },

        onSuccess: (_data, variables) => {
            toast.success(`${variables.length} estimates deleted`);
            queryClient.invalidateQueries({ queryKey: ['estimates'] });
            setSelectedEstimateIds([]);
            setBulkDeleteModalOpen(false);
        },

        onError: (_err, _ids, context) => {
            if (context?.previousEstimates) {
                queryClient.setQueryData(['estimates'], context.previousEstimates);
            }
            toast.error("Bulk deletion failed");
        }
    });

    // --- Filter Helper ---
    const availableParties = useMemo(() => {
        if (!estimates) return [];
        const names = estimates.map(est => est.partyName).filter(Boolean);
        return Array.from(new Set(names)).sort();
    }, [estimates]);

    const availableCreators = useMemo(() => {
        if (!estimates) return [];
        const names = estimates.map(est => est.createdBy?.name).filter(Boolean);
        return Array.from(new Set(names)).sort();
    }, [estimates]);

    const filteredEstimates = useMemo(() => {
        if (!estimates) return [];
        return estimates
            .filter(est => {
                const search = searchTerm.toLowerCase();
                const matchesSearch = (
                    (est.partyName || '').toLowerCase().includes(search) ||
                    (est.estimateNumber || '').toLowerCase().includes(search) ||
                    (est.createdBy?.name || '').toLowerCase().includes(search)
                );

                const matchesParty = filters.parties.length === 0 || filters.parties.includes(est.partyName);
                const matchesCreator = filters.creators.length === 0 || (est.createdBy?.name && filters.creators.includes(est.createdBy.name));

                return matchesSearch && matchesParty && matchesCreator;
            })
            .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }, [estimates, searchTerm, filters]);

    // --- Pagination ---
    const totalPages = Math.ceil(filteredEstimates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentEstimates = filteredEstimates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- Handlers ---
    const toggleSelectEstimate = (id: string) => {
        setSelectedEstimateIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedEstimateIds.length > 0) {
            setSelectedEstimateIds([]);
        } else {
            setSelectedEstimateIds(currentEstimates.map(e => e._id || e.id));
        }
    };

    const handleDeleteClick = (id: string) => {
        setEstimateToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const resetFilters = () => {
        setFilters({ parties: [], creators: [] });
        setSearchTerm('');
        setCurrentPage(1);
        toast.success('Filters cleared');
    };

    return {
        state: {
            estimates: currentEstimates,
            allEstimates: filteredEstimates, // For PDF export primarily
            rawEstimates: estimates, // Raw query data - undefined during loading
            isLoading,
            error: error ? (error as Error).message : null,
            currentPage,
            totalPages,
            searchTerm,
            isFilterVisible,
            filters,
            options: { parties: availableParties, creators: availableCreators },
            selection: { selectedIds: selectedEstimateIds, isAllSelected: selectedEstimateIds.length > 0 && selectedEstimateIds.length === currentEstimates.length },
            modals: { isDeleteOpen: isDeleteModalOpen, isBulkDeleteOpen: isBulkDeleteModalOpen, estimateToDelete },
            isDeleting: deleteMutation.isPending || bulkDeleteMutation.isPending,
            startIndex,
            totalItems: filteredEstimates.length
        },
        actions: {
            setCurrentPage,
            setSearchTerm,
            setIsFilterVisible,
            setFilters,
            onResetFilters: resetFilters,
            toggleSelectEstimate,
            toggleSelectAll,
            openBulkDelete: () => setBulkDeleteModalOpen(true),
            closeBulkDelete: () => setBulkDeleteModalOpen(false),
            openDelete: handleDeleteClick,
            closeDelete: () => { setIsDeleteModalOpen(false); setEstimateToDelete(null); },
            confirmDelete: () => estimateToDelete && deleteMutation.mutate(estimateToDelete),
            confirmBulkDelete: () => bulkDeleteMutation.mutate(selectedEstimateIds),
            refresh: () => queryClient.invalidateQueries({ queryKey: ['estimates'] })
        }
    };
};

export default useEstimateManager;
