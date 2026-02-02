import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import NoteContent from "./NoteContent";
import NoteListPDF from "./NoteListPDF";
import ConfirmationModal from "../../components/modals/CommonModals/ConfirmationModal";
import NoteFormModal from "../../components/modals/Notes/index";
import ErrorBoundary from "../../components/ui/ErrorBoundary/ErrorBoundary";
import useNoteManager from "./components/useNoteManager";
import { ExportNoteService } from "./components/ExportNoteService";

const NotesPage: React.FC = () => {
  const manager = useNoteManager(10); // Pass items per page

  // Local UI States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);



  // --- Export Handlers ---
  const handleExportPdf = () => {
    ExportNoteService.exportToPdf(
      manager.notes, // Use full filtered list
      <NoteListPDF data={manager.notes} />
    );
  };

  const handleExportExcel = () => {
    ExportNoteService.exportToExcel(manager.notes); // Use full filtered list
  };

  // --- Deletion Logic ---
  const triggerBulkDelete = () => {
    if (manager.selectedIds.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDeletion = async () => {
    await manager.handleBulkDelete(manager.selectedIds);
    setIsDeleteModalOpen(false);
  };

  return (
    <Sidebar>
      <ErrorBoundary>
        <NoteContent
          // Data (Paginated)
          data={manager.paginatedNotes}
          fullDataLength={manager.totalItems}
          isFetching={manager.isFetching}

          // Search
          searchQuery={manager.searchQuery}
          setSearchQuery={manager.setSearchQuery}

          // Pagination
          currentPage={manager.currentPage}
          setCurrentPage={manager.setCurrentPage}
          totalPages={manager.totalPages}
          ITEMS_PER_PAGE={manager.itemsPerPage}

          // Advanced Filtering Props
          isFilterVisible={manager.isFilterVisible}
          setIsFilterVisible={manager.setIsFilterVisible}
          onResetFilters={manager.onResetFilters}
          employeeOptions={manager.employeeOptions}

          // Individual Filter States and Setters
          selectedEmployee={manager.filters.employees}
          setSelectedEmployee={(val) => manager.setFilters(prev => ({ ...prev, employees: val }))}
          selectedEntityType={manager.filters.entityTypes}
          setSelectedEntityType={(val) => manager.setFilters(prev => ({ ...prev, entityTypes: val }))}
          selectedMonth={manager.filters.months}
          setSelectedMonth={(val) => manager.setFilters(prev => ({ ...prev, months: val }))}
          selectedDate={manager.filters.date}
          setSelectedDate={(val) => manager.setFilters(prev => ({ ...prev, date: val }))}

          // Actions
          onExportPdf={handleExportPdf}
          onExportExcel={handleExportExcel}

          // Selection
          selectedIds={manager.selectedIds}
          onToggleSelection={manager.toggleSelection}
          onSelectAll={manager.selectAll}
          onBulkDelete={triggerBulkDelete}

          handleCreate={() => setIsCreateModalOpen(true)}
        />
      </ErrorBoundary>


      {/* Note Form Modal: Strictly for Creation */}
      {isCreateModalOpen && (
        <NoteFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          parties={manager.parties || []}
          prospects={manager.prospects || []}
          sites={manager.sites || []}
          onSave={async (formData, files) => {
            await manager.handleCreateNote(formData, files);
            setIsCreateModalOpen(false);
          }}
          isSaving={manager.isCreating}
        />
      )}

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${manager.selectedIds.length} note(s)? This action cannot be undone.`}
        confirmButtonText={manager.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={handleConfirmDeletion}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </Sidebar>
  );
};

export default NotesPage;