// src/Pages/TourPlanPage/TourPlanPage.tsx
import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import TourPlanContent from "./TourPlanContent";
import TourPlanPDFReport from "./TourPlanListPDF";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import TourPlanFormModal from "../../components/modals/TourPlanFormModal";
import ErrorBoundary from "../../components/UI/ErrorBoundary";

// Hooks & Services
import useTourManager from "./components/useTourManager";
import { ExportTourService } from "./components/ExportTourService";
import { type TourPlan } from "../../api/tourPlanService";

const TourPlanPage: React.FC = () => {
  const manager = useTourManager();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleExportPdf = (filteredData: TourPlan[]) => {
    ExportTourService.exportToPdf(filteredData, <TourPlanPDFReport data={filteredData} />);
  };

  const handleExportExcel = (filteredData: TourPlan[]) => {
    ExportTourService.exportToExcel(filteredData);
  };

  const triggerBulkDelete = (ids: string[]) => {
    if (ids.length > 0) {
      manager.setSelectedIds(ids);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDeletion = async () => {
    await manager.handleBulkDelete();
    setIsDeleteModalOpen(false);
  }

  const handleCreateSubmit = async (formData: any) => {
    try {
      await manager.handleCreateTour(formData);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Errors are handled inside the mutation hook via toast
    }
  };

  return (
    <Sidebar>
      <ErrorBoundary>
        <TourPlanContent
          tableData={manager.tourPlans}
          isFetchingList={manager.isFetching}
          currentPage={manager.currentPage}
          setCurrentPage={manager.setCurrentPage}
          ITEMS_PER_PAGE={10}
          selectedIds={manager.selectedIds}
          setSelectedIds={manager.setSelectedIds}
          isFilterVisible={manager.isFilterVisible}
          setIsFilterVisible={manager.setIsFilterVisible}
          searchQuery={manager.searchQuery}
          setSearchQuery={manager.setSearchQuery}
          selectedDate={manager.filters.date}
          setSelectedDate={(date) => manager.setFilters(prev => ({ ...prev, date }))}
          selectedEmployee={manager.filters.employees}
          setSelectedEmployee={(employees) => manager.setFilters(prev => ({ ...prev, employees }))}
          selectedStatus={manager.filters.statuses}
          setSelectedStatus={(statuses) => manager.setFilters(prev => ({ ...prev, statuses }))}
          selectedMonth={manager.filters.months}
          setSelectedMonth={(months) => manager.setFilters(prev => ({ ...prev, months }))}
          employeeOptions={manager.employeeOptions}
          onResetFilters={manager.onResetFilters}
          onExportPdf={handleExportPdf}
          onExportExcel={handleExportExcel}
          onBulkDelete={triggerBulkDelete}
          isDeletingBulk={manager.isDeleting}
          onUpdateStatus={manager.handleUpdateStatus}
          isUpdatingStatus={manager.isUpdating}
          handleCreate={() => setIsCreateModalOpen(true)}
          isSaving={manager.isCreating || manager.isUpdating}
          permissions={manager.permissions}
          currentUserId={manager.currentUserId}
        />
      </ErrorBoundary>

      <TourPlanFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSubmit}
        isSaving={manager.isCreating}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${manager.selectedIds.length} item(s)? This action cannot be undone.`}
        confirmButtonText={manager.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={handleConfirmDeletion}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          manager.setSelectedIds([]);
        }}
      />
    </Sidebar>
  );
};

export default TourPlanPage;