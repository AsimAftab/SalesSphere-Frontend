import { useEmployeePermissions, type EmployeePermissions } from './useEmployeePermissions';
import { useEmployeeData } from './useEmployeeData';
import { useEmployeeFilters } from './useEmployeeFilters';
import { useEmployeeActions } from './useEmployeeActions';

export type { EmployeePermissions };

/**
 * Facade hook that composes all employee-related hooks.
 * Provides a unified API for the EmployeePage component.
 *
 * Composed of:
 * - useEmployeePermissions: Permission checks
 * - useEmployeeData: Data fetching (employees, roles)
 * - useEmployeeFilters: Search, pagination, filtering
 * - useEmployeeActions: CRUD mutations, exports
 */
const useEmployeeManager = () => {
    // Permissions
    const permissions = useEmployeePermissions();

    // Data fetching
    const { employees, roles, isLoading, error, resolveRoleName } = useEmployeeData();

    // Filtering and pagination
    const {
        searchTerm,
        setSearchTerm,
        filteredEmployees,
        paginatedData,
        pagination,
    } = useEmployeeFilters({ employees, resolveRoleName });

    // Actions and mutations
    const {
        isCreating,
        isCreateModalOpen,
        toggleCreateModal,
        create,
        exportPdf,
        exportExcel,
    } = useEmployeeActions({ filteredEmployees, totalEmployees: employees, roles });

    return {
        state: {
            data: employees,
            filteredData: filteredEmployees,
            paginatedData,
            loading: isLoading,
            error,
            searchTerm,
            pagination,
            isCreating,
            isCreateModalOpen,
            permissions
        },
        actions: {
            setSearchTerm,
            create,
            toggleCreateModal,
            exportPdf,
            exportExcel
        },
        helpers: {
            resolveRoleName
        }
    };
};

export default useEmployeeManager;
