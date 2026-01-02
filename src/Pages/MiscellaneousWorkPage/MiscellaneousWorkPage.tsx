import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import toast from "react-hot-toast";

// API and Types
import {
  getMiscWorks,
  bulkDeleteMiscWorks,
  type GetMiscWorksOptions,
  type GetMiscWorksResponse,
  type MiscWork as MiscWorkType,
} from "../../api/miscellaneousWorkService";

// Services and Components
import { MiscWorkExportService } from "./components/MiscWorkExportService"; // Refactored Service
import MiscellaneousWorkContent from "./MiscellaneousWorkContent";
import ViewImageModal from "../../components/modals/ViewImageModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";

const MISC_WORK_KEYS = {
  all: ["misc-works"] as const,
  list: (filters: GetMiscWorksOptions) => [...MISC_WORK_KEYS.all, "list", filters] as const,
};

const MiscellaneousWorkPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // --- UI State Management ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagesToView, setImagesToView] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // --- Filter State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string[]>([]);

  const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /**
   * REFACTORED: Export Handlers
   * Logic is now delegated to the MiscWorkExportService.
   */
  const handleExportPdf = (filteredData: MiscWorkType[]) => {
    MiscWorkExportService.toPdf(filteredData);
  };

  const handleExportExcel = (filteredData: MiscWorkType[]) => {
    MiscWorkExportService.toExcel(filteredData);
  };

  /**
   * Server-Side Query Orchestration
   * Ensures date-safe string formatting to prevent timezone shift.
   */
  const listQueryOptions: GetMiscWorksOptions = useMemo(() => ({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery,
    date: selectedDate ? 
      `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` 
      : undefined,
    employees: selectedEmployee, 
    month: selectedMonth.length > 0 ? (monthsList.indexOf(selectedMonth[0]) + 1).toString() : undefined,
  }), [currentPage, searchQuery, selectedDate, selectedEmployee, selectedMonth]);

  const { data: listResponse, isFetching: isFetchingList } = useQuery<GetMiscWorksResponse, Error>({
    queryKey: MISC_WORK_KEYS.list(listQueryOptions),
    queryFn: () => getMiscWorks(listQueryOptions),
    placeholderData: (prev) => prev, 
  });

  const employeeOptions = useMemo(() => {
    if (!listResponse?.data) return [];
    const names = listResponse.data.map(item => item.employee?.name).filter(Boolean);
    return Array.from(new Set(names)).map(name => ({ label: name, value: name }));
  }, [listResponse?.data]);

  // --- Mutations ---
  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteMiscWorks,
    onSuccess: () => {
      toast.success("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: MISC_WORK_KEYS.all });
      setIsDeleteModalOpen(false);
      setIdsToDelete([]);
    },
    onError: () => toast.error("Failed to delete records")
  });

  return (
    <Sidebar>
      <MiscellaneousWorkContent
        tableData={listResponse?.data || []}
        isFetchingList={isFetchingList || bulkDeleteMutation.isPending}
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
        onResetFilters={() => { 
          setSearchQuery(""); 
          setSelectedDate(null); 
          setSelectedEmployee([]); 
          setSelectedMonth([]); 
          setCurrentPage(1); 
        }}
        handleViewImage={(imgs: string[]) => { setImagesToView(imgs); setIsImageModalOpen(true); }}
        onDelete={(id: string) => { setIdsToDelete([id]); setIsDeleteModalOpen(true); }}
        handleBulkDelete={(ids: string[]) => { setIdsToDelete(ids); setIsDeleteModalOpen(true); }}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      {/* --- Overlay Modals --- */}
      <ViewImageModal 
        isOpen={isImageModalOpen} 
        onClose={() => setIsImageModalOpen(false)} 
        images={imagesToView} 
        title="Attached Work Images" 
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${idsToDelete.length} item(s)? This action cannot be undone.`}
        onConfirm={() => bulkDeleteMutation.mutate(idsToDelete)}
        onCancel={() => { setIsDeleteModalOpen(false); setIdsToDelete([]); }}
        confirmButtonText={bulkDeleteMutation.isPending ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default MiscellaneousWorkPage;