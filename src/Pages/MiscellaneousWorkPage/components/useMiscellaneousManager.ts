import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getMiscWorks,
  bulkDeleteMiscWorks,
  deleteMiscWork,
  type GetMiscWorksResponse
} from '../../../api/miscellaneousWorkService';
import { useAuth } from '../../../api/authService';

// --- Constants ---
const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Define permissions interface for type safety
export interface MiscWorkPermissions {
  canDelete: boolean;
  canExportPdf: boolean;
  canExportExcel: boolean;
  canViewDetails: boolean;
}

/**
 * Custom hook for managing Miscellaneous Work page state and operations.
 * Centralizes data fetching, filtering, pagination, permissions, and CRUD mutations.
 * Follows the Manager Hook pattern with structured state/actions/permissions return.
 * 
 * @returns Object containing:
 *   - state: All UI state including data, filters, modals, and loading states
 *   - actions: All mutation handlers and state setters
 *   - permissions: User permission flags for the module
 * 
 * @example
 * ```tsx
 * const { state, actions, permissions } = useMiscellaneousManager();
 * // Access data: state.miscWorks
 * // Open delete modal: actions.modals.openDeleteModal(ids)
 * // Check permission: permissions.canDelete
 * ```
 */
const useMiscellaneousManager = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  // --- 1. Basic UI State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // --- 1b. Modal State (Enterprise SRP Refactor) ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagesToView, setImagesToView] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- 2. Filter State ---
  const [filters, setFilters] = useState({
    date: null as Date | null,
    employees: [] as string[],
    months: [] as string[],
    assigners: [] as string[],
  });

  // --- 3. Data Fetching ---
  const { data: listResponse, isFetching } = useQuery<GetMiscWorksResponse>({
    queryKey: ["misc-works-list"],
    queryFn: () => getMiscWorks({}), // Matching TourPlan: No explicit limit, rely on backend default (All)
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const allMiscWorks = listResponse?.data || [];

  // --- 4. Permissions Grouping (Enterprise Pattern) ---
  const permissions: MiscWorkPermissions = useMemo(() => ({
    canDelete: hasPermission("miscellaneousWork", "delete"),
    canExportPdf: hasPermission("miscellaneousWork", "exportPdf"),
    canExportExcel: hasPermission("miscellaneousWork", "exportExcel"),
    canViewDetails: hasPermission("miscellaneousWork", "viewDetails"),
  }), [hasPermission]);

  // --- 5. Mutations ---
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteMiscWorks(ids),
    onSuccess: () => {
      toast.success("Records deleted successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["misc-works-list"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete records"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMiscWork(id),
    onSuccess: () => {
      toast.success("Record deleted successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["misc-works-list"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete record"),
  });

  // --- 6. Local Filtering Logic ---
  const filteredData = useMemo(() => {
    return allMiscWorks.filter((work) => {
      // Search Logic
      const nature = (work.natureOfWork || "").toLowerCase();
      const addr = (work.address || "").toLowerCase();
      const emp = (work.employee?.name || "").toLowerCase();
      const term = searchQuery.toLowerCase();

      const matchesSearch = term === "" ||
        nature.includes(term) ||
        addr.includes(term) ||
        emp.includes(term);

      // Employee Filter
      const matchesEmployee = filters.employees.length === 0 ||
        filters.employees.includes(work.employee?.name || "");

      // Assigner Filter
      const matchesAssigner = filters.assigners.length === 0 ||
        filters.assigners.includes(work.assignedBy?.name || "");

      // Month Filter
      const matchesMonth = filters.months.length === 0 || (() => {
        if (!work.workDate) return false;
        const monthName = MONTH_OPTIONS[new Date(work.workDate).getMonth()];
        return filters.months.includes(monthName);
      })();

      // Exact Date Logic
      const matchesDate = !filters.date || (() => {
        if (!work.workDate) return false;
        const workDateString = new Date(work.workDate).toISOString().split('T')[0];
        const year = filters.date!.getFullYear();
        const month = String(filters.date!.getMonth() + 1).padStart(2, '0');
        const day = String(filters.date!.getDate()).padStart(2, '0');
        const localFilterDate = `${year}-${month}-${day}`;
        return workDateString === localFilterDate;
      })();

      return matchesSearch && matchesEmployee && matchesMonth && matchesDate && matchesAssigner;
    });
  }, [allMiscWorks, searchQuery, filters]);

  // --- 7. Derived Options ---
  const employeeOptions = useMemo(() => {
    const names = allMiscWorks
      .map(item => item.employee?.name)
      .filter((name): name is string => Boolean(name));

    return Array.from(new Set(names)).map(name => ({ label: name, value: name }));
  }, [allMiscWorks]);

  const assignerOptions = useMemo(() => {
    const names = allMiscWorks
      .map(item => item.assignedBy?.name)
      .filter((name): name is string => Boolean(name));

    return Array.from(new Set(names)).map(name => ({ label: name, value: name }));
  }, [allMiscWorks]);

  // --- 8. Reset Logic ---
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters({ date: null, employees: [], months: [], assigners: [] });
    setCurrentPage(1);
    setSelectedIds([]);
  };

  return {
    state: {
      miscWorks: filteredData,
      isFetching,
      currentPage,
      searchQuery,
      isFilterVisible,
      filters,
      selectedIds,
      modals: {
        isImageModalOpen,
        imagesToView,
        isDeleteModalOpen
      },
      employeeOptions,
      assignerOptions,
      totalItems: filteredData.length,
      isDeleting: bulkDeleteMutation.isPending
    },
    actions: {
      setCurrentPage,
      setSearchQuery,
      setIsFilterVisible,
      setFilters,
      setSelectedIds,
      onResetFilters: handleResetFilters,
      handleDelete: (id: string) => deleteMutation.mutateAsync(id),
      handleBulkDelete: (ids: string[]) => bulkDeleteMutation.mutateAsync(ids),
      modals: {
        openImageModal: (images: string[]) => {
          setImagesToView(images);
          setIsImageModalOpen(true);
        },
        closeImageModal: () => setIsImageModalOpen(false),
        openDeleteModal: (ids: string[]) => {
          setSelectedIds(ids);
          setIsDeleteModalOpen(true);
        },
        closeDeleteModal: () => {
          setIsDeleteModalOpen(false);
          setSelectedIds([]);
        }
      }
    },
    permissions,
  };
};

export default useMiscellaneousManager;