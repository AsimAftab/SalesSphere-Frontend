import { useQuery } from '@tanstack/react-query';
import { getEmployees, type Employee } from '@/api/employeeService';
import { roleService } from '@/api/roleService';
import { type Role } from '@/pages/AdminPanelPage/PermissionTab/types/admin.types';

export const EMPLOYEE_QUERY_KEY = 'employees';

/**
 * Hook for fetching employee and role data.
 * Separates data fetching from filtering and mutations.
 */
export const useEmployeeData = () => {
    const employeesQuery = useQuery<Employee[], Error>({
        queryKey: [EMPLOYEE_QUERY_KEY],
        queryFn: getEmployees,
    });

    const rolesQuery = useQuery({
        queryKey: ['roles'],
        queryFn: roleService.getAll
    });

    const getEmployeeRoleName = (employee: Employee): string => {
        const roles = rolesQuery.data || [];
        if (typeof employee.customRoleId === 'object' && employee.customRoleId?.name) {
            return employee.customRoleId.name;
        }
        if (typeof employee.customRoleId === 'string') {
            const foundRole = roles.find((r: Role) => r._id === employee.customRoleId);
            if (foundRole) return foundRole.name;
        }
        return employee.role || 'user';
    };

    return {
        employees: employeesQuery.data || [],
        roles: rolesQuery.data || [],
        isLoading: employeesQuery.isLoading,
        error: employeesQuery.error,
        resolveRoleName: getEmployeeRoleName,
    };
};
