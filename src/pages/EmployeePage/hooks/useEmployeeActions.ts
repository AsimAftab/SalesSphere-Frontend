import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { addEmployee, uploadEmployeeDocuments, type Employee } from '@/api/employeeService';
import { assignRoleToUser } from '@/api/roleService';
import { type Role } from '@/pages/AdminPanelPage/RolesPermissionsTab/types/admin.types';
import { EmployeeExportService } from '../components/EmployeeExportService';
import { EMPLOYEE_QUERY_KEY } from './useEmployeeData';
import { fetchMyOrganization } from '@/api/SuperAdmin';
import toast from 'react-hot-toast';

interface UseEmployeeActionsOptions {
    filteredEmployees: Employee[];
    totalEmployees: Employee[];
    roles: Role[];
}

/**
 * Hook for managing employee CRUD operations and exports.
 * Separates mutation logic from data fetching and filtering.
 */
export const useEmployeeActions = ({ filteredEmployees, totalEmployees, roles }: UseEmployeeActionsOptions) => {
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Fetch organization data to get effective employee limit (includes override)
    const { data: orgResponse } = useQuery({
        queryKey: ['my-organization'],
        queryFn: fetchMyOrganization,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

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
        await EmployeeExportService.toPdf(filteredEmployees);
    };

    const exportExcel = async () => {
        await EmployeeExportService.toExcel(filteredEmployees, roles);
    };

    // Enhanced toggleCreateModal with employee limit check
    const toggleCreateModal = (value: boolean) => {
        if (value) {
            // Check employee limit before opening modal
            // Use totalEmployees to count ALL users including admins, not just filtered results
            const currentEmployeeCount = totalEmployees.length;
            // Use effective limit which includes custom override if set by superadmin
            const maxEmployees = orgResponse?.data?.maxEmployees?.effective ??
                orgResponse?.data?.maxEmployeesOverride ??
                null;

            if (maxEmployees !== null && currentEmployeeCount >= maxEmployees) {
                toast.error(`You have reached the maximum employee limit (${maxEmployees}) allowed by your plan. Please upgrade your plan to add more employees.`);
                return;
            }
        }
        setIsCreateModalOpen(value);
    };

    return {
        isCreating: addEmployeeMutation.isPending,
        isCreateModalOpen,
        toggleCreateModal,
        create,
        exportPdf,
        exportExcel,
    };
};
