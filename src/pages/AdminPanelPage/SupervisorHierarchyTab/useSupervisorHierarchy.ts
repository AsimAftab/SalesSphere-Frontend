import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, updateEmployee, type UpdateEmployeeData, type Employee } from '@/api/employeeService';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

export const useSupervisorHierarchy = () => {
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
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
            deleteHierarchyMutation.mutate(employeeToDelete.id || employeeToDelete._id || '');
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
    const sortedEmployees = useMemo(() =>
        employees ? [...employees].sort((a, b) => {
            if (a.role === 'admin' && b.role !== 'admin') return -1;
            if (a.role !== 'admin' && b.role === 'admin') return 1;
            return 0;
        }) : [],
        [employees]
    );

    // Pagination
    const totalEmployees = sortedEmployees.length;
    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedEmployees, currentPage]);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return {
        employees: paginatedEmployees,
        totalEmployees,
        currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        startIndex,
        setCurrentPage,
        isLoading,
        refetch,
        deleteHierarchyMutation,
        employeeToDelete,
        setEmployeeToDelete,
        confirmDeleteHierarchy,
        getRoleName
    };
};
