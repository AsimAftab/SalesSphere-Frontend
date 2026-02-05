import React from 'react';
import { PageHeader } from '@/components/ui';

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (val: boolean) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  canExportPdf: boolean;
  canExportExcel: boolean;
  onExportPdf: () => void;
  onExportExcel: () => void;
  canBulkDelete?: boolean;
}

export const MiscWorkHeader: React.FC<Props> = ({
  searchQuery, setSearchQuery, isFilterVisible, setIsFilterVisible,
  selectedCount, onBulkDelete, canExportPdf, canExportExcel, onExportPdf, onExportExcel, canBulkDelete
}) => (
  <PageHeader
    title="Miscellaneous Work"
    subtitle="Manage tasks and staff assignments."
    searchTerm={searchQuery}
    onSearchChange={setSearchQuery}
    searchPlaceholder="Search By Employee, Address or Nature of Work"
    isFilterVisible={isFilterVisible}
    onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
    showFilter={true}
    onExportPdf={onExportPdf}
    onExportExcel={onExportExcel}
    selectedCount={selectedCount}
    onBulkDelete={onBulkDelete}
    permissions={{
      canExportPdf,
      canExportExcel,
      canBulkDelete,
    }}
  />
);
