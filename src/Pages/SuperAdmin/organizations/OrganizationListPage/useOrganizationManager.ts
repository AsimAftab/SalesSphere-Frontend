import { useState, useCallback } from 'react';
import { useOrganizationData } from './hooks/useOrganizationData';
import { useOrganizationFilters } from './hooks/useOrganizationFilters';
import { useOrganizationActions } from './hooks/useOrganizationActions';
import { useTableSelection } from '../../../../components/hooks/useTableSelection';
import { ITEMS_PER_PAGE } from './constants';
import type { Organization } from '../../../../api/superAdmin/organizationService';

/**
 * Composition Hook for Organization Management
 * 
 * Orchestrates:
 * 1. Data Fetching (useOrganizationData)
 * 2. Filtering & Search (useOrganizationFilters)
 * 3. CRUD Actions (useOrganizationActions)
 * 4. Selection & Pagination (local + useTableSelection)
 */
export const useOrganizationManager = () => {
    // 1. Data
    const { organizations, customPlans, loading, error, refreshComponents } = useOrganizationData();

    // 2. Filters
    const {
        searchQuery, setSearchQuery,
        isFilterVisible, setIsFilterVisible,
        filters, setFilters,
        filteredData, filterOptions
    } = useOrganizationFilters(organizations, customPlans);

    // 3. Actions
    const actions = useOrganizationActions(refreshComponents);

    // 4. Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // 5. Selection
    const { selectedIds, toggleRow, selectAll, clearSelection } = useTableSelection(paginatedData);

    const handleSelectAll = useCallback((checked: boolean) => {
        selectAll(checked);
    }, [selectAll]);

    // 6. Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

    const openAddModal = useCallback(() => {
        setEditingOrg(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((org: Organization) => {
        setEditingOrg(org);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingOrg(null);
    }, []);

    return {
        tableState: {
            data: filteredData,
            paginatedData,
            isLoading: loading,
            error,
            pagination: {
                currentPage,
                onPageChange: setCurrentPage,
                itemsPerPage: ITEMS_PER_PAGE,
                totalItems: filteredData.length
            },
            selection: {
                selectedIds,
                toggleRow,
                selectAll: handleSelectAll,
                clearSelection
            }
        },
        filterState: {
            searchQuery,
            onSearch: setSearchQuery,
            isVisible: isFilterVisible,
            onToggle: setIsFilterVisible,
            values: filters,
            onFilterChange: setFilters,
            options: filterOptions
        },
        actions: {
            ...actions,
            refresh: refreshComponents
        },
        modalState: {
            isOpen: isModalOpen,
            editingOrg,
            openAdd: openAddModal,
            openEdit: openEditModal,
            close: closeModal
        }
    };
};
