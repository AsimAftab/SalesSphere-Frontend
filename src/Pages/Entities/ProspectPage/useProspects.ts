import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../../api/authService';
import {
    getProspects,
    addProspect,
    getProspectCategoriesList
} from '../../../api/prospectService';

/**
 * useProspects Hook
 * @param selectedCategories - Array of category names to drive dynamic brand filtering
 */
export const useProspects = (selectedCategories: string[] = []) => {
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();

    // 1. Fetch all prospects
    const prospectsQuery = useQuery({
        queryKey: ['prospects'],
        queryFn: getProspects,
        staleTime: 1000 * 60 * 5,
    });

    // 2. Fetch category/brand definitions
    const categoriesQuery = useQuery({
        queryKey: ['prospectCategories'],
        queryFn: getProspectCategoriesList,
        staleTime: 1000 * 60 * 30,
    });

    /**
     * ✅ DYNAMIC BRAND FILTERING LOGIC
     * This recalculates the brand dropdown options based on selected categories.
     */
    const availableBrands = useMemo(() => {
        const allCategories = categoriesQuery.data || [];

        // Scenario A: No categories selected - Show all unique brands independently
        if (selectedCategories.length === 0) {
            const brands = allCategories.flatMap(category => category.brands || []);
            return Array.from(new Set(brands)).sort();
        }

        // Scenario B: Categories selected - Narrow down brands to those within selection
        const filteredBrands = allCategories
            .filter(category => selectedCategories.includes(category.name))
            .flatMap(category => category.brands || []);

        return Array.from(new Set(filteredBrands)).sort();
    }, [categoriesQuery.data, selectedCategories]); // Recalculate when category filter changes

    // 3. Mutation for adding a new prospect
    const addMutation = useMutation({
        mutationFn: addProspect,
        onSuccess: () => {
            toast.success('Prospect added successfully!');
            queryClient.invalidateQueries({ queryKey: ['prospects'] });
            queryClient.invalidateQueries({ queryKey: ['prospectStats'] });
            queryClient.invalidateQueries({ queryKey: ['prospectCategories'] });
            queryClient.invalidateQueries({ queryKey: ['brandProspectCounts'] });
        },
        onError: (err: Error) => toast.error(err.message || 'Failed to add prospect'),
    });

    return {
        prospects: prospectsQuery.data || null,
        categories: categoriesQuery.data || [],
        availableBrands,
        isLoading: prospectsQuery.isPending,
        isError: prospectsQuery.isError,
        error: prospectsQuery.error?.message || null,
        isCreating: addMutation.isPending,
        addProspect: addMutation.mutate,
        permissions: {
            canCreate: hasPermission('prospects', 'create'),
            canExportPdf: hasPermission('prospects', 'exportPdf'),
            canExportExcel: hasPermission('prospects', 'exportExcel'),
        }
    };
};