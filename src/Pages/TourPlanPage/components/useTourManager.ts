// src/Pages/TourPlanPage/components/useTourManager.ts
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getTourPlans,
  updateTourStatus,
  bulkDeleteTourPlans,
  createTourPlan,
  type TourPlan,
  type TourStatus,
  type CreateTourRequest
} from '../../../api/tourPlanService';
import { useAuth } from '../../../api/authService';

// Permission interface for type safety
export interface TourPlanPermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canBulkDelete: boolean;
  canApprove: boolean;
  canExportPdf: boolean;
  canExportExcel: boolean;
}

const useTourManager = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  // --- Permissions Grouping (Enterprise Pattern) ---
  const permissions: TourPlanPermissions = useMemo(() => ({
    canCreate: hasPermission("tourPlan", "create"),
    canUpdate: hasPermission("tourPlan", "update"),
    canDelete: hasPermission("tourPlan", "delete"),
    canBulkDelete: hasPermission("tourPlan", "bulkDelete"),
    canApprove: hasPermission("tourPlan", "approve"),
    canExportPdf: hasPermission("tourPlan", "exportPdf"),
    canExportExcel: hasPermission("tourPlan", "exportExcel"),
  }), [hasPermission]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    date: null as Date | null,
    employees: [] as string[],
    statuses: [] as string[],
    months: [] as string[],
  });

  const { data: tourPlans = [], isFetching } = useQuery<TourPlan[]>({
    queryKey: ["tour-plans"],
    queryFn: getTourPlans,
  });

  // --- Mutations (Centralized Business Logic) ---

  const createMutation = useMutation({
    mutationFn: (data: CreateTourRequest) => createTourPlan(data),
    onSuccess: () => {
      toast.success("Tour plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tour-plans"] });
    },
    onError: () => toast.error("Failed to create tour plan"),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTourPlans(ids),
    onSuccess: () => {
      toast.success("Plans deleted successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["tour-plans"] });
    },
    onError: () => toast.error("Failed to delete plans"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TourStatus }) => updateTourStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["tour-plans"] });
    },
    onError: (err: any) => {
      // Use specific error message if available, fallback to generic
      toast.error(err.message || "Failed to update status");
    }
  });

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return tourPlans.filter((plan: TourPlan) => {
      const matchesSearch = plan.placeOfVisit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(plan.status);
      const matchesDate = !filters.date || plan.startDate === filters.date.toISOString().split('T')[0];
      const matchesMonth = filters.months.length === 0 || (() => {
        if (!plan.startDate) return false;
        const monthName = new Date(plan.startDate).toLocaleString('en-US', { month: 'long' });
        return filters.months.includes(monthName);
      })();
      const matchesEmployee = filters.employees.length === 0 || filters.employees.includes(plan.createdBy.name);

      return matchesSearch && matchesStatus && matchesDate && matchesMonth && matchesEmployee;
    });
  }, [tourPlans, searchQuery, filters]);

  return {
    tableState: {
      data: filteredData,
      isLoading: isFetching,
      pagination: {
        currentPage,
        onPageChange: setCurrentPage,
        itemsPerPage: 10,
        totalItems: filteredData.length
      },
      selection: {
        selectedIds,
        onSelect: setSelectedIds
      }
    },
    filterState: {
      searchQuery,
      onSearch: setSearchQuery,
      isVisible: isFilterVisible,
      onToggle: setIsFilterVisible,
      values: filters,
      onFilterChange: setFilters,
      onReset: () => {
        setSearchQuery("");
        setFilters({ date: null, employees: [], statuses: [], months: [] });
        setSelectedIds([]);
      },
      options: {
        employees: Array.from(new Set(tourPlans.map(p => p.createdBy.name)))
      }
    },
    actions: {
      create: async (data: CreateTourRequest) => createMutation.mutateAsync(data),
      bulkDelete: (ids: string[]) => {
        if (ids.length > 0) bulkDeleteMutation.mutate(ids);
      },
      updateStatus: (id: string, status: TourStatus) => updateStatus.mutate({ id, status }),
      isCreating: createMutation.isPending,
      isDeleting: bulkDeleteMutation.isPending,
      isUpdating: updateStatus.isPending
    },
    permissions,
    currentUserId: useAuth().user?.id || useAuth().user?._id,
  };
};

export default useTourManager;