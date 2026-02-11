import React from 'react';
import { PageHeader } from '@/components/ui';

interface OrganizationHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (visible: boolean) => void;
    onCreateClick: () => void;
    totalCount: number;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    isFilterVisible,
    setIsFilterVisible,
    onCreateClick,
}) => {
    return (
        <PageHeader
            title="Organizations"
            subtitle="Manage organizations"
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by organization or owner name"
            isFilterVisible={isFilterVisible}
            onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
            showFilter={true}
            createButtonLabel="Add Organization"
            onCreate={onCreateClick}
            permissions={{
                canExportPdf: false,
                canExportExcel: false,
            }}
        />
    );
};

export default OrganizationHeader;
