import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import NoteContent from "./NoteContent";
import NoteListPDF from "./NoteListPDF";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import NoteFormModal from "../../components/modals/NoteFormModal"; 

// Hooks & Services
import useNoteManager from "./components/useNoteManager";
import { ExportNoteService } from "./components/ExportNoteService";
import { type Note } from "../../api/notesService";

const NotesPage: React.FC = () => {
  const manager = useNoteManager(); // Centralized state from your custom hook
  
  // Local UI States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string[]>([]);

  // --- Export Handlers ---
  const handleExportPdf = (filteredData: Note[]) => {
    ExportNoteService.exportToPdf(
      filteredData, 
      <NoteListPDF data={filteredData} />
    );
  };

  const handleExportExcel = (filteredData: Note[]) => {
    ExportNoteService.exportToExcel(filteredData);
  };

  // --- Deletion Logic ---
  const triggerBulkDelete = (ids: string[]) => {
    if (ids.length > 0) {
      setNoteToDelete(ids);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDeletion = async () => {
    // Pass local IDs to the manager's business logic
    await manager.handleBulkDelete(noteToDelete); 
    setIsDeleteModalOpen(false);
    setNoteToDelete([]);
  };

  return (
    <Sidebar>
      <NoteContent
        // Data and Fetching
        data={manager.notes}
        isFetching={manager.isFetching}
        
        // Search and Global Pagination
        searchQuery={manager.searchQuery}
        setSearchQuery={manager.setSearchQuery}
        currentPage={manager.currentPage}
        setCurrentPage={manager.setCurrentPage}
        ITEMS_PER_PAGE={10}

        // --- NEW: Advanced Filtering Props ---
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
        onBulkDelete={triggerBulkDelete}
        handleCreate={() => setIsCreateModalOpen(true)}
      />

      {/* Note Creation/Edit Modal */}
      <NoteFormModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={async (formData) => {
          await manager.handleCreateNote(formData);
          setIsCreateModalOpen(false);
        }}
        isSaving={manager.isCreating}
      />

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${noteToDelete.length} note(s)? This action cannot be undone.`}
        confirmButtonText={manager.isDeleting ? "Deleting..." : "Delete"}
        confirmButtonVariant="danger"
        onConfirm={handleConfirmDeletion}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setNoteToDelete([]);
        }}
      />
    </Sidebar>
  );
};

export default NotesPage;