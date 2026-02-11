import React from 'react';
import { PageHeader } from '@/components/ui';

interface SystemUserHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAddUser: () => void;
}

const SystemUserHeader: React.FC<SystemUserHeaderProps> = ({ searchQuery, setSearchQuery, onAddUser }) => {
    return (
        <PageHeader
            title="System Users"
            subtitle="Manage Super Admins and Developers"
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search system users"
            showFilter={false}
            createButtonLabel="Add User"
            onCreate={onAddUser}
            permissions={{
                canExportPdf: false,
                canExportExcel: false,
            }}
        />
    );
};

export default SystemUserHeader;
