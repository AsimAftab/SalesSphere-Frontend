import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import Button from '../../components/UI/Button/Button';
import type { Role } from './admin.types';

interface AdminPanelHeaderProps {
  roles: Role[];
  selectedRoleId: string;
  onSelectRole: (roleId: string) => void;
  isLoadingRoles: boolean;
  onDeleteRole: () => void;
  onRevoke: () => void;
  isPending: boolean;
  onCreateRole: () => void;
}

export const AdminPanelHeader: React.FC<AdminPanelHeaderProps> = ({
  roles,
  selectedRoleId,
  onSelectRole,
  isLoadingRoles,
  onDeleteRole,
  onRevoke,
  isPending,
  onCreateRole
}) => {
  const selectedRole = roles.find(r => r._id === selectedRoleId);

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0 ">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Panel</h1>
        <p className="text-md text-gray-500">Manage role permissions and access</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Role Selector */}
        <div className="relative min-w-[200px] w-full sm:w-auto">
          <select
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition-all cursor-pointer"
            value={selectedRoleId}
            onChange={(e) => onSelectRole(e.target.value)}
            disabled={isPending}
          >
            <option value="">-- Choose a Role --</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name} {role.isDefault ? '(Default)' : ''}
              </option>
            ))}
          </select>
          {isLoadingRoles && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Delete Role Button */}
        {selectedRoleId && !selectedRole?.isDefault && (
          <Button
            onClick={onDeleteRole}
            disabled={isPending}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto justify-center"
            title="Delete Role"
          >
            <Trash2 size={16} />Delete Role
          </Button>
        )}

        {/* Add Role Button */}
        <Button
          disabled={isPending}
          onClick={onCreateRole}
          className="w-full sm:w-auto justify-center"
        >
          Add New Role
        </Button>

        {/* Revoke Button */}
        <Button
          onClick={onRevoke}
          variant='outline'
          className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50 w-full sm:w-auto justify-center"
          disabled={isPending}
          title="Revoke All Access"
        >
          <RotateCcw size={16} />Revoke All Access
        </Button>
      </div>
    </div>
  );
};