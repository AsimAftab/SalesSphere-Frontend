import React from 'react';
import Button from '../../../components/ui/Button/Button';
import ConfirmationModal from '../../../components/modals/CommonModals/ConfirmationModal';
import RoleManagementSidebar from './components/RoleManagementSidebar';
import ModulePermissionAccordion from './components/ModulePermissionAccordion';
import CreateRoleModal from './components/CreateRoleModal';
import { PermissionTabFooter } from './components/PermissionTabFooter';
import { usePermissionTab } from './hooks/usePermissionTab';

/**
 * Permission Tab - User Role & Permission management
 * Follows SOLID principles: Uses facade hook for logic, component only renders UI
 */
const PermissionTab: React.FC = () => {
    const {
        // Data
        roles,
        selectedRole,
        selectedRoleId,
        featureRegistry,
        filteredModules,
        permissions,
        expandedModules,

        // Access Control
        webAccess,
        mobileAccess,
        setWebAccess,
        setMobileAccess,

        // Loading States
        isLoadingRoles,
        isPending,

        // Modal States
        isCreateModalOpen,
        isDeleteModalOpen,
        isRevokeModalOpen,
        isGrantAllModalOpen,
        setIsCreateModalOpen,
        setIsDeleteModalOpen,
        setIsRevokeModalOpen,
        setIsGrantAllModalOpen,

        // Actions
        setSelectedRoleId,
        toggleModuleExpansion,
        toggleFeature,
        toggleModuleAll,

        // Handlers
        handleSave,
        handleCancel,
        handleDeleteClick,
        handleConfirmRevoke,
        handleConfirmGrantAll,
        handleConfirmDelete,

        // Constants
        MODULE_KEY_MAP
    } = usePermissionTab();

    return (
        <>
            <div className="flex flex-1 min-h-0 overflow-hidden bg-gray-100 pl-6 pr-6 py-6 gap-6">
                {/* Left Sidebar Card - Role Management */}
                <div className="w-80 flex-shrink-0 self-start">
                    <RoleManagementSidebar
                        roles={roles}
                        selectedRoleId={selectedRoleId}
                        onSelectRole={setSelectedRoleId}
                        onAddRole={() => setIsCreateModalOpen(true)}
                        onDeleteRole={handleDeleteClick}
                        webAccess={webAccess}
                        mobileAccess={mobileAccess}
                        onWebAccessChange={setWebAccess}
                        onMobileAccessChange={setMobileAccess}
                        onRevokeAll={() => setIsRevokeModalOpen(true)}
                        isLoading={isLoadingRoles}
                        isPending={isPending}
                    />
                </div>

                {/* Right Content Area - Module Permissions - min-h-0 is critical for internal scrolling */}
                <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-5" />
                            <h3 className="text-base font-bold text-gray-900">Modules</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">All Access</div>
                            <div className="h-4 w-px bg-gray-300 mx-2" />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsGrantAllModalOpen(true)}
                                disabled={isPending || !selectedRoleId}
                                className="!p-2 text-xs h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                                title="Grant All Permissions"
                            >
                                Grant All
                            </Button>
                        </div>
                    </div>

                    {/* Module Permissions Accordion - Scrollable */}
                    <div className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${!selectedRoleId ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                        {featureRegistry ? (
                            <div className="space-y-3">
                                {filteredModules.map((moduleDisplayName) => {
                                    const moduleKey = MODULE_KEY_MAP[moduleDisplayName];
                                    const moduleData = featureRegistry[moduleKey];

                                    if (!moduleData) return null;

                                    return (
                                        <ModulePermissionAccordion
                                            key={moduleKey}
                                            moduleName={moduleKey}
                                            moduleDisplayName={moduleDisplayName}
                                            features={moduleData}
                                            permissions={permissions[moduleKey] || {}}
                                            isExpanded={expandedModules[moduleKey] || false}
                                            onToggleExpand={toggleModuleExpansion}
                                            onToggleFeature={toggleFeature}
                                            onToggleModuleAll={toggleModuleAll}
                                            disabled={isPending}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Failed to load feature registry. Please refresh the page.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <PermissionTabFooter
                        totalModules={filteredModules.length}
                        isPending={isPending}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </div>
            </div>

            {/* Modals */}
            <CreateRoleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Delete Role"
                message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                confirmButtonVariant="danger"
            />

            <ConfirmationModal
                isOpen={isRevokeModalOpen}
                title="Revoke All Permissions"
                message="Are you sure you want to revoke all permissions for this role? This will remove access to all modules."
                onConfirm={handleConfirmRevoke}
                onCancel={() => setIsRevokeModalOpen(false)}
                confirmButtonText="Revoke All"
                cancelButtonText="Cancel"
                confirmButtonVariant="danger"
            />

            <ConfirmationModal
                isOpen={isGrantAllModalOpen}
                title="Grant All Permissions"
                message="Are you sure you want to grant all permissions for this role? This will provide full access to all modules."
                onConfirm={handleConfirmGrantAll}
                onCancel={() => setIsGrantAllModalOpen(false)}
                confirmButtonText="Grant All"
                cancelButtonText="Cancel"
                confirmButtonVariant="primary"
            />
        </>
    );
};

export default PermissionTab;
