import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    updateEmployee,
    deleteEmployee,
    type Employee
} from '../../../../api/employeeService';
import { assignRoleToUser } from '../../../../api/roleService';

export const useEmployeeActions = (employee: Employee | undefined | null) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const updateMutation = useMutation({
        mutationFn: ({ userId, formData }: { userId: string, formData: FormData }) =>
            updateEmployee(userId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employee', employee?._id] });
            queryClient.invalidateQueries({ queryKey: ['attendanceSummary', employee?._id] });
            setIsEditOpen(false);
            toast.success('Employee updated successfully');
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : 'Failed to update employee.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteEmployee(id),
        onSuccess: () => {
            setIsDeleteConfirmOpen(false);
            toast.success('Employee deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            navigate('/employees');
        },
        onError: (err: Error) => {
            toast.error(err.message);
            setIsDeleteConfirmOpen(false);
        },
    });

    const handleSaveEdit = async (formData: FormData, customRoleId: string) => {
        if (!employee?._id) return;
        try {
            await updateMutation.mutateAsync({ userId: employee._id, formData });
            if (customRoleId) {
                await assignRoleToUser(customRoleId, employee._id);
                queryClient.invalidateQueries({ queryKey: ['employee', employee._id] });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDeleteEmployee = () => {
        if (employee?._id) {
            deleteMutation.mutate(employee._id);
        }
    };

    return {
        isEditOpen,
        setIsEditOpen,
        isDeleteConfirmOpen,
        setIsDeleteConfirmOpen,
        handleSaveEdit,
        confirmDeleteEmployee,
        isLoading: updateMutation.isPending || deleteMutation.isPending
    };
};
