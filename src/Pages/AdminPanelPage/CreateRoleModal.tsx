import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { roleService } from '../../api/roleService';
import { toBackendPermissions } from './useAdminPermission';
import { MODULES_LIST, type ModulePermissions } from './admin.types';

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [mobileAppAccess, setMobileAppAccess] = useState(false);
    const [webPortalAccess, setWebPortalAccess] = useState(false);

    // Reset form
    const resetForm = () => {
        setName('');
        setDescription('');
        setMobileAppAccess(false);
        setWebPortalAccess(false);
    };

    // Create mutation
    const { mutate: createRole, isPending } = useMutation({
        mutationFn: roleService.create,
        onSuccess: () => {
            toast.success('Role created successfully!');
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            resetForm();
            onClose();
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || 'Failed to create role';
            toast.error(message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Role name is required');
            return;
        }

        // Create with empty permissions - user will configure after creation
        const emptyPermissions: Record<string, ModulePermissions> = {};
        MODULES_LIST.forEach(module => {
            emptyPermissions[module] = { all: false, add: false, update: false, view: false, delete: false };
        });

        createRole({
            name: name.trim(),
            description: description.trim() || undefined,
            permissions: toBackendPermissions(emptyPermissions),
            mobileAppAccess,
            webPortalAccess
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Plus size={20} />
                        Create New Role
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Role Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Sales Manager, Field Agent"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            maxLength={50}
                            disabled={isPending}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this role's responsibilities..."
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                            maxLength={200}
                            disabled={isPending}
                        />
                    </div>

                    {/* Access Toggles */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Platform Access</h3>

                        {/* Web Portal Access */}
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-gray-600">Web Portal Access</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={webPortalAccess}
                                    onChange={(e) => setWebPortalAccess(e.target.checked)}
                                    className="sr-only peer"
                                    disabled={isPending}
                                />
                                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                            </div>
                        </label>

                        {/* Mobile App Access */}
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-gray-600">Mobile App Access</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={mobileAppAccess}
                                    onChange={(e) => setMobileAppAccess(e.target.checked)}
                                    className="sr-only peer"
                                    disabled={isPending}
                                />
                                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                            </div>
                        </label>
                    </div>

                    {/* Info Note */}
                    <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                        💡 After creating the role, select it from the dropdown to configure module permissions.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Create Role
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoleModal;
