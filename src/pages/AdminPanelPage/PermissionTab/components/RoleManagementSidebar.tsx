import React from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import type { Role } from '../types/admin.types';
import { Button } from '@/components/ui';

interface RoleManagementSidebarProps {
    roles: Role[];
    selectedRoleId: string;
    onSelectRole: (id: string) => void;
    onAddRole: () => void;
    onDeleteRole: () => void;
    webAccess: boolean;
    mobileAccess: boolean;
    onWebAccessChange: (value: boolean) => void;
    onMobileAccessChange: (value: boolean) => void;
    onRevokeAll: () => void;
    isLoading: boolean;
    isPending: boolean;
}

const RoleManagementSidebar: React.FC<RoleManagementSidebarProps> = ({
    roles,
    selectedRoleId,
    onSelectRole,
    onAddRole,
    onDeleteRole,
    webAccess,
    mobileAccess,
    onWebAccessChange,
    onMobileAccessChange,
    onRevokeAll,
    isLoading,
    isPending
}) => {
    const selectedRole = roles.find(r => r._id === selectedRoleId);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-6 h-full">
            {/* Roles Section */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900">Roles</h3>
                <Button
                    onClick={onAddRole}
                    disabled={isPending}
                    variant='secondary'
                    className="w-full mt-auto"
                >
                    Add New Role
                </Button>
            </div>

            {/* Choose Role Dropdown */}
            <div className="space-y-2">
                <label htmlFor="choose-role-select" className="block text-sm font-medium text-gray-700">Choose Role</label>
                <div className="relative">
                    <select
                        id="choose-role-select"
                        value={selectedRoleId}
                        onChange={(e) => onSelectRole(e.target.value)}
                        disabled={isLoading || isPending}
                        className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                            <option key={role._id} value={role._id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Access Control */}
            <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-gray-900">Access Control</h4>

                <label htmlFor="web-access-toggle" aria-label="Toggle web access" className="flex items-center justify-between cursor-pointer group">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Web Access</div>
                        <div className="text-xs text-gray-500">Allow access to web platform</div>
                    </div>
                    <div className="relative ml-3">
                        <input
                            id="web-access-toggle"
                            type="checkbox"
                            checked={webAccess}
                            onChange={(e) => onWebAccessChange(e.target.checked)}
                            disabled={isPending || !selectedRoleId}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                    </div>
                </label>

                <label htmlFor="mobile-access-toggle" aria-label="Toggle mobile app access" className="flex items-center justify-between cursor-pointer group">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">App Access</div>
                        <div className="text-xs text-gray-500">Allow access to mobile app</div>
                    </div>
                    <div className="relative ml-3">
                        <input
                            id="mobile-access-toggle"
                            type="checkbox"
                            checked={mobileAccess}
                            onChange={(e) => onMobileAccessChange(e.target.checked)}
                            disabled={isPending || !selectedRoleId}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                    </div>
                </label>
            </div>

            {/* Revoke Access Button */}
            <Button
                onClick={onRevokeAll}
                disabled={isPending || !selectedRoleId}
                variant='danger'
                className="w-full mt-auto"
            >
                Revoke Access
            </Button>

            {/* Delete Role Button */}
            {selectedRole && !selectedRole.isDefault && (
                <Button
                    onClick={onDeleteRole}
                    disabled={isPending}
                    variant='danger'
                    className="w-full gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Role
                </Button>
            )}
        </div>
    );
};

export default RoleManagementSidebar;
