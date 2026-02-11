import React from 'react';
import { Layers, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import RoleManagementSidebar from './components/RoleManagementSidebar';
import ModulePermissionAccordion from './components/ModulePermissionAccordion';
import CreateRoleModal from './components/CreateRoleModal';
import { PermissionTabFooter } from './components/PermissionTabFooter';
import { usePermissionTab } from './hooks/usePermissionTab';
import { EmptyState } from '@/components/ui';
import { PermissionTabSkeleton } from './components/PermissionTabSkeleton';

const containerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

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
        roleDescription,
        setRoleDescription,

        // Loading States
        isLoadingRoles,
        isLoadingRegistry,
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

    if (isLoadingRoles || isLoadingRegistry) {
        return <PermissionTabSkeleton />;
    }

    return (
        <>
            {/* Page Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">Roles & Permissions</h1>
                <p className="text-xs sm:text-sm text-gray-500">Manage user roles, platform access, and module-level permissions</p>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden bg-gray-100 px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6">
                {/* Left Sidebar Card - Role Management */}
                <div className="w-full lg:w-96 flex-shrink-0 min-h-0 max-h-[40vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
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
                        roleDescription={roleDescription}
                        onRoleDescriptionChange={setRoleDescription}
                        onGrantAll={() => setIsGrantAllModalOpen(true)}
                        onRevokeAll={() => setIsRevokeModalOpen(true)}
                        isLoading={isLoadingRoles}
                        isPending={isPending}
                    />
                </div>

                {/* Right Content Area - Module Permissions */}
                <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 p-2 bg-secondary/10 rounded-lg hidden sm:flex">
                                <Layers className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900">Module Permissions</h3>
                                <p className="text-xs text-gray-500">
                                    {selectedRole ? `Configuring "${selectedRole.name}"` : 'Select a role to configure'}
                                </p>
                            </div>
                        </div>
                        {selectedRoleId && (
                            <span className="text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-secondary/10 text-secondary">
                                {filteredModules.length} modules
                            </span>
                        )}
                    </div>

                    {/* Module Permissions Accordion - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {!selectedRoleId ? (
                            <div className="flex items-center justify-center h-full">
                                <EmptyState
                                    title="No Role Selected"
                                    description="Select a role from the sidebar to view and configure its module permissions."
                                    icon={<Shield className="w-8 h-8 text-gray-400" />}
                                />
                            </div>
                        ) : featureRegistry ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedRoleId}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="space-y-3"
                                >
                                    {filteredModules.map((moduleDisplayName) => {
                                        const moduleKey = MODULE_KEY_MAP[moduleDisplayName];
                                        const moduleData = featureRegistry[moduleKey];

                                        if (!moduleData) return null;

                                        return (
                                            <motion.div key={moduleKey} variants={itemVariants}>
                                                <ModulePermissionAccordion
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
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Failed to load feature registry. Please refresh the page.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <PermissionTabFooter
                        isPending={isPending}
                        disabled={!selectedRoleId}
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
                confirmButtonVariant="success"
            />
        </>
    );
};

export default PermissionTab;
