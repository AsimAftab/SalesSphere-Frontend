import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemUserManager } from './hooks/useSystemUserManager';
import SystemUserContent from './components/SystemUserContent';
import EmployeeModal from '@/components/modals/Employees/EmployeeModal';
import { ErrorBoundary } from '@/components/ui';
import type { SystemUser } from '@/api/SuperAdmin/systemUserService';

const SystemUserListPage: React.FC = () => {
    const {
        users,
        totalUsers,
        currentPage,
        itemsPerPage,
        onPageChange,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        isModalOpen,
        modalMode,
        selectedUser,
        openAddModal,
        closeModal,
        handleSave,
        refetch
    } = useSystemUserManager();

    const navigate = useNavigate();

    const handleViewUser = (user: SystemUser) => {
        navigate(`/system-admin/system-users/${user._id}`);
    };

    return (
        <ErrorBoundary>
            <SystemUserContent
                users={users}
                isLoading={isLoading}
                error={error}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddUser={openAddModal}
                onUserClick={handleViewUser}
                onRetry={refetch}
                currentPage={currentPage}
                totalItems={totalUsers}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
            />

            {isModalOpen && (
                <EmployeeModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    mode={modalMode}
                    variant="system-user"
                    initialData={selectedUser}
                    onSave={handleSave}
                />
            )}
        </ErrorBoundary>
    );
};

export default SystemUserListPage;
