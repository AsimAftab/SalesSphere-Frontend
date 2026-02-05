import React from 'react';
import { PageHeader } from '@/components/ui';

interface CollectionsHeaderProps {
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
        canBulkDelete: boolean; // Added
        canExportPdf: boolean;
        canExportExcel: boolean;
    };
}

export const CollectionsHeader: React.FC<CollectionsHeaderProps> = ({
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
        title="Collection List"
        subtitle="Manage payment collections."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by Party or Payment Mode"
        isFilterVisible={isFilterVisible}
        onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
        showFilter={true}
        onExportPdf={onExportPdf}
        onExportExcel={onExportExcel}
        selectedCount={selectedCount}
        onBulkDelete={onBulkDelete}
        createButtonLabel="Create Collection"
        onCreate={handleCreate}
        onResetPage={() => setCurrentPage(1)}
        permissions={{
            canCreate: permissions.canCreate,
            canBulkDelete: permissions.canBulkDelete,
            canExportPdf: permissions.canExportPdf,
            canExportExcel: permissions.canExportExcel,
        }}
        className="px-1"
    />
);
