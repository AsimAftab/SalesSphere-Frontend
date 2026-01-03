// src/Pages/MiscellaneousWorkPage/components/useMiscellaneousManager.ts
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getMiscWorks,
  bulkDeleteMiscWorks,
  type GetMiscWorksResponse
} from '../../../api/miscellaneousWorkService';

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const useMiscellaneousManager = () => {
  const queryClient = useQueryClient();

  // --- 1. Basic UI State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // --- 2. Filter State ---
  const [filters, setFilters] = useState({
    date: null as Date | null,
    employees: [] as string[],
    months: [] as string[],
  });

  // --- 3. Data Fetching ---
  // Note: We fetch a large limit (e.g., 1000) or all data to perform local filtering
  const { data: listResponse, isFetching } = useQuery<GetMiscWorksResponse>({
    queryKey: ["misc-works-list"],
    queryFn: () => getMiscWorks({ limit: 1000, page: 1 }), 
  });

  const allMiscWorks = listResponse?.data || [];

  // --- 4. Mutations ---
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteMiscWorks(ids),
    onSuccess: () => {
      toast.success("Records deleted successfully");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["misc-works-list"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete records"),
  });

  // --- 5. Local Filtering Logic ---
  const filteredData = useMemo(() => {
    return allMiscWorks.filter((work) => {
      // 1. Search Logic: Nature of Work, Address, or Employee Name
      const nature = (work.natureOfWork || "").toLowerCase();
      const addr = (work.address || "").toLowerCase();
      const emp = (work.employee?.name || "").toLowerCase();
      const term = searchQuery.toLowerCase();

      const matchesSearch = term === "" || 
                            nature.includes(term) || 
                            addr.includes(term) || 
                            emp.includes(term);

      // 2. Employee Filter
      const matchesEmployee = filters.employees.length === 0 || 
                              filters.employees.includes(work.employee?.name || "");

      // 3. Month Filter (Based on workDate)
      const matchesMonth = filters.months.length === 0 || (() => {
        if (!work.workDate) return false;
        const monthName = MONTH_OPTIONS[new Date(work.workDate).getMonth()];
        return filters.months.includes(monthName);
      })();

      // 4. Exact Date Logic (Preventing Timezone Shifts)
      const matchesDate = !filters.date || (() => {
        if (!work.workDate) return false;
        
        // Extract YYYY-MM-DD from the record (server date)
        const workDateString = new Date(work.workDate).toISOString().split('T')[0];

        // Manually construct YYYY-MM-DD from the local filter date
        const year = filters.date!.getFullYear();
        const month = String(filters.date!.getMonth() + 1).padStart(2, '0');
        const day = String(filters.date!.getDate()).padStart(2, '0');
        const localFilterDate = `${year}-${month}-${day}`;

        return workDateString === localFilterDate;
      })();

      return matchesSearch && matchesEmployee && matchesMonth && matchesDate;
    });
  }, [allMiscWorks, searchQuery, filters]);

  // --- 6. Derived Options ---
  const employeeOptions = useMemo(() => {
    const names = allMiscWorks
      .map(item => item.employee?.name)
      .filter((name): name is string => Boolean(name));
    
    return Array.from(new Set(names)).map(name => ({ label: name, value: name }));
  }, [allMiscWorks]);

  // --- 7. Reset Logic ---
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters({ date: null, employees: [], months: [] });
    setCurrentPage(1);
    setSelectedIds([]);
  };

  return {
    // Data
    miscWorks: filteredData,
    isFetching,
    
    // Pagination & Search
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    
    // Filter Visibility
    isFilterVisible,
    setIsFilterVisible,
    
    // Filters & Options
    filters,
    setFilters,
    employeeOptions,
    onResetFilters: handleResetFilters,
    
    // Selection
    selectedIds,
    setSelectedIds,
    
    // Actions
    handleBulkDelete: (ids: string[]) => bulkDeleteMutation.mutateAsync(ids),
    isDeleting: bulkDeleteMutation.isPending,
    
    // Totals (for pagination display)
    totalItems: filteredData.length,
  };
};

export default useMiscellaneousManager;