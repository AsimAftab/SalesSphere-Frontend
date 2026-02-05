import React from 'react';
import { PageHeader } from '@/components/ui';

interface ExpensesHeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (val: boolean) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  handleCreate: () => void;
  setCurrentPage: (page: number) => void;
  // Permissions
  permissions: {
    canCreate: boolean;
    canDelete: boolean;
    canBulkDelete: boolean;
    canExportPdf: boolean;
    canExportExcel: boolean;
  };
}

export const ExpensesHeader: React.FC<ExpensesHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  isFilterVisible,
  setIsFilterVisible,
  selectedCount,
  onBulkDelete,
  onExportPdf,
  onExportExcel,
  handleCreate,
  setCurrentPage,
  permissions
}) => (
  <PageHeader
    title="Expenses List"
    subtitle="Track and audit settlement records."
    searchTerm={searchTerm}
    onSearchChange={setSearchTerm}
    searchPlaceholder="Search By Title or Category"
    isFilterVisible={isFilterVisible}
    onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
    showFilter={true}
    onExportPdf={onExportPdf}
    onExportExcel={onExportExcel}
    selectedCount={selectedCount}
    onBulkDelete={onBulkDelete}
    createButtonLabel="Create Expense"
    onCreate={handleCreate}
    onResetPage={() => setCurrentPage(1)}
    permissions={{
      canCreate: permissions.canCreate,
      canBulkDelete: permissions.canBulkDelete,
      canExportPdf: permissions.canExportPdf,
      canExportExcel: permissions.canExportExcel,
    }}
  />
);
