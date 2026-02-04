import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmployeeFilters } from '@/pages/EmployeePage/hooks/useEmployeeFilters';
import { type Employee } from '@/api/employeeService';

const mockEmployees: Employee[] = [
    { _id: '1', name: 'John Doe', role: 'user' } as Employee,
    { _id: '2', name: 'Jane Smith', role: 'admin' } as Employee,
    { _id: '3', name: 'Bob Wilson', role: 'user' } as Employee,
    { _id: '4', name: 'Alice Brown', role: 'manager' } as Employee,
    { _id: '5', name: 'Charlie Davis', role: 'user' } as Employee,
];

const mockResolveRoleName = vi.fn((emp: Employee) => emp.role || 'user');

describe('useEmployeeFilters', () => {
    it('should initialize with empty search term', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: mockEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        expect(result.current.searchTerm).toBe('');
    });

    it('should initialize with page 1', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: mockEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        expect(result.current.pagination.currentPage).toBe(1);
    });

    it('should filter employees by name', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: mockEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        act(() => {
            result.current.setSearchTerm('John');
        });

        expect(result.current.filteredEmployees).toHaveLength(1);
        expect(result.current.filteredEmployees[0].name).toBe('John Doe');
    });

    it('should filter employees by role', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: mockEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        act(() => {
            result.current.setSearchTerm('admin');
        });

        expect(result.current.filteredEmployees).toHaveLength(1);
        expect(result.current.filteredEmployees[0].name).toBe('Jane Smith');
    });

    it('should be case insensitive', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: mockEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        act(() => {
            result.current.setSearchTerm('JANE');
        });

        expect(result.current.filteredEmployees).toHaveLength(1);
    });

    it('should reset to page 1 when search term changes', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: mockEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        // Change page first
        act(() => {
            result.current.pagination.onPageChange(2);
        });

        expect(result.current.pagination.currentPage).toBe(2);

        // Search should reset to page 1
        act(() => {
            result.current.setSearchTerm('test');
        });

        expect(result.current.pagination.currentPage).toBe(1);
    });

    it('should return all employees when search term is empty', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: mockEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        expect(result.current.filteredEmployees).toHaveLength(5);
    });

    it('should paginate results correctly', () => {
        // Create 15 employees to test pagination (12 per page)
        const manyEmployees = Array.from({ length: 15 }, (_, i) => ({
            _id: `${i + 1}`,
            name: `Employee ${i + 1}`,
            role: 'user'
        })) as Employee[];

        const { result } = renderHook(() => useEmployeeFilters({
            employees: manyEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        expect(result.current.paginatedData).toHaveLength(12);
        expect(result.current.pagination.totalItems).toBe(15);

        act(() => {
            result.current.pagination.onPageChange(2);
        });

        expect(result.current.paginatedData).toHaveLength(3);
    });

    it('should return empty array when no matches found', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: mockEmployees,
            resolveRoleName: mockResolveRoleName
        }));

        act(() => {
            result.current.setSearchTerm('nonexistent');
        });

        expect(result.current.filteredEmployees).toHaveLength(0);
    });

    it('should handle empty employees array', () => {
        const { result } = renderHook(() => useEmployeeFilters({
            employees: [],
            resolveRoleName: mockResolveRoleName
        }));

        expect(result.current.filteredEmployees).toHaveLength(0);
        expect(result.current.paginatedData).toHaveLength(0);
    });
});
