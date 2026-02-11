import React, { useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import LeaveContent from "./LeaveContent";
import LeaveListPDF from "./LeaveListPDF";
import ConfirmationModal from "@/components/modals/CommonModals/ConfirmationModal";
import CreateLeaveModal from "@/components/modals/Leaves/CreateLeaveModal";

// Hooks & Services
import { useLeaveManager } from "./hooks/useLeaveManager";
import { LeaveExportService } from "./components/LeaveExportService";
import { type LeaveRequest } from "@/api/leaveService";
import { ErrorBoundary } from '@/components/ui';

const LeavePage: React.FC = () => {
  const manager = useLeaveManager();
  const [leaveIdToDelete, setLeaveIdToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [leaveToEdit, setLeaveToEdit] = useState<LeaveRequest | null>(null);

  // --- Handlers ---
  // Merged into manager actions or handled below
  const handleConfirmDeletion = async () => {
    // We need to access actions from manager
    if (manager.actions && manager.actions.bulkDelete) {
      await manager.actions.bulkDelete(manager.tableState.selection.selectedIds);
    }
    setIsDeleteModalOpen(false);
  };

  const handleConfirmSingleDelete = async () => {
    if (leaveIdToDelete) {
      await manager.actions.deleteLeave(leaveIdToDelete);
      setLeaveIdToDelete(null);
    }
  };

  const triggerBulkDelete = (ids: string[]) => {
    if (ids.length > 0) {
      // Check for approved leaves
      const selectedLeaves = manager.tableState.data.filter(leave => ids.includes(leave.id));
      const hasApproved = selectedLeaves.some(leave => leave.status?.toLowerCase() === 'approved');

      if (hasApproved) {
        toast.error("Cannot delete approved leave requests. Please deselect them to proceed.");
        return;
      }

      manager.tableState.selection.onSelect(ids);
      setIsDeleteModalOpen(true);
    }
  };

  const handleEditClick = (leave: LeaveRequest) => {
    setLeaveToEdit(leave);
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setLeaveIdToDelete(id);
  };

  // Construct combined actions object
  const combinedActions = {
    ...manager.actions,
    exportPdf: (data: LeaveRequest[]) => LeaveExportService.toPdf(data, <LeaveListPDF data={data} />),
    exportExcel: (data: LeaveRequest[]) => LeaveExportService.toExcel(data),
    onResetFilters: () => manager.filterState.onFilterChange({ date: null, employees: [], statuses: [], months: [] }),
    // Override bulkDelete to open modal
    bulkDelete: triggerBulkDelete,
    onCreateClick: manager.userRole === 'admin' ? undefined : () => {
      setLeaveToEdit(null);
      setIsCreateModalOpen(true);
    },
    onEdit: handleEditClick,
    onDelete: handleDeleteClick
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
        onClose={() => {
          setIsCreateModalOpen(false);
          setLeaveToEdit(null);
        }}
        leaveToEdit={leaveToEdit}
      />

      <ConfirmationModal
        isOpen={!!leaveIdToDelete}
        title="Delete Leave Request"
        message="Are you sure you want to delete this leave request? This action cannot be undone."
        confirmButtonText={manager.actions.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={handleConfirmSingleDelete}
        onCancel={() => setLeaveIdToDelete(null)}
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