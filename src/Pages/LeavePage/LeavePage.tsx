import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import LeaveContent from "./LeaveContent";
import LeaveListPDF from "./LeaveListPDF";
import ConfirmationModal from "../../components/modals/ConfirmationModal";

// Hooks & Services
import { useLeaveManager } from "./Components/useLeaveManager";
import { ExportLeaveService } from "./Components/ExportLeaveService";
import { type LeaveRequest } from "../../api/leaveService";

const LeavePage: React.FC = () => {
  const manager = useLeaveManager();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- Handlers ---
  const handleExportPdf = (filteredData: LeaveRequest[]) => {
    ExportLeaveService.exportToPdf(filteredData, <LeaveListPDF data={filteredData} />);
  };

  const handleExportExcel = (filteredData: LeaveRequest[]) => {
    ExportLeaveService.exportToExcel(filteredData);
  };

  const triggerBulkDelete = (ids: string[]) => {
    if (ids.length > 0) {
      manager.setSelectedIds(ids);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDeletion = async () => {
    await manager.handleBulkDelete(manager.selectedIds);
    setIsDeleteModalOpen(false);
  };

  return (
    <Sidebar>
      <LeaveContent
        tableData={manager.leaves}
        isFetchingList={manager.isLoading}
        currentPage={manager.currentPage}
        setCurrentPage={manager.setCurrentPage}
        ITEMS_PER_PAGE={10}
        isFilterVisible={manager.isFilterVisible}
        setIsFilterVisible={manager.setIsFilterVisible}
        searchQuery={manager.searchQuery}
        setSearchQuery={manager.setSearchQuery}
        // Filter Props
        selectedDate={manager.filters.date}
        setSelectedDate={(date) => manager.setFilters(prev => ({ ...prev, date }))}
        selectedEmployee={manager.filters.employees}
        setSelectedEmployee={(employees) => manager.setFilters(prev => ({ ...prev, employees }))}
        selectedStatus={manager.filters.statuses}
        setSelectedStatus={(statuses) => manager.setFilters(prev => ({ ...prev, statuses }))}
        selectedMonth={manager.filters.months}
        setSelectedMonth={(months) => manager.setFilters(prev => ({ ...prev, months }))}
        employeeOptions={manager.employeeOptions}
        // Action Props
        onResetFilters={() => manager.setFilters({ date: null, employees: [], statuses: [], months: [] })}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        onUpdateStatus={manager.handleUpdateStatus}
        isUpdatingStatus={manager.isUpdating}
        selectedIds={manager.selectedIds}
        setSelectedIds={manager.setSelectedIds}
        onBulkDelete={triggerBulkDelete}
        isDeletingBulk={manager.isDeleting}
      />

      {/* GLOBAL MODALS */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Bulk Deletion"
        message={`Are you sure you want to delete ${manager.selectedIds.length} leave request(s)? This action will sync with attendance records and cannot be undone.`}
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

export default LeavePage;