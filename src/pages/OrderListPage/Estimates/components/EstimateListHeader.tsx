import React from 'react';
import { PageHeader } from '@/components/ui';

interface EstimateListHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isFilterVisible: boolean;
    onToggleFilters: () => void;
    onExportPdf: () => void;
    onCreateEstimate: () => void;
    selectionCount: number;
    onBulkDelete: () => void;
    canCreate?: boolean;
    canBulkDelete?: boolean;
    canExportPdf?: boolean;
}

const EstimateListHeader: React.FC<EstimateListHeaderProps> = ({
    searchTerm,
    onSearchChange,
    isFilterVisible,
    onToggleFilters,
    onExportPdf,
    onCreateEstimate,
    selectionCount,
    onBulkDelete,
    canCreate = true,
    canBulkDelete = true,
    canExportPdf = true
}) => {
    return (
        <PageHeader
            title="Estimates"
            subtitle="Manage estimates"
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search Invoice/Party"
            isFilterVisible={isFilterVisible}
            onFilterToggle={onToggleFilters}
            showFilter={true}
            onExportPdf={onExportPdf}
            selectedCount={selectionCount}
            onBulkDelete={onBulkDelete}
            onCreate={onCreateEstimate}
            createButtonLabel="Create Estimate"
            permissions={{
                canCreate,
                canBulkDelete,
                canExportPdf
            }}
        />
    );
};

export default EstimateListHeader;
