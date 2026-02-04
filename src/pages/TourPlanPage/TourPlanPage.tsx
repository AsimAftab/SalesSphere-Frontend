// src/pages/TourPlanPage/TourPlanPage.tsx
import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import TourPlanContent from "./TourPlanContent";
import TourPlanPDFReport from "./TourPlanListPDF";
import ConfirmationModal from "@/components/modals/CommonModals/ConfirmationModal";
import TourPlanFormModal from "@/components/modals/TourPlan/TourPlanModal";
import StatusUpdateModal from "@/components/modals/CommonModals/StatusUpdateModal";

// Hooks & Services
import useTourManager from "./hooks/useTourManager";
import { ExportTourService } from "./components/ExportTourService";
import { type TourPlan, type CreateTourRequest, type TourStatus } from "@/api/tourPlanService";
import toast from "react-hot-toast";
import { useAuth } from "@/api/authService";
import { ErrorBoundary } from '@/components/ui';

const TourPlanPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const manager = useTourManager();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TourPlan | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleExportPdf = (filteredData: TourPlan[]) => {
    ExportTourService.exportToPdf(filteredData, <TourPlanPDFReport data={filteredData} />);
  };

  const handleExportExcel = (filteredData: TourPlan[]) => {
    ExportTourService.exportToExcel(filteredData);
  };

  const triggerBulkDelete = (ids: string[]) => {
    if (ids.length > 0) {
      manager.tableState.selection.onSelect(ids);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDeletion = async () => {
    // We need to access actions from manager
    if (manager.actions && manager.actions.bulkDelete) {
      // We know selection is in tableState
      await manager.actions.bulkDelete(manager.tableState.selection.selectedIds);
    }
    setIsDeleteModalOpen(false);
  }

  const handleCreateSubmit = async (formData: CreateTourRequest) => {
    try {
      await manager.actions.create(formData);
      setIsCreateModalOpen(false);
    } catch {
      // Errors are handled inside the mutation hook via toast
    }
  };

  const handleStatusClick = (plan: TourPlan) => {
    if (plan.status !== 'pending') {
      toast.error(`Cannot change status of a ${plan.status} tour plan`);
      return;
    }

    // Restriction: Users cannot approve their own plans unless they are Admin
    const isCreator = user?.id === plan.createdBy.id;
    if (isCreator && !isAdmin) {
      toast.error("You cannot update the status of your own plan");
      return;
    }

    setSelectedPlan(plan);
    setIsStatusModalOpen(true);
  };

  const handleStatusSave = async (newStatus: string) => {
    if (selectedPlan) {
      try {
        await manager.actions.updateStatus(selectedPlan.id, newStatus as TourStatus);
        setIsStatusModalOpen(false);
        setSelectedPlan(null);
      } catch {
        // Error handled in hook
      }
    }
  };

  const combinedActions = {
    ...manager.actions,
    exportPdf: handleExportPdf,
    exportExcel: handleExportExcel,
    create: () => setIsCreateModalOpen(true),
    bulkDelete: triggerBulkDelete,
    setIsFilterVisible: manager.filterState.onToggle,
    setFilters: manager.filterState.onFilterChange,
    onResetFilters: manager.filterState.onReset,
    onStatusClick: handleStatusClick // Pass this down
  };

  return (
    <Sidebar>
      <ErrorBoundary>
        <TourPlanContent
          tableState={manager.tableState}
          filterState={manager.filterState}
          actions={combinedActions}
          permissions={manager.permissions}
          currentUserId={manager.currentUserId}
        />
      </ErrorBoundary>

      <TourPlanFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSubmit}
        isSaving={manager.actions.isCreating}
      />

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSave={handleStatusSave}
        currentValue={selectedPlan?.status || "pending"}
        entityIdLabel="Plan ID"
        entityIdValue={selectedPlan?.id?.slice(-6) || ""}
        title="Update Tour Plan Status"
        isSaving={manager.actions.isUpdating}
        options={[
          { value: 'pending', label: 'Pending', colorClass: 'yellow' },
          { value: 'approved', label: 'Approved', colorClass: 'green' },
          { value: 'rejected', label: 'Rejected', colorClass: 'red' }
        ]}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${manager.tableState.selection.selectedIds.length} item(s)? This action cannot be undone.`}
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

export default TourPlanPage;