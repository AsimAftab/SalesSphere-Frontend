import React from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import MiscellaneousWorkContent from "./MiscellaneousWorkContent";
import ViewImageModal from "../../components/modals/ViewImageModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import ErrorBoundary from "../../components/UI/ErrorBoundary";

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
      await manager.handleBulkDelete(manager.selectedIds);
      manager.modals.closeDeleteModal();
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  return (
    <Sidebar>
      <ErrorBoundary>
        <MiscellaneousWorkContent
          // Data & Loading
          tableData={manager.miscWorks}
          isFetchingList={manager.isFetching}

          // Pagination
          currentPage={manager.currentPage}
          setCurrentPage={manager.setCurrentPage}
          ITEMS_PER_PAGE={10}

          // Search & Filters
          searchQuery={manager.searchQuery}
          setSearchQuery={manager.setSearchQuery}
          isFilterVisible={manager.isFilterVisible}
          setIsFilterVisible={manager.setIsFilterVisible}

          selectedDate={manager.filters.date}
          setSelectedDate={(date) => manager.setFilters(prev => ({ ...prev, date }))}

          selectedEmployee={manager.filters.employees}
          setSelectedEmployee={(employees) => manager.setFilters(prev => ({ ...prev, employees }))}

          selectedMonth={manager.filters.months}
          setSelectedMonth={(months) => manager.setFilters(prev => ({ ...prev, months }))}

          employeeOptions={manager.employeeOptions}
          onResetFilters={manager.onResetFilters}

          // Actions (using hook modal handlers)
          handleViewImage={manager.modals.openImageModal}
          onDelete={(id) => manager.modals.openDeleteModal([id])}
          onBulkDelete={manager.modals.openDeleteModal}
          onExportPdf={handleExportPdf}
          onExportExcel={handleExportExcel}

          // Permissions (from hook)
          canDelete={manager.permissions.canDelete}
          canExportPdf={manager.permissions.canExportPdf}
          canExportExcel={manager.permissions.canExportExcel}
        />
      </ErrorBoundary>

      {/* --- Overlay Modals (using hook state) --- */}

      <ViewImageModal
        isOpen={manager.modals.isImageModalOpen}
        onClose={manager.modals.closeImageModal}
        images={manager.modals.imagesToView}
        title="Attached Work Images"
      />

      <ConfirmationModal
        isOpen={manager.modals.isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${manager.selectedIds.length} item(s)? This action cannot be undone.`}
        onConfirm={handleConfirmDeletion}
        onCancel={manager.modals.closeDeleteModal}
        confirmButtonText={manager.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default MiscellaneousWorkPage;