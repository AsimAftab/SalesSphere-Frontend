import React from 'react';
import OrganizationHeader from './components/OrganizationHeader';
import OrganizationFiltersPanel from './components/OrganizationFiltersPanel';
import OrganizationList from './components/OrganizationList';
import type { useOrganizationManager } from './useOrganizationManager';
import type { Organization } from '@/api/SuperAdmin/organizationService';

interface OrganizationContentProps {
    manager: ReturnType<typeof useOrganizationManager>;
    onOrgClick: (org: Organization) => void;
    onCreateClick: () => void;
}

import OrganizationsSkeleton from './components/OrganizationsSkeleton';
import { Pagination } from '@/components/ui';

const OrganizationContent: React.FC<OrganizationContentProps> = ({
    manager,
    onOrgClick,
    onCreateClick
}) => {
    const { tableState, filterState } = manager;

    if (tableState.isLoading) {
        return <OrganizationsSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* 1. Header with Search & Actions */}
            <OrganizationHeader
                searchQuery={filterState.searchQuery}
                setSearchQuery={filterState.onSearch}
                isFilterVisible={filterState.isVisible}
                setIsFilterVisible={filterState.onToggle}
                onCreateClick={onCreateClick}
                totalCount={tableState.pagination.totalItems}
            />

            {/* 2. Filter Bar (Collapsible) */}
            <OrganizationFiltersPanel
                isVisible={filterState.isVisible}
                onClose={() => filterState.onToggle(false)}
                onReset={() => filterState.onFilterChange({
                    date: null,
                    expiryDate: null,
                    employees: [],
                    plans: [],
                    statuses: [],
                    months: [],
                    planNames: []
                })}
                values={filterState.values}
                onFilterChange={filterState.onFilterChange}
                options={filterState.options}
            />

            {/* 3. Organization Grid List */}
            <OrganizationList
                data={tableState.paginatedData}
                isLoading={false} // Loading handled by parent now
                error={tableState.error}
                onOrgClick={onOrgClick}
                onRetry={manager.actions.refresh}
            />

            {/* 4. Pagination */}
            <Pagination
                currentPage={tableState.pagination.currentPage}
                totalItems={tableState.pagination.totalItems}
                itemsPerPage={tableState.pagination.itemsPerPage}
                onPageChange={tableState.pagination.onPageChange}
            />
        </div>
    );
};

export default OrganizationContent;
