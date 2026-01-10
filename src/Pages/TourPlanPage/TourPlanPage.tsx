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

  const handleCreateSubmit = async (formData: any) => {
    try {
      await manager.actions.create(formData);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Errors are handled inside the mutation hook via toast
    }
  };

  const combinedActions = {
    ...manager.actions,
    exportPdf: handleExportPdf,
    exportExcel: handleExportExcel,
    create: () => setIsCreateModalOpen(true),
    bulkDelete: triggerBulkDelete
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