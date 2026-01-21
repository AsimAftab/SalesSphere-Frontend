import { useState } from 'react';
import { useAuth } from '../../../api/authService';

// Import focused hooks
import { useLeaveData } from './hooks/useLeaveData';
import { useLeavePermissions } from './hooks/useLeavePermissions';
import { useLeaveSelection } from './hooks/useLeaveSelection';
import { useLeaveActions } from './hooks/useLeaveActions';
import { useLeaveFilters } from './hooks/useLeaveFilters';

// Re-export types for backward compatibility
export type { LeavePermissions } from './hooks/useLeavePermissions';

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
  const selection = useLeaveSelection();
  const actions = useLeaveActions();
  const filters = useLeaveFilters(leaves);

  // Return Enterprise Manager Object
  return {
    tableState: {
      data: filters.filteredData,
      isLoading,
      pagination: {
        currentPage,
        onPageChange: setCurrentPage,
        itemsPerPage: 10,
        totalItems: filters.filteredData.length
      },
      selection: {
        selectedIds: selection.selectedIds,
        onSelect: selection.setSelectedIds
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
        selection.clearSelection();
      },
      isUpdating: actions.isUpdating,
      isDeleting: actions.isDeleting
    },
    permissions,
    currentUserId: user?.id,
  };
};
