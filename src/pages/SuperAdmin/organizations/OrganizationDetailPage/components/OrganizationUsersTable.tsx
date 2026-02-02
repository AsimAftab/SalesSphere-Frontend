import React from 'react';
import { Users as UsersIcon, Plus, Verified } from 'lucide-react';
import type { User } from '@/api/SuperAdmin/organizationService';
import { Button as CustomButton, EmptyState } from '@/components/ui';

interface OrganizationUsersTableProps {
    users: User[];
    onAddUser: () => void;
}

export const OrganizationUsersTable: React.FC<OrganizationUsersTableProps> = ({ users, onAddUser }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-white p-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-slate-500" />
                        <h3 className="text-lg font-semibold text-slate-800">Users & Access</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ml-2">
                            {users.length} User{users.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <CustomButton
                        onClick={onAddUser}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </CustomButton>
                </div>
            </div>
            <div className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Last Active</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-slate-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-purple-50 text-purple-700 border border-purple-100">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                                                <Verified className="w-4 h-4" />
                                                {user.isActive ? 'Verified' : 'Inactive'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{user.lastActive || 'Never'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100">
                                                    Reset
                                                </button>
                                                <button className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100">
                                                    Transfer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8">
                                        <EmptyState
                                            title="No Users Found"
                                            description="There are no users associated with this organization yet. Add a new user to get started."
                                            icon={<UsersIcon className="w-12 h-12 text-slate-300" />}
                                            action={
                                                <CustomButton
                                                    onClick={onAddUser}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add User
                                                </CustomButton>
                                            }
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
