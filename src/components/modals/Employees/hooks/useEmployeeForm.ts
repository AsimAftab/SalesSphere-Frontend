import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { employeeSchema, systemUserSchema } from '../common/EmployeeSchema';
import { getRoles } from '@/api/roleService';
import type { Employee } from '@/api/employeeService';
import type { SystemUser } from '@/api/SuperAdmin/systemUserService';
import { useEffect, useCallback } from 'react';

// Define Role Interface locally or import if available shared
interface Role {
    _id: string;
    name: string;
}

interface UseEmployeeFormProps {
    mode: 'add' | 'edit';
    variant?: 'employee' | 'system-user'; // New prop
    initialData?: Employee | SystemUser;
    onSave: (formData: FormData, customRoleId: string, documentFiles?: File[]) => Promise<void>;
    onSuccess: () => void;
}

export interface EmployeeFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: 'Male' | 'Female' | 'Other' | undefined;
    customRoleId: string;
    role: string | undefined;
    panNumber: string;
    citizenshipNumber: string;
    dateOfBirth: string;
    dateJoined: string;
    documents: File[];
    photoFile?: File;
}

export const useEmployeeForm = ({ mode, variant = 'employee', initialData, onSave, onSuccess }: UseEmployeeFormProps) => {

    // 1. Fetch Roles (Only for employees)
    const { data: roles = [], isLoading: isLoadingRoles } = useQuery<Role[]>({
        queryKey: ['roles'],
        queryFn: getRoles,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: variant === 'employee', // Only fetch for employees
    });

    // 2. Initialize Form
    const form = useForm<EmployeeFormData>({
        // @ts-expect-error - Zod resolver doesn't support schema unions, but runtime validation works correctly
        resolver: zodResolver(variant === 'employee' ? employeeSchema : systemUserSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            gender: undefined,
            customRoleId: '',
            role: undefined, // For system user
            panNumber: '',
            citizenshipNumber: '',
            dateOfBirth: '',
            dateJoined: '',
            documents: []
        }
    });

    const { reset, handleSubmit } = form;

    // 3. Reset/Populate Form
    const resetForm = useCallback(() => {
        if (mode === 'edit' && initialData) {
            // Helper to safely get ID string
            const getRoleId = (roleData: string | { _id: string; name: string } | undefined) => {
                if (!roleData) return '';
                if (typeof roleData === 'string') return roleData;
                return roleData._id || '';
            };

            const commonData = {
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                gender: (initialData.gender || 'Male') as 'Male' | 'Female' | 'Other',
                citizenshipNumber: initialData.citizenshipNumber || '',
                dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString() : '',
                dateJoined: initialData.dateJoined ? new Date(initialData.dateJoined).toISOString() : '',
            };

            if (variant === 'employee') {
                const empData = initialData as Employee;
                reset({
                    ...commonData,
                    customRoleId: getRoleId(empData.customRoleId),
                    panNumber: empData.panNumber || '',
                });
            } else {
                const sysData = initialData as SystemUser;
                reset({
                    ...commonData,
                    role: sysData.role || '',
                    // System users might have panNumber now (via manual entry in form), though backend might not send it yet
                    // If backend sends it in future, mapped here:
                    panNumber: sysData.panNumber || '',
                });
            }
        } else {
            reset({
                name: '',
                email: '',
                phone: '',
                address: '',
                gender: undefined,
                customRoleId: '',
                role: '',
                panNumber: '',
                citizenshipNumber: '',
                dateOfBirth: '',
                dateJoined: '',
                documents: []
            });
        }
    }, [mode, variant, initialData, reset]);

    // Initial reset
    useEffect(() => {
        resetForm();
    }, [resetForm]);


    // 4. Submission Handler
    const onSubmit = async (data: EmployeeFormData) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('address', data.address);
            if (data.gender) formData.append('gender', data.gender);
            formData.append('citizenshipNumber', data.citizenshipNumber);
            formData.append('dateOfBirth', data.dateOfBirth);

            // Date Joined (optional for system users in some contexts but good to have)
            if (data.dateJoined) {
                formData.append('dateJoined', data.dateJoined);
            }

            if (variant === 'employee') {
                formData.append('role', 'user'); // Always 'user' base role for employees
                formData.append('panNumber', data.panNumber);
                // customRoleId is passed as 2nd arg to onSave
            } else {
                formData.append('role', data.role || ''); // 'superadmin' or 'developer'
                formData.append('panNumber', data.panNumber);
                // No customRoleId
            }

            // Handle Avatar
            if (data.photoFile) {
                formData.append('avatar', data.photoFile);
            }

            // Handle Documents (passed separately to onSave as per existing pattern or appened to formData if backend supports it)
            // Existing pattern in EmployeeFormModal passed documents as 3rd arg.
            // We will stick to the interface defined in props.

            await onSave(formData, data.customRoleId, data.documents);
            onSuccess();
        } catch (error) {
            console.error('Submission failed:', error);
            // Form error handling can be enhanced here
        }
    };

    return {
        form,
        roles,
        isLoadingRoles,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        submitHandler: handleSubmit(onSubmit as any),
        resetForm
    };
};
