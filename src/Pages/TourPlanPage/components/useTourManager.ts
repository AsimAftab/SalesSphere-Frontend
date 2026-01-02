// src/Pages/TourPlanPage/components/useTourManager.ts
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  getTourPlans, 
  updateTourStatus, 
  bulkDeleteTourPlans,
  createTourPlan, // Added for mutation
  type TourPlan, 
  type TourStatus,
  type CreateTourRequest
} from '../../../api/tourPlanService';

const useTourManager = () => {
  const queryClient = useQueryClient();
  
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
    tourPlans: filteredData,
    isFetching,
    currentPage,
    setCurrentPage,
    isFilterVisible,
    setIsFilterVisible,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    employeeOptions: Array.from(new Set(tourPlans.map(p => p.createdBy.name))),
    onResetFilters: () => {
      setSearchQuery("");
      setFilters({ date: null, employees: [], statuses: [], months: [] });
      setSelectedIds([]);
    },
    selectedIds,
    setSelectedIds,
    // --- Actions ---
    handleCreateTour: async (data: CreateTourRequest) => createMutation.mutateAsync(data),
    handleBulkDelete: () => {
      if (selectedIds.length > 0) bulkDeleteMutation.mutate(selectedIds);
    },
    handleUpdateStatus: (id: string, status: TourStatus) => updateStatus.mutate({ id, status }),
    // --- Loading States ---
    isCreating: createMutation.isPending,
    isDeleting: bulkDeleteMutation.isPending,
    isUpdating: updateStatus.isPending,
  };
};

export default useTourManager;