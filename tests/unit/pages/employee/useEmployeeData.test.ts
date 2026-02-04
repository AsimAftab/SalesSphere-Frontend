import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEmployeeData, EMPLOYEE_QUERY_KEY } from '@/pages/EmployeePage/hooks/useEmployeeData';

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn()
}));

// Mock services
vi.mock('@/api/employeeService', () => ({
    getEmployees: vi.fn()
}));

vi.mock('@/api/roleService', () => ({
    roleService: {
        getAll: vi.fn()
    }
}));

import { useQuery } from '@tanstack/react-query';

const mockEmployees = [
    { _id: '1', name: 'John Doe', role: 'user', customRoleId: { _id: 'role1', name: 'Sales Manager' } },
    { _id: '2', name: 'Jane Smith', role: 'admin', customRoleId: 'role2' },
    { _id: '3', name: 'Bob Wilson', role: 'manager' },
    { _id: '4', name: 'Alice Brown', role: '' },
];

const mockRoles = [
    { _id: 'role1', name: 'Sales Manager' },
    { _id: 'role2', name: 'Admin' },
    { _id: 'role3', name: 'Field Agent' },
];

describe('useEmployeeData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should export EMPLOYEE_QUERY_KEY constant', () => {
        expect(EMPLOYEE_QUERY_KEY).toBe('employees');
    });

    it('should return empty arrays when loading', () => {
        (useQuery as ReturnType<typeof vi.fn>)
            .mockReturnValueOnce({ data: undefined, isLoading: true, error: null })
            .mockReturnValueOnce({ data: undefined, isLoading: true, error: null });

        const { result } = renderHook(() => useEmployeeData());

        expect(result.current.employees).toEqual([]);
        expect(result.current.roles).toEqual([]);
        expect(result.current.isLoading).toBe(true);
    });

    it('should return employees and roles when loaded', () => {
        (useQuery as ReturnType<typeof vi.fn>)
            .mockReturnValueOnce({ data: mockEmployees, isLoading: false, error: null })
            .mockReturnValueOnce({ data: mockRoles, isLoading: false, error: null });

        const { result } = renderHook(() => useEmployeeData());

        expect(result.current.employees).toEqual(mockEmployees);
        expect(result.current.roles).toEqual(mockRoles);
        expect(result.current.isLoading).toBe(false);
    });

    it('should return error when query fails', () => {
        const mockError = new Error('Failed to fetch');
        (useQuery as ReturnType<typeof vi.fn>)
            .mockReturnValueOnce({ data: undefined, isLoading: false, error: mockError })
            .mockReturnValueOnce({ data: undefined, isLoading: false, error: null });

        const { result } = renderHook(() => useEmployeeData());

        expect(result.current.error).toBe(mockError);
    });

    describe('resolveRoleName', () => {
        beforeEach(() => {
            (useQuery as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce({ data: mockEmployees, isLoading: false, error: null })
                .mockReturnValueOnce({ data: mockRoles, isLoading: false, error: null });
        });

        it('should return custom role name when customRoleId is object with name', () => {
            const { result } = renderHook(() => useEmployeeData());
            const roleName = result.current.resolveRoleName(mockEmployees[0]);

            expect(roleName).toBe('Sales Manager');
        });

        it('should lookup role name when customRoleId is string', () => {
            const { result } = renderHook(() => useEmployeeData());
            const roleName = result.current.resolveRoleName(mockEmployees[1]);

            expect(roleName).toBe('Admin');
        });

        it('should fallback to employee role when no custom role found', () => {
            const { result } = renderHook(() => useEmployeeData());
            const roleName = result.current.resolveRoleName(mockEmployees[2]);

            expect(roleName).toBe('manager');
        });

        it('should return "user" when no role info available', () => {
            const { result } = renderHook(() => useEmployeeData());
            const roleName = result.current.resolveRoleName(mockEmployees[3]);

            expect(roleName).toBe('user');
        });

        it('should return "user" when customRoleId string not found in roles', () => {
            const { result } = renderHook(() => useEmployeeData());
            const employee = { _id: '5', name: 'Test', role: '', customRoleId: 'nonexistent' };
            const roleName = result.current.resolveRoleName(employee as typeof mockEmployees[0]);

            expect(roleName).toBe('user');
        });
    });
});
