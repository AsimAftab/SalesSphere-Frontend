// src/Pages/TourPlanPage/TourPlanPage.tsx
import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import TourPlanContent from "./TourPlanContent";
import TourPlanPDFReport from "./TourPlanListPDF";
import ConfirmationModal from "../../components/modals/ConfirmationModal"; // Matches your reference import

// Hooks & Services
import useTourManager from "./components/useTourManager";
import { ExportTourService } from "./components/ExportTourService";
import { type TourPlan } from "../../api/tourPlanService";

const TourPlanPage: React.FC = () => {
  const manager = useTourManager();
  
  // NEW: Local state for delete confirmation orchestration
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleExportPdf = (filteredData: TourPlan[]) => {
    ExportTourService.exportToPdf(
      filteredData, 
      <TourPlanPDFReport data={filteredData} />
    );
  };

  const handleExportExcel = (filteredData: TourPlan[]) => {
    ExportTourService.exportToExcel(filteredData);
  };

  /**
   * Triggers the confirmation modal if items are selected
   */
  const triggerBulkDelete = () => {
    if (manager.selectedIds.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  /**
   * Executes the deletion via the manager hook and closes the modal
   */
  const handleConfirmDeletion = () => {
    manager.handleBulkDelete();
    setIsDeleteModalOpen(false);
  };

  /**
   * Closes the modal and optionally clears selection based on your UX needs
   */
  const handleCancelDeletion = () => {
    setIsDeleteModalOpen(false);
    // Optional: manager.setSelectedIds([]); if you want to clear checkboxes on cancel
  };

  return (
    <Sidebar>
      <TourPlanContent
        tableData={manager.tourPlans}
        isFetchingList={manager.isFetching}
        currentPage={manager.currentPage}
        setCurrentPage={manager.setCurrentPage}
        ITEMS_PER_PAGE={10}
        
        // Selection State passed for Table Checkboxes
        selectedIds={manager.selectedIds}
        setSelectedIds={manager.setSelectedIds}
        
        // Filter UI State
        isFilterVisible={manager.isFilterVisible}
        setIsFilterVisible={manager.setIsFilterVisible}
        searchQuery={manager.searchQuery}
        setSearchQuery={manager.setSearchQuery}
        
        // Filter Data State - Explicit types resolve ts(7006)
        selectedDate={manager.filters.date}
        setSelectedDate={(date: Date | null) => 
          manager.setFilters(prev => ({ ...prev, date }))
        }
        selectedEmployee={manager.filters.employees}
        setSelectedEmployee={(employees: string[]) => 
          manager.setFilters(prev => ({ ...prev, employees }))
        }
        selectedStatus={manager.filters.statuses}
        setSelectedStatus={(statuses: string[]) => 
          manager.setFilters(prev => ({ ...prev, statuses }))
        }
        selectedMonth={manager.filters.months}
        setSelectedMonth={(months: string[]) => 
          manager.setFilters(prev => ({ ...prev, months }))
        }
        
        employeeOptions={manager.employeeOptions}
        onResetFilters={manager.onResetFilters}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        
        // Connects Content Delete button to the Page Modal
        onBulkDelete={triggerBulkDelete}
        isDeletingBulk={manager.isDeleting}
        
        onUpdateStatus={manager.handleUpdateStatus}
        isUpdatingStatus={manager.isUpdating}
      />

      {/* FIXED: Prop names updated to match Reference & resolve ts(2322) */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${manager.selectedIds.length} item(s)? This action cannot be undone.`}
        confirmButtonText={manager.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={handleConfirmDeletion}
        onCancel={handleCancelDeletion}
      />
    </Sidebar>
  );
};

export default TourPlanPage;