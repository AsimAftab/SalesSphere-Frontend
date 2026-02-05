import React from 'react';
import { PageHeader } from '@/components/ui';

interface NoteHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  onOpenCreateModal: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  setCurrentPage: (page: number) => void;

  // Permission Props
  canCreate: boolean;
  canExportPdf: boolean;
  canExportExcel: boolean;
  canBulkDelete: boolean;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isFilterVisible,
  setIsFilterVisible,
  onExportPdf,
  onExportExcel,
  onOpenCreateModal,
  selectedCount,
  onBulkDelete,
  setCurrentPage,
  canCreate,
  canExportPdf,
  canExportExcel,
  canBulkDelete
}) => {
  return (
    <PageHeader
      title="Notes"
      subtitle="Log and track communications."
      searchTerm={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search by Title or Created By"
      isFilterVisible={isFilterVisible}
      onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
      showFilter={true}
      onExportPdf={onExportPdf}
      onExportExcel={onExportExcel}
      selectedCount={selectedCount}
      onBulkDelete={onBulkDelete}
      createButtonLabel="Create Note"
      onCreate={onOpenCreateModal}
      permissions={{
        canCreate,
        canExportPdf,
        canExportExcel,
        canBulkDelete
      }}
      onResetPage={() => setCurrentPage(1)}
    />
  );
};

export default NoteHeader;
