import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PermissionTable from './PermissionTable';
import { AdminPanelHeader } from './AdminPanelHeader';
import { AdminPanelFooter } from './AdminPanelFooter';
import { useAdminPermissions } from './useAdminPermission';
import CreateRoleModal from './CreateRoleModal';
import { MODULES_LIST, MODULE_KEY_MAP, type Role } from './admin.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../../api/roleService';
import { useAuth } from '../../api/authService';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { Navigate } from 'react-router-dom';

const AdminPanelPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();

  // Access Control: Strict check for Admin roles only
  // Custom roles (even with settings access) should not see this page
  if (user && !['superadmin', 'developer', 'admin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // State
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Access Control State
  const [webAccess, setWebAccess] = useState(false);
  const [mobileAccess, setMobileAccess] = useState(false);

  // Fetch roles
  const { data: rolesResponse, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getAll
  });

  const roles: Role[] = rolesResponse?.data?.data || [];
  const selectedRole = roles.find(r => r._id === selectedRoleId);

  // Filter modules based on subscription
  const filteredModules = useMemo(() => {
    // If loading, show nothing to prevent flash of unauthorized content
    if (isAuthLoading || !user) return [];

    // Superadmins and Developers get everything
    if (['superadmin', 'developer'].includes(user.role)) return [...MODULES_LIST];

    const enabledKeys = user.subscription?.enabledModules || [];
    // Always include system modules
    const systemKeys = ['dashboard', 'settings'];
    const allowedKeys = new Set([...enabledKeys, ...systemKeys]);

    return MODULES_LIST.filter(moduleName => {
      const key = MODULE_KEY_MAP[moduleName];
      return allowedKeys.has(key);
    });
  }, [user, isAuthLoading]);

  // Permission management hook
  const {
    permissions,
    setPermissions,
    togglePermission,
    revokeAll,
    grantAll,
    getBackendPermissions,
    isEverythingSelected
  } = useAdminPermissions([...filteredModules]);

  // Load permissions when role is selected
  useEffect(() => {
    if (selectedRoleId && selectedRole) {
      if (selectedRole.permissions) {
        setPermissions(selectedRole.permissions);
      }
      // Load access settings
      setWebAccess(selectedRole.webPortalAccess || false);
      setMobileAccess(selectedRole.mobileAppAccess || false);
    }
  }, [selectedRoleId, selectedRole, setPermissions]);

  // Update role mutation
  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: () => roleService.update(selectedRoleId, {
      permissions: getBackendPermissions(),
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
    updateRole();
  }, [selectedRoleId, updateRole]);

  const handleDeleteClick = () => {
    if (!selectedRole) return;
    if (selectedRole.isDefault) {
      toast.error("Default roles cannot be deleted");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const isPending = isUpdating || isDeleting;

  return (
    <Sidebar>
      <div className="flex flex-col h-[calc(100vh-180px)] gap-y-4 overflow-hidden">

        {/* Header Section */}
        <AdminPanelHeader
          onRevoke={revokeAll}
          isPending={isPending}
          onCreateRole={() => setIsCreateModalOpen(true)}
          roles={roles}
          selectedRoleId={selectedRoleId}
          onSelectRole={setSelectedRoleId}
          isLoadingRoles={isLoadingRoles}
          onDeleteRole={handleDeleteClick}
        />


        {isAuthLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Platform Access Settings (Only when role selected) */}
            {selectedRoleId && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-8">
                <h3 className="text-sm font-bold text-gray-700 whitespace-nowrap">Platform Access:</h3>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={webAccess}
                      onChange={(e) => setWebAccess(e.target.checked)}
                      className="sr-only peer"
                      disabled={isPending}
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium select-none">Web Portal</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={mobileAccess}
                      onChange={(e) => setMobileAccess(e.target.checked)}
                      className="sr-only peer"
                      disabled={isPending}
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium select-none">Mobile App</span>
                </label>

                <span className="ml-auto text-xs text-slate-400 italic">
                  Enable access to allow users with this role to login.
                </span>
              </div>
            )}


            {/* Permissions Table */}
            <div className={`flex flex-col flex-1 min-h-0 overflow-hidden transition-all duration-300 ${!selectedRoleId ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
              <PermissionTable
                modules={[...filteredModules]}
                permissions={permissions}
                onToggle={togglePermission}
                isEverythingSelected={isEverythingSelected}
                onGrantAll={grantAll}
              />
            </div>

            {/* Footer Section */}
            <AdminPanelFooter
              total={filteredModules.length}
              isPending={isPending}
              onSave={handleSave}
            />
          </>
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
    </Sidebar >
  );
};

export default AdminPanelPage;