import { useState, useCallback } from 'react';
import { useAuth } from '@/api/authService';
import { useTableSelection } from '@/hooks/useTableSelection';

// Import focused hooks
import { useLeaveData } from './useLeaveData';
import { useLeavePermissions } from './useLeavePermissions';
import { useLeaveActions } from './useLeaveActions';
import { useLeaveFilters } from './useLeaveFilters';

// Re-export types for backward compatibility
export type { LeavePermissions } from './useLeavePermissions';

const ITEMS_PER_PAGE = 10;

/**
 * Composition Hook for Leave Management
 * 
 * Single Responsibility: Orchestrate focused hooks into unified interface
 * This hook composes smaller, testable hooks following SOLID principles
 */
export const useLeaveManager = () => {
  const { user } = useAuth();

  // State
  const [currentPage, setCurrentPage] = useState(1);

  // Focused Hooks
  const { leaves, isLoading } = useLeaveData();
  const permissions = useLeavePermissions();
  const actions = useLeaveActions();
  const filters = useLeaveFilters(leaves);

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filters.filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Selection (using shared hook for consistency)
  const { selectedIds, toggleRow, selectAll, clearSelection, selectMultiple } = useTableSelection(paginatedData);

  // Select all handler for current page
  const handleSelectAll = useCallback((checked: boolean) => {
    selectAll(checked);
  }, [selectAll]);

  // Return Enterprise Manager Object
  return {
    tableState: {
      data: filters.filteredData,
      paginatedData, // Pre-sliced data for table
      isLoading,
      pagination: {
        currentPage,
        onPageChange: setCurrentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        totalItems: filters.filteredData.length
      },
      selection: {
        selectedIds,
        toggleRow,
        selectAll: handleSelectAll,
        clearSelection,
        onSelect: selectMultiple // Map selectMultiple to onSelect for compatibility
      }
    },
    filterState: {
      searchQuery: filters.searchQuery,
      onSearch: filters.setSearchQuery,
      isVisible: filters.isFilterVisible,
      onToggle: filters.setIsFilterVisible,
      values: filters.filters,
      onFilterChange: filters.setFilters,
      options: filters.filterOptions
    },
    actions: {
      updateStatus: actions.updateStatus,
      bulkDelete: (ids: string[]) => {
        actions.bulkDelete(ids);
        clearSelection();
      },
      isUpdating: actions.isUpdating,
      isDeleting: actions.isDeleting
    },
    permissions,
    currentUserId: user?._id || user?.id,
    userRole: user?.role,
  };
};
