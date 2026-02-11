import React from 'react';
import type { BeatPlanPermissions } from '../../../hooks/useBeatPlanPermissions';
import { PageHeader } from '@/components/ui';

interface BeatListHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onCreate: () => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (visible: boolean) => void;
    onExportPdf: () => void;
    permissions: BeatPlanPermissions;
}

const BeatListHeader: React.FC<BeatListHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    onCreate,
    isFilterVisible,
    setIsFilterVisible,
    onExportPdf,
    permissions
}) => {
    return (
        <PageHeader
            title="Beat Plan List"
            subtitle="Manage your beat plans"
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by Beat Plan Name"
            isFilterVisible={isFilterVisible}
            onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
            showFilter={true}
            onExportPdf={onExportPdf}
            onCreate={permissions.canCreateTemplate ? onCreate : undefined}
            createButtonLabel={permissions.canCreateTemplate ? "Create Beat Plan" : undefined}
            permissions={{
                canCreate: permissions.canCreateTemplate,
                canExportPdf: permissions.canExportPdf,
            }}
        />
    );
};

export default BeatListHeader;
