import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addEmployee, uploadEmployeeDocuments, type Employee } from '@/api/employeeService';
import { assignRoleToUser } from '@/api/roleService';
import { type Role } from '@/pages/AdminPanelPage/RolesPermissionsTab/types/admin.types';
import { EmployeeExportService } from '../components/EmployeeExportService';
import { EMPLOYEE_QUERY_KEY } from './useEmployeeData';
import toast from 'react-hot-toast';

interface UseEmployeeActionsOptions {
    filteredEmployees: Employee[];
    roles: Role[];
}

/**
 * Hook for managing employee CRUD operations and exports.
 * Separates mutation logic from data fetching and filtering.
 */
export const useEmployeeActions = ({ filteredEmployees, roles }: UseEmployeeActionsOptions) => {
    const queryClient = useQueryClient();
    const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const addEmployeeMutation = useMutation({
        mutationFn: async ({
            userFormData,
            customRoleId,
            documentFiles,
        }: {
            userFormData: FormData;
            customRoleId: string;
            documentFiles: File[];
        }) => {
            const newEmployee = await addEmployee(userFormData);

            if (newEmployee && newEmployee._id && customRoleId) {
                await assignRoleToUser(customRoleId, newEmployee._id);
            }

            if (newEmployee && newEmployee._id && documentFiles.length > 0) {
                await uploadEmployeeDocuments(newEmployee._id, documentFiles);
            }
            return newEmployee;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
            toast.success('Employee created successfully!');
            setIsCreateModalOpen(false);
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : 'Failed to create employee');
        },
    });

    const create = async (formData: FormData, roleId: string, docs: File[]) => {
        return addEmployeeMutation.mutateAsync({
            userFormData: formData,
            customRoleId: roleId,
            documentFiles: docs
        });
    };

    const exportPdf = async () => {
        setIsExporting('pdf');
        try {
            await EmployeeExportService.toPdf(filteredEmployees);
        } finally {
            setIsExporting(null);
        }
    };

    const exportExcel = async () => {
        setIsExporting('excel');
        try {
            await EmployeeExportService.toExcel(filteredEmployees, roles);
        } finally {
            setIsExporting(null);
        }
    };

    return {
        isExporting,
        isCreating: addEmployeeMutation.isPending,
        isCreateModalOpen,
        toggleCreateModal: setIsCreateModalOpen,
        create,
        exportPdf,
        exportExcel,
    };
};
