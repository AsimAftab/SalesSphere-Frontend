import React from 'react';
import SystemUserHeader from './SystemUserHeader';
import SystemUserList from './SystemUserList';
import SystemUsersSkeleton from './SystemUserSkeleton';
import type { SystemUser } from '@/api/SuperAdmin/systemUserService';
import { Pagination } from '@/components/ui';

interface SystemUserContentProps {
    users: SystemUser[];
    isLoading: boolean;
    error: Error | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAddUser: () => void;
    onUserClick: (user: SystemUser) => void;
    onRetry: () => void;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const SystemUserContent: React.FC<SystemUserContentProps> = ({
    users,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    onAddUser,
    onUserClick,
    onRetry,
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    // 1. Loading State (Full Page Skeleton)
    if (isLoading) {
        return <SystemUsersSkeleton />;
    }

    return (
        <div className="space-y-6">
            <SystemUserHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddUser={onAddUser}
            />

            <SystemUserList
                users={users}
                isLoading={false} // Loading handled by parent
                error={error}
                onUserClick={onUserClick}
                onRetry={onRetry}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default SystemUserContent;
