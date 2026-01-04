import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import NoteContent from "./NoteContent";
import NoteListPDF from "./NoteListPDF";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import NoteFormModal from "../../components/modals/NoteFormModal/index"; 

// Hooks & Services
import useNoteManager from "./components/useNoteManager";
import { ExportNoteService } from "./components/ExportNoteService";
// Use 'import type' for verbatimModuleSyntax compliance
import type { Note } from "../../api/notesService";

const NotesPage: React.FC = () => {
  const manager = useNoteManager(); 
  
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
        onBulkDelete={triggerBulkDelete}
        // Removed onEdit prop: Edit logic is now handled in the Detail Page
        handleCreate={() => setIsCreateModalOpen(true)}
      />

     
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