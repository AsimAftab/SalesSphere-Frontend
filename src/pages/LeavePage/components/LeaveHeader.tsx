import React from 'react';

import { type LeavePermissions } from '../hooks/useLeaveManager';
import { PageHeader } from '@/components/ui';

interface LeaveHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (visible: boolean) => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  setCurrentPage: (page: number) => void;
  permissions: LeavePermissions;
  onCreateClick?: () => void;
}

const LeaveHeader: React.FC<LeaveHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isFilterVisible,
  setIsFilterVisible,
  onExportPdf,
  onExportExcel,
  selectedCount,
  onBulkDelete,
  setCurrentPage,
  permissions,
  onCreateClick
}) => {
  return (
    <PageHeader
      title="Leave Requests"
      subtitle="Manage employee leave applications."
      searchTerm={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search By Employee or Category"
      isFilterVisible={isFilterVisible}
      onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
      showFilter={true}
      onExportPdf={onExportPdf}
      onExportExcel={onExportExcel}
      selectedCount={selectedCount}
      onBulkDelete={onBulkDelete}
      createButtonLabel={permissions.canCreate && onCreateClick ? "Create Leave" : undefined}
      onCreate={onCreateClick}
      permissions={{
        canCreate: permissions.canCreate,
        canBulkDelete: permissions.canBulkDelete,
        canExportPdf: permissions.canExportPdf,
        canExportExcel: permissions.canExportExcel,
      }}
      onResetPage={() => setCurrentPage(1)}
    />
  );
};

export default LeaveHeader;
