import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, updateEmployee, type UpdateEmployeeData, type Employee } from '@/api/employeeService';
import toast from 'react-hot-toast';

export const useSupervisorHierarchy = () => {
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const queryClient = useQueryClient();

    // Fetch employees
    const { data: employees, isLoading, refetch } = useQuery({
        queryKey: ['employees'],
        queryFn: getEmployees
    });

    // Delete hierarchy mutation
    const deleteHierarchyMutation = useMutation({
        mutationFn: async (employeeId: string) => {
            return updateEmployee(employeeId, { reportsTo: [] } as UpdateEmployeeData);
        },
        onSuccess: () => {
            toast.success('Hierarchy removed successfully');
            setEmployeeToDelete(null);
            refetch();
            queryClient.invalidateQueries({ queryKey: ['org-hierarchy'] });
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(err?.response?.data?.message || 'Failed to remove hierarchy');
            setEmployeeToDelete(null);
        }
    });

    const confirmDeleteHierarchy = () => {
        if (employeeToDelete) {
            deleteHierarchyMutation.mutate(employeeToDelete._id);
        }
    };

    // Helper to format role name
    const getRoleName = (emp: Employee) => {
        if (emp.customRoleId && typeof emp.customRoleId === 'object' && emp.customRoleId.name) {
            return emp.customRoleId.name;
        }
        const role = emp.role;
        if (!role) return 'N/A';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    // Sort employees: admins first, then others
    const sortedEmployees = employees ? [...employees].sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return 0;
    }) : [];

    return {
        employees: sortedEmployees,
        isLoading,
        refetch,
        deleteHierarchyMutation,
        employeeToDelete,
        setEmployeeToDelete,
        confirmDeleteHierarchy,
        getRoleName
    };
};
