import React from 'react';
import { type TourPlanPermissions } from '../hooks/useTourManager';
import { PageHeader } from '@/components/ui';

interface TourPlanHeaderProps {
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
  permissions: TourPlanPermissions;
}

const TourPlanHeader: React.FC<TourPlanHeaderProps> = ({
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
  permissions
}) => {
  return (
    <PageHeader
      title="Tour Plans"
      subtitle="Manage employee travel schedules."
      searchTerm={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search By Place or Created By"
      isFilterVisible={isFilterVisible}
      onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
      showFilter={true}
      onExportPdf={onExportPdf}
      onExportExcel={onExportExcel}
      selectedCount={selectedCount}
      onBulkDelete={onBulkDelete}
      createButtonLabel="Create Tour"
      onCreate={onOpenCreateModal}
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

export default TourPlanHeader;
