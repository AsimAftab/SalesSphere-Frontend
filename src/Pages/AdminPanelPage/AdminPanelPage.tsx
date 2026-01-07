import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import TabNavigation from './TabNavigation';
import RoleManagementSidebar from './RoleManagementSidebar';
import ModulePermissionAccordion from './ModulePermissionAccordion';
import { AdminPanelFooter } from './AdminPanelFooter';
import Button from '../../components/UI/Button/Button';
import { useFeaturePermissions } from './useFeaturePermissions';
import CreateRoleModal from './CreateRoleModal';
import { type Role, MODULES_LIST, MODULE_KEY_MAP } from './admin.types';
import type { FeaturePermissions } from './featurePermission.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleService, type FeatureRegistry } from '../../api/roleService';
import { useAuth } from '../../api/authService';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { Navigate } from 'react-router-dom';

const AdminPanelPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();

  // Access Control: Strict check for Admin roles only
  if (user && !['superadmin', 'developer', 'admin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // State
  const [activeTab, setActiveTab] = useState('permission');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isGrantAllModalOpen, setIsGrantAllModalOpen] = useState(false);

  // Access Control State
  const [webAccess, setWebAccess] = useState(false);
  const [mobileAccess, setMobileAccess] = useState(false);

  // Fetch roles
  const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getAll
  });

  // Fetch feature registry
  const { data: featureRegistryResponse, isLoading: isLoadingRegistry } = useQuery({
    queryKey: ['featureRegistry'],
    queryFn: roleService.getFeatureRegistry
  });

  const roles: Role[] = rolesResponse?.data?.data || [];
  const selectedRole = roles.find(r => r._id === selectedRoleId);
  const featureRegistry: FeatureRegistry | null = featureRegistryResponse?.data?.data || null;

  // Filter modules based on subscription
  const filteredModules = useMemo(() => {
    if (isAuthLoading || !user) return [];

    const enabledKeys = user.subscription?.enabledModules || [];
    // System keys usually include dashboard and settings, but we exclude settings from the TABLE
    const systemKeys = ['dashboard'];
    const allowedKeys = new Set([...enabledKeys, ...systemKeys]);

    return MODULES_LIST.filter(moduleName => {
      const key = MODULE_KEY_MAP[moduleName];
      return allowedKeys.has(key);
    });
  }, [user, isAuthLoading]);

  // Feature-based permission management hook
  const {
    permissions,
    expandedModules,
    loadPermissions,
    toggleModuleExpansion,
    toggleFeature,
    toggleModuleAll,
    revokeAllPermissions,
    grantAllPermissions,
    getBackendPermissions
  } = useFeaturePermissions(featureRegistry);

  // Load permissions when role is selected
  useEffect(() => {
    if (selectedRoleId && selectedRole) {
      if (selectedRole.permissions) {
        loadPermissions(selectedRole.permissions);
      }
      // Load access settings
      setWebAccess(selectedRole.webPortalAccess || false);
      setMobileAccess(selectedRole.mobileAppAccess || false);
    }
  }, [selectedRoleId, selectedRole, loadPermissions]);

  // Update role mutation
  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: (newPermissions?: FeaturePermissions) => roleService.update(selectedRoleId, {
      permissions: newPermissions ?? getBackendPermissions(),
      webPortalAccess: webAccess,
      mobileAppAccess: mobileAccess
    }),
    onSuccess: () => {
      toast.success('Role permissions updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Update failed';
      toast.error(message);
    }
  });

  // Delete role mutation
  const { mutate: deleteRole, isPending: isDeleting } = useMutation({
    mutationFn: () => roleService.delete(selectedRoleId),
    onSuccess: () => {
      toast.success('Role deleted successfully!');
      setSelectedRoleId('');
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Delete failed';
      toast.error(message);
      setIsDeleteModalOpen(false);
    }
  });

  const handleSave = useCallback(() => {
    if (!selectedRoleId) {
      toast.error("Please select a role to update");
      return;
    }
    updateRole(undefined);
  }, [selectedRoleId, updateRole]);

  const handleDeleteClick = () => {
    if (!selectedRole) return;
    if (selectedRole.isDefault) {
      toast.error("Default roles cannot be deleted");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleCancel = useCallback(() => {
    if (selectedRole) {
      if (selectedRole.permissions) {
        loadPermissions(selectedRole.permissions);
      }
      setWebAccess(selectedRole.webPortalAccess || false);
      setMobileAccess(selectedRole.mobileAppAccess || false);
      toast.success("Changes discarded");
    }
  }, [selectedRole, loadPermissions]);

  const isPending = isUpdating || isDeleting;

  return (
    <Sidebar>
      {/* Fixed height container - counteracts Sidebar layout py-10 padding */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-10 h-[calc(100vh-4rem)]">
        <div className="flex flex-col h-full overflow-hidden pt-6">
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Loading State */}
          {(isAuthLoading || isLoadingRegistry) ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Page Title Section - Above both sidebar and content */}

              <div className="px-6 pt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {activeTab === 'hierarchy' && 'Role Hierarchy'}
                  {activeTab === 'permission' && 'User Role & Permission'}
                  {activeTab === 'customization' && 'Customization'}
                  {activeTab === 'subscription' && 'Subscription'}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeTab === 'permission' && 'Define and manage user roles with granular access control and module permissions'}
                  {activeTab === 'hierarchy' && 'View and manage the hierarchical structure of roles'}
                  {activeTab === 'customization' && 'Customize role settings and permissions'}
                  {activeTab === 'subscription' && 'Manage subscription plans and features'}
                </p>
              </div>


              {/* Permission Tab Content - Horizontal Layout with Sidebar */}
              {activeTab === 'permission' && (
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

                  {/* Right Content Area - Module Permissions */}
                  <div className="flex-1 flex flex-col min-w-0 bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white z-10">
                      <div className="flex items-center gap-2">
                        {/* Spacer for alignment with accordion chevron */}
                        <div className="w-5" />
                        <h3 className="text-base font-bold text-gray-900">Modules</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">All Access</div>
                        <div className="h-4 w-px bg-gray-300 mx-2" />
                        <Button
                          variant="ghost"
                          size="icon" // Using icon size or small size for header button if appropriate, or default
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
                    <AdminPanelFooter
                      totalModules={filteredModules.length}
                      isPending={isPending}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </div>
                </div>
              )}

              {/* Other Tabs - Full Width Placeholders */}
              {(activeTab === 'hierarchy' || activeTab === 'customization' || activeTab === 'subscription') && (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-gray-500">This feature is coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Role Modal */}
        <CreateRoleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Role"
          message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={() => deleteRole()}
          confirmButtonText="Delete Role"
          confirmButtonVariant="danger"
        />

        {/* Revoke Confirmation Modal */}
        <ConfirmationModal
          isOpen={isRevokeModalOpen}
          title="Revoke Access"
          message={`Are you sure you want to revoke all permissions for the role "${selectedRole?.name}"? This will disable all modules.`}
          onCancel={() => setIsRevokeModalOpen(false)}
          onConfirm={() => {
            const newPerms = revokeAllPermissions();
            if (newPerms) {
              updateRole(newPerms);
            }
            setIsRevokeModalOpen(false);
          }}
          confirmButtonText="Revoke Access"
          confirmButtonVariant="danger"
        />

        {/* Grant All Confirmation Modal */}
        <ConfirmationModal
          isOpen={isGrantAllModalOpen}
          title="Grant All Access"
          message={`Are you sure you want to grant full access to all modules for the role "${selectedRole?.name}"? This will enable every feature.`}
          onCancel={() => setIsGrantAllModalOpen(false)}
          onConfirm={() => {
            const newPerms = grantAllPermissions();
            if (newPerms) {
              updateRole(newPerms);
            }
            setIsGrantAllModalOpen(false);
          }}
          confirmButtonText="Grant All Access"
          confirmButtonVariant="primary"
        />
      </div>
    </Sidebar>
  );
};

export default AdminPanelPage;