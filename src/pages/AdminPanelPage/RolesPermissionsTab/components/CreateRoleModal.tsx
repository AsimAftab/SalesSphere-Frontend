import React from 'react';
import { Shield, Globe, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { roleService } from '@/api/roleService';
import { Button, FormModal } from '@/components/ui';

const createRoleSchema = z.object({
    name: z.string().min(1, 'Role name is required').max(50, 'Role name must be 50 characters or less'),
    description: z.string().max(200, 'Description must be 200 characters or less').optional().transform(val => val || undefined),
    webPortalAccess: z.boolean(),
    mobileAppAccess: z.boolean(),
}).refine((data) => data.webPortalAccess || data.mobileAppAccess, {
    message: 'At least one platform access must be enabled',
    path: ['mobileAppAccess'],
});

type CreateRoleFormData = z.infer<typeof createRoleSchema>;

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateRoleFormData>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: '',
            description: '',
            webPortalAccess: false,
            mobileAppAccess: false,
        }
    });

    const descriptionValue = watch('description') || '';

    // Create mutation
    const { mutate: createRole, isPending } = useMutation({
        mutationFn: roleService.create,
        onSuccess: () => {
            toast.success('Role created successfully!');
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            reset();
            onClose();
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const message = error?.response?.data?.message || error?.message || 'Failed to create role';
            toast.error(message);
        }
    });

    const onSubmit = (data: CreateRoleFormData) => {
        createRole({
            name: data.name.trim(),
            description: data.description?.trim() || undefined,
            permissions: {},
            mobileAppAccess: data.mobileAppAccess,
            webPortalAccess: data.webPortalAccess
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New Role"
            description="Define a new role with platform access settings"
            icon={<Shield className="w-5 h-5 text-secondary" />}
            size="sm"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <Button
                        variant='outline'
                        onClick={handleClose}
                        disabled={isPending}
                        type="button"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='secondary'
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending}
                    >
                        {isPending ? 'Creating...' : 'Create Role'}
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                {/* Role Name */}
                <div>
                    <label htmlFor="create-role-name" className="block text-sm font-semibold text-gray-700 mb-1">
                        Role Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="create-role-name"
                        type="text"
                        {...register('name')}
                        placeholder="e.g., Sales Manager, Field Agent"
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${
                            errors.name
                                ? 'border-red-300 ring-1 ring-red-100'
                                : 'border-gray-200 focus:ring-2 focus:ring-secondary focus:border-secondary'
                        }`}
                        maxLength={50}
                        disabled={isPending}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="create-role-description" className="block text-sm font-semibold text-gray-700 mb-1">
                        Description <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                        id="create-role-description"
                        {...register('description')}
                        placeholder="Brief description of this role's responsibilities..."
                        rows={3}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all resize-none ${
                            errors.description
                                ? 'border-red-300 ring-1 ring-red-100'
                                : 'border-gray-200 focus:ring-2 focus:ring-secondary focus:border-secondary'
                        }`}
                        maxLength={200}
                        disabled={isPending}
                    />
                    <div className="flex items-center justify-between mt-1">
                        {errors.description ? (
                            <p className="text-xs text-red-500">{errors.description.message}</p>
                        ) : <span />}
                        <span className="text-xs text-gray-400">{descriptionValue.length}/200</span>
                    </div>
                </div>

                {/* Access Toggles */}
                <div>
                    <h4 className="block text-sm font-semibold text-gray-700 mb-2">Platform Access</h4>

                    <div className="space-y-1.5">
                        {errors.mobileAppAccess && (
                            <p className="text-xs text-red-500">{errors.mobileAppAccess.message}</p>
                        )}
                        {/* Web Portal Access */}
                        <label htmlFor="create-web-access" className="flex items-center justify-between cursor-pointer py-1.5 hover:bg-gray-50 rounded-md transition-colors">
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
                                    id="create-web-access"
                                    type="checkbox"
                                    {...register('webPortalAccess')}
                                    className="sr-only peer"
                                    disabled={isPending}
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-secondary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                            </div>
                        </label>

                        {/* Mobile App Access */}
                        <label htmlFor="create-mobile-access" className="flex items-center justify-between cursor-pointer py-1.5 hover:bg-gray-50 rounded-md transition-colors">
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
                                    id="create-mobile-access"
                                    type="checkbox"
                                    {...register('mobileAppAccess')}
                                    className="sr-only peer"
                                    disabled={isPending}
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-secondary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-amber-500 text-sm mt-0.5">&#9432;</span>
                    <p className="text-xs font-medium text-amber-700">
                        After creating the role, select it from the dropdown to configure module permissions.
                    </p>
                </div>
            </form>
        </FormModal>
    );
};

export default CreateRoleModal;
