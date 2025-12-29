import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import toast from "react-hot-toast";

// Import types and services
import {
  getMiscWorks,
  deleteMiscWork,
  type GetMiscWorksOptions,
  type GetMiscWorksResponse,
} from "../../api/miscellaneousWorkService";

// Components
import MiscellaneousWorkContent from "./MiscellaneousWorkContent";
import ViewImageModal from "../../components/modals/ViewImageModal";

const MISC_WORK_KEYS = {
  all: ["misc-works"] as const,
  list: (filters: GetMiscWorksOptions) =>
    [...MISC_WORK_KEYS.all, "list", filters] as const,
};

const MiscellaneousWorkPage: React.FC = () => {
  const queryClient = useQueryClient();

  // --- STATE MANAGEMENT ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagesToView, setImagesToView] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filter States
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string[]>([]);

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // --- HANDLERS ---
  const onResetFilters = () => {
    setSearchQuery("");
    setSelectedDate(null);
    setSelectedEmployee([]); 
    setSelectedMonth([]);    
    setCurrentPage(1);
    toast.success("Filters reset");
  };

  // --- QUERY CONSTRUCTION ---
  const listQueryOptions: GetMiscWorksOptions = useMemo(() => {
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchQuery,
      date: selectedDate?.toISOString().split('T')[0],
      employees: selectedEmployee, 
      month: selectedMonth.length > 0 ? (monthsList.indexOf(selectedMonth[0]) + 1).toString() : undefined,
    };
  }, [currentPage, searchQuery, selectedDate, selectedEmployee, selectedMonth]);

  // --- DATA FETCHING ---
  const {
    data: listResponse,
    error: listError,
    isFetching: isFetchingList,
  } = useQuery<GetMiscWorksResponse, Error>({
    queryKey: MISC_WORK_KEYS.list(listQueryOptions),
    queryFn: () => getMiscWorks(listQueryOptions),
    placeholderData: (prev) => prev,
  });

  const employeeOptions = useMemo(() => {
    if (!listResponse?.data) return [];
    const names = listResponse.data.map(item => item.employee?.name).filter(Boolean);
    return Array.from(new Set(names)).map(name => ({ label: name, value: name }));
  }, [listResponse?.data]);

  // --- MUTATIONS ---
  const deleteMutation = useMutation({
    mutationFn: deleteMiscWork,
    onSuccess: () => {
      toast.success("Entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: MISC_WORK_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete entry");
    }
  });

  // FIX: Removed window.confirm. Confirmation is handled in the child component.
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleViewImage = (images: string[]) => {
    setImagesToView(images);
    setIsImageModalOpen(true);
  };

  if (listError) {
    return (
      <Sidebar>
        <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg mx-4 mt-4 border border-red-100">
          Error loading miscellaneous work data. Please try again.
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <MiscellaneousWorkContent
        tableData={listResponse?.data || []}
        isFetchingList={isFetchingList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={listResponse?.pagination.pages || 1}
        totalItems={listResponse?.pagination.total || 0}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        isFilterVisible={isFilterVisible}
        setIsFilterVisible={setIsFilterVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedEmployee={selectedEmployee}      
        setSelectedEmployee={setSelectedEmployee} 
        selectedMonth={selectedMonth}            
        setSelectedMonth={setSelectedMonth}      
        employeeOptions={employeeOptions} 
        onResetFilters={onResetFilters}
        handleViewImage={handleViewImage}
        onDelete={handleDelete}
      />

      <ViewImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={imagesToView}
        title="Attached Work Images"
      />
    </Sidebar>
  );
};

export default MiscellaneousWorkPage;