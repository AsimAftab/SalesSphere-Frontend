import React from 'react';
import { PageHeader } from '@/components/ui';

interface SubscriptionPlansHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onCreateClick: () => void;
}

const SubscriptionPlansHeader: React.FC<SubscriptionPlansHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    onCreateClick
}) => {
    return (
        <PageHeader
            title="Subscription Plans"
            subtitle="Manage subscription plans"
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search custom plans by name"
            showFilter={false}
            createButtonLabel="Create Custom Plan"
            onCreate={onCreateClick}
            permissions={{
                canExportPdf: false,
                canExportExcel: false,
            }}
        />
    );
};

export default SubscriptionPlansHeader;
