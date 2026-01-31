import React, { useMemo } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import MiscellaneousWorkContent from "./MiscellaneousWorkContent";
import ImagePreviewModal from "../../components/modals/CommonModals/ImagePreviewModal";
import ConfirmationModal from "../../components/modals/CommonModals/ConfirmationModal";
import ErrorBoundary from "../../components/UI/ErrorBoundary/ErrorBoundary";

// Hooks & Services
import useMiscellaneousManager from "./components/useMiscellaneousManager";
import { MiscWorkExportService } from "./components/MiscWorkExportService";
import { type MiscWork as MiscWorkType } from "../../api/miscellaneousWorkService";

/**
 * MiscellaneousWorkPage - Pure Orchestrator (SRP Compliant)
 * All state is managed by useMiscellaneousManager hook.
 * Wrapped with ErrorBoundary for graceful error handling.
 */
const MiscellaneousWorkPage: React.FC = () => {
  const manager = useMiscellaneousManager();

  // --- HANDLERS (Export kept here as it's page-specific) ---
  const handleExportPdf = (data: MiscWorkType[]) => {
    MiscWorkExportService.toPdf(data);
  };

  const handleExportExcel = (data: MiscWorkType[]) => {
    MiscWorkExportService.toExcel(data);
  };

  const handleConfirmDeletion = async () => {
    try {
      if (manager.state.selectedIds.length === 1) {
        await manager.actions.handleDelete(manager.state.selectedIds[0]);
      } else {
        await manager.actions.handleBulkDelete(manager.state.selectedIds);
      }
      manager.actions.modals.closeDeleteModal();
    } catch {
      // Error handled by mutation toast
    }
  };

  // Transform string[] to ImagePreviewModal format
  const previewImages = useMemo(() =>
    manager.state.modals.imagesToView.map((url, index) => ({
      url,
      description: `Work Image ${index + 1}`,
      imageNumber: index + 1
    })),
    [manager.state.modals.imagesToView]
  );

  return (
    <Sidebar>
      <ErrorBoundary>
        <MiscellaneousWorkContent
          state={manager.state}
          actions={manager.actions}
          permissions={manager.permissions}
          onExportPdf={handleExportPdf}
          onExportExcel={handleExportExcel}
        />
      </ErrorBoundary>

      {/* --- Overlay Modals (using hook state) --- */}

      <ImagePreviewModal
        isOpen={manager.state.modals.isImageModalOpen}
        onClose={manager.actions.modals.closeImageModal}
        images={previewImages}
        initialIndex={0}
      />

      <ConfirmationModal
        isOpen={manager.state.modals.isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${manager.state.selectedIds.length} item(s)? This action cannot be undone.`}
        onConfirm={handleConfirmDeletion}
        onCancel={manager.actions.modals.closeDeleteModal}
        confirmButtonText={manager.state.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default MiscellaneousWorkPage;