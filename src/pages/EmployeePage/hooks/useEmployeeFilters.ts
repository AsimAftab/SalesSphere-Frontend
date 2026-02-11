import { useState, useMemo, useEffect } from 'react';
import { type Employee } from '@/api/employeeService';

const ITEMS_PER_PAGE = 12;

interface UseEmployeeFiltersOptions {
    employees: Employee[];
    resolveRoleName: (employee: Employee) => string;
}

/**
 * Hook for managing employee filtering and pagination.
 * Separates search/filter logic from data fetching.
 */
export const useEmployeeFilters = ({ employees, resolveRoleName }: UseEmployeeFiltersOptions) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter employees based on search term
    const filteredEmployees = useMemo(() => {
        if (!employees) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return employees.filter((employee) => {
            const roleName = resolveRoleName(employee) || '';
            const name = employee.name || '';
            return (
                name.toLowerCase().includes(lowerSearchTerm) ||
                roleName.toLowerCase().includes(lowerSearchTerm)
            );
        });
    }, [employees, searchTerm, resolveRoleName]);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Paginate filtered data
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

    return {
        searchTerm,
        setSearchTerm,
        filteredEmployees,
        paginatedData,
        pagination,
    };
};
