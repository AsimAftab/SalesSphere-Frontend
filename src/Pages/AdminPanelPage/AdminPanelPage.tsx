import React, { useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PermissionTable from './PermissionTable';
import { AdminPanelHeader } from './AdminPanelHeader';
import { AdminPanelFooter } from './AdminPanelFooter';
import { useAdminPermissions } from './useAdminPermission';
import { MODULES_LIST, type ModulePermissions } from './admin.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRolePermissions } from '../../api/adminPanelSevice';
import { toast } from 'react-hot-toast';


const AdminPanelPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { 
    permissions, 
    togglePermission, 
    revokeAll, 
    grantAll, 
    isEverythingSelected 
  } = useAdminPermissions([...MODULES_LIST]);

  // Mutation handling for saving changes
  const { mutate: updatePermissions, isPending } = useMutation({
    mutationFn: (payload: Record<string, ModulePermissions>) => updateRolePermissions(payload),
    onSuccess: () => {
      toast.success('Permissions updated successfully!');
      // Refresh relevant data across the app
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || 'Update failed';
      toast.error(errorMessage);
    }
  });

  // Memoized save handler to prevent unnecessary child re-renders
  const handleSave = useCallback(() => {
    updatePermissions(permissions);
  }, [permissions, updatePermissions]);

  return (
    <Sidebar>
     
      <div className="flex flex-col h-[calc(100vh-144px)] gap-y-6 overflow-hidden">
        
        {/* Fixed Header Section */}
        <AdminPanelHeader 
          onRevoke={revokeAll} 
          isPending={isPending} 
        />

      
        <PermissionTable 
          modules={[...MODULES_LIST]}
          permissions={permissions}
          onToggle={togglePermission}
          isEverythingSelected={isEverythingSelected}
          onGrantAll={grantAll}
        />

        {/* Fixed Footer Section */}
        <AdminPanelFooter 
          total={MODULES_LIST.length} 
          isPending={isPending} 
          onSave={handleSave} 
        />
      </div>
    </Sidebar>
  );
};

export default AdminPanelPage;