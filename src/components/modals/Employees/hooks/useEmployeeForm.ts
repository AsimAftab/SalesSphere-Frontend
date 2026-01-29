import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { employeeSchema, type EmployeeFormData } from '../common/EmployeeSchema';
import { getRoles } from '../../../../api/roleService';
import type { Employee } from '../../../../api/employeeService';
import { useEffect, useCallback } from 'react';

// Define Role Interface locally or import if available shared
interface Role {
    _id: string;
    name: string;
}

interface UseEmployeeFormProps {
    mode: 'add' | 'edit';
    initialData?: Employee;
    onSave: (formData: FormData, customRoleId: string, documentFiles?: File[]) => Promise<void>;
    onSuccess: () => void;
}

export const useEmployeeForm = ({ mode, initialData, onSave, onSuccess }: UseEmployeeFormProps) => {

    // 1. Fetch Roles
    const { data: roles = [], isLoading: isLoadingRoles } = useQuery<Role[]>({
        queryKey: ['roles'],
        queryFn: getRoles,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // 2. Initialize Form
    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            gender: '' as any,
            customRoleId: '',
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
            const getRoleId = (roleData: any) => {
                if (!roleData) return '';
                if (typeof roleData === 'string') return roleData;
                return roleData._id || '';
            };

            reset({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                gender: (initialData.gender as any) || 'Male',
                customRoleId: getRoleId(initialData.customRoleId),
                panNumber: initialData.panNumber || '',
                citizenshipNumber: initialData.citizenshipNumber || '',
                // Ensure dates are converted to ISO string for the input
                dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString() : '',
                dateJoined: initialData.dateJoined ? new Date(initialData.dateJoined).toISOString() : '',
            });
        } else {
            reset({
                name: '',
                email: '',
                phone: '',
                address: '',
                gender: '' as any,
                customRoleId: '',
                panNumber: '',
                citizenshipNumber: '',
                dateOfBirth: '',
                dateJoined: '',
                documents: []
            });
        }
    }, [mode, initialData, reset]);

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
            formData.append('gender', data.gender);
            formData.append('role', 'user'); // Always 'user' base role
            formData.append('panNumber', data.panNumber);
            formData.append('citizenshipNumber', data.citizenshipNumber);
            formData.append('dateOfBirth', data.dateOfBirth);

            if (data.dateJoined) {
                formData.append('dateJoined', data.dateJoined);
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
        submitHandler: handleSubmit(onSubmit),
        resetForm
    };
};
