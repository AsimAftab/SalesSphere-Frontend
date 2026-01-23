import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import LeaveContent from "./LeaveContent";
import LeaveListPDF from "./LeaveListPDF";
import ConfirmationModal from "../../components/modals/CommonModals/ConfirmationModal";
import CreateLeaveModal from "../../components/modals/Leaves/CreateLeaveModal";
import ErrorBoundary from "../../components/UI/ErrorBoundary/ErrorBoundary";

// Hooks & Services
import { useLeaveManager } from "./useLeaveManager";
import { ExportLeaveService } from "./components/ExportLeaveService";
import { type LeaveRequest } from "../../api/leaveService";

const LeavePage: React.FC = () => {
  const manager = useLeaveManager();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // --- Handlers ---
  // Merged into manager actions or handled below
  const handleConfirmDeletion = async () => {
    // We need to access actions from manager
    if (manager.actions && manager.actions.bulkDelete) {
      await manager.actions.bulkDelete(manager.tableState.selection.selectedIds);
    }
    setIsDeleteModalOpen(false);
  };

  const triggerBulkDelete = (ids: string[]) => {
    if (ids.length > 0) {
      manager.tableState.selection.onSelect(ids);
      setIsDeleteModalOpen(true);
    }
  };

  // Construct combined actions object
  const combinedActions = {
    ...manager.actions,
    exportPdf: (data: LeaveRequest[]) => ExportLeaveService.exportToPdf(data, <LeaveListPDF data={data} />),
    exportExcel: (data: LeaveRequest[]) => ExportLeaveService.exportToExcel(data),
    onResetFilters: () => manager.filterState.onFilterChange({ date: null, employees: [], statuses: [], months: [] }),
    // Override bulkDelete to open modal
    bulkDelete: triggerBulkDelete,
    onCreateClick: () => setIsCreateModalOpen(true)
  };

  return (
    <Sidebar>
      <ErrorBoundary>
        <LeaveContent
          tableState={manager.tableState}
          filterState={manager.filterState}
          actions={combinedActions}
          permissions={manager.permissions}
          currentUserId={manager.currentUserId}
          userRole={manager.userRole}
        />
      </ErrorBoundary>

      {/* GLOBAL MODALS */}
      <CreateLeaveModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Bulk Deletion"
        message={`Are you sure you want to delete ${manager.tableState.selection.selectedIds.length} leave request(s)? This action will sync with attendance records and cannot be undone.`}
        confirmButtonText={manager.actions.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={handleConfirmDeletion}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          manager.tableState.selection.onSelect([]);
        }}
      />
    </Sidebar>
  );
};

export default LeavePage;