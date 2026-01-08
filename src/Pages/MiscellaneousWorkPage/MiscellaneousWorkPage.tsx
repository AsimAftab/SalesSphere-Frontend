import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import MiscellaneousWorkContent from "./MiscellaneousWorkContent";
import ViewImageModal from "../../components/modals/ViewImageModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";

// Hooks & Services
import useMiscellaneousManager from "./components/useMiscellaneousManager";
import { MiscWorkExportService } from "./components/MiscWorkExportService";
import { type MiscWork as MiscWorkType } from "../../api/miscellaneousWorkService";

const MiscellaneousWorkPage: React.FC = () => {
  // The manager now provides grouped permissions internally
  const manager = useMiscellaneousManager();

  // --- UI LOCAL STATE (Modals Only) ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagesToView, setImagesToView] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- HANDLERS ---
  const handleExportPdf = (data: MiscWorkType[]) => {
    MiscWorkExportService.toPdf(data);
  };

  const handleExportExcel = (data: MiscWorkType[]) => {
    MiscWorkExportService.toExcel(data);
  };

  const triggerBulkDelete = (ids: string[]) => {
    if (ids.length > 0) {
      manager.setSelectedIds(ids);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDeletion = async () => {
    try {
      await manager.handleBulkDelete(manager.selectedIds);
      setIsDeleteModalOpen(false);
    } catch (error) {
      // Error is handled by mutation toast
    }
  };

  return (
    <Sidebar>
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

        // Actions
        handleViewImage={(imgs) => {
          setImagesToView(imgs);
          setIsImageModalOpen(true);
        }}
        onDelete={(id) => triggerBulkDelete([id])}
        onBulkDelete={triggerBulkDelete}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}

        // NEW: Uses centralized permissions object from hook
        permissions={manager.permissions}
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
        message={`Are you sure you want to delete ${manager.selectedIds.length} item(s)? This action cannot be undone.`}
        onConfirm={handleConfirmDeletion}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          manager.setSelectedIds([]);
        }}
        confirmButtonText={manager.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default MiscellaneousWorkPage;