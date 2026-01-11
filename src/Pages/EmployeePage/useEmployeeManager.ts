import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../api/authService';
import {
    getEmployees,
    addEmployee,
    uploadEmployeeDocuments,
    type Employee
} from '../../api/employeeService';
import { roleService, assignRoleToUser } from '../../api/roleService';
import { type Role } from '../AdminPanelPage/PermissionTab/types/admin.types';
import { ExportEmployeeService } from './components/ExportEmployeeService';
import toast from 'react-hot-toast';

export interface EmployeePermissions {
    canCreate: boolean;
    canExport: boolean;
}

const EMPLOYEE_QUERY_KEY = 'employees';

const useEmployeeManager = () => {
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();

    // --- Permissions ---
    const permissions: EmployeePermissions = useMemo(() => ({
        canCreate: hasPermission("employee", "create"),
        canExport: hasPermission("employee", "export"),
    }), [hasPermission]);

    // --- State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const ITEMS_PER_PAGE = 12;

    // --- Queries ---
    const {
        data: employees = [],
        isLoading: isEmployeesLoading,
        error
    } = useQuery<Employee[], Error>({
        queryKey: [EMPLOYEE_QUERY_KEY],
        queryFn: getEmployees,
    });

    const { data: rolesResponse } = useQuery({
        queryKey: ['roles'],
        queryFn: roleService.getAll
    });
    const roles: Role[] = rolesResponse?.data?.data || [];

    // --- Helpers ---
    const getEmployeeRoleName = (employee: Employee): string => {
        if (typeof employee.customRoleId === 'object' && employee.customRoleId?.name) {
            return employee.customRoleId.name;
        }
        if (typeof employee.customRoleId === 'string') {
            const foundRole = roles.find((r: Role) => r._id === employee.customRoleId);
            if (foundRole) return foundRole.name;
        }
        return employee.role || 'user';
    };

    // --- Filtering ---
    const filteredEmployees = useMemo(() => {
        if (!employees) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return employees.filter(
            (employee) => {
                const roleName = getEmployeeRoleName(employee) || '';
                const name = employee.name || '';
                return (
                    name.toLowerCase().includes(lowerSearchTerm) ||
                    roleName.toLowerCase().includes(lowerSearchTerm)
                );
            }
        );
    }, [employees, searchTerm, roles]);

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // --- Pagination Logic ---
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredEmployees, currentPage]);

    const pagination = {
        currentPage,
        onPageChange: setCurrentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        totalItems: filteredEmployees.length
    };

    // --- Mutations ---
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

    // --- Actions ---
    const actions = {
        setSearchTerm,
        create: async (formData: FormData, roleId: string, docs: File[]) => {
            return addEmployeeMutation.mutateAsync({ userFormData: formData, customRoleId: roleId, documentFiles: docs });
        },
        toggleCreateModal: setIsCreateModalOpen,
        exportPdf: async () => {
            setIsExporting('pdf');
            try {
                await ExportEmployeeService.exportToPdf(filteredEmployees);
            } finally {
                setIsExporting(null);
            }
        },
        exportExcel: async () => {
            setIsExporting('excel');
            try {
                await ExportEmployeeService.exportToExcel(filteredEmployees, roles);
            } finally {
                setIsExporting(null);
            }
        }
    };

    // --- Helper for view ---
    // We expose a resolver for role names so View doesn't need raw roles
    const resolveRoleName = (emp: Employee) => getEmployeeRoleName(emp);

    return {
        state: {
            data: employees,
            filteredData: filteredEmployees,
            paginatedData,
            loading: isEmployeesLoading,
            error,
            searchTerm,
            pagination,
            isExporting,
            isCreating: addEmployeeMutation.isPending,
            isCreateModalOpen,
            permissions
        },
        actions,
        helpers: {
            resolveRoleName
        }
    };
};

export default useEmployeeManager;
