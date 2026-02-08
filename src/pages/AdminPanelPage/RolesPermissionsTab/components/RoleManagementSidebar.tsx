import React, { useMemo } from 'react';
import { Trash2, Shield, Globe, Smartphone, ShieldCheck, ShieldOff } from 'lucide-react';
import type { Role } from '../types/admin.types';
import { Button, DropDown, type DropDownOption } from '@/components/ui';

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
    roleDescription: string;
    onRoleDescriptionChange: (value: string) => void;
    onGrantAll: () => void;
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
    roleDescription,
    onRoleDescriptionChange,
    onGrantAll,
    onRevokeAll,
    isLoading,
    isPending
}) => {
    const selectedRole = roles.find(r => r._id === selectedRoleId);

    const roleOptions: DropDownOption[] = useMemo(() =>
        roles.map((role) => ({
            value: role._id,
            label: role.name,
        })),
        [roles]
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {/* Header Section */}
            <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-2 bg-secondary/10 rounded-lg">
                        <Shield className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Role Management</h3>
                        <p className="text-xs text-gray-500">Configure roles and permissions</p>
                    </div>
                </div>
            </div>

            {/* Add Role + Choose Role Section */}
            <div className="px-4 py-2.5 space-y-2.5">
                <Button
                    onClick={onAddRole}
                    disabled={isPending}
                    variant='secondary'
                    className="w-full"
                >
                    Add New Role
                </Button>
                <DropDown
                    value={selectedRoleId}
                    onChange={onSelectRole}
                    options={roleOptions}
                    placeholder="Select a role"
                    label="Choose Role"
                    disabled={isLoading || isPending}
                    triggerClassName="!min-h-9 !py-1.5"
                    hideScrollbar
                />
                {selectedRoleId && (
                    <div className="mt-1.5">
                        <label htmlFor="role-description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea
                            id="role-description"
                            value={roleDescription}
                            onChange={(e) => onRoleDescriptionChange(e.target.value)}
                            placeholder="Brief description of this role..."
                            rows={4}
                            maxLength={200}
                            disabled={isPending}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="text-xs text-gray-400 text-right">
                            {roleDescription.length}/200
                        </div>
                    </div>
                )}
            </div>

            {/* Sections that require a role selection */}
            <div className={`flex flex-col ${!selectedRoleId ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Access Control Section */}
                <div className="border-t border-dashed border-gray-200 px-4 py-2 space-y-1.5">
                    <h4 className="block text-sm font-semibold text-gray-700">Access Control</h4>

                    <label htmlFor="web-access-toggle" aria-label="Toggle web access" className="flex items-center justify-between cursor-pointer py-1.5 hover:bg-gray-50 rounded-md transition-colors">
                        <div className="flex items-center gap-2.5 flex-1">
                            <div className="flex-shrink-0 p-1.5 bg-secondary/10 rounded-md">
                                <Globe className="w-3.5 h-3.5 text-secondary" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">Web Access</div>
                                <div className="text-xs text-gray-500">Allow access to web platform</div>
                            </div>
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
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-secondary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                        </div>
                    </label>

                    <label htmlFor="mobile-access-toggle" aria-label="Toggle mobile app access" className="flex items-center justify-between cursor-pointer py-1.5 hover:bg-gray-50 rounded-md transition-colors">
                        <div className="flex items-center gap-2.5 flex-1">
                            <div className="flex-shrink-0 p-1.5 bg-secondary/10 rounded-md">
                                <Smartphone className="w-3.5 h-3.5 text-secondary" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">App Access</div>
                                <div className="text-xs text-gray-500">Allow access to mobile app</div>
                            </div>
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
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-secondary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                        </div>
                    </label>
                </div>

                {/* Permission Actions Section */}
                <div className="border-t border-dashed border-gray-200 px-4 py-2.5 space-y-1.5">
                    <h4 className="block text-sm font-semibold text-gray-700">Permission Actions</h4>
                    <p className="text-xs text-gray-400">Grant or revoke all module permissions for this role</p>

                    <div className="flex gap-2">
                        <Button
                            onClick={onGrantAll}
                            disabled={isPending || !selectedRoleId}
                            variant='success'
                            className="flex-1 gap-1.5"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Grant All
                        </Button>

                        <Button
                            onClick={onRevokeAll}
                            disabled={isPending || !selectedRoleId}
                            variant='danger'
                            className="flex-1 gap-1.5"
                        >
                            <ShieldOff className="w-4 h-4" />
                            Revoke All
                        </Button>
                    </div>

                    {selectedRole && !selectedRole.isDefault && (
                        <div className="pt-2">
                            <Button
                                onClick={onDeleteRole}
                                disabled={isPending}
                                variant='danger'
                                className="w-full gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Role
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoleManagementSidebar;
