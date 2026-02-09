import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmployeeActions } from '@/pages/EmployeePage/hooks/useEmployeeActions';
import { type Employee } from '@/api/employeeService';
import { type Role } from '@/pages/AdminPanelPage/RolesPermissionsTab/types/admin.types';

// Mock React Query
const mockMutateAsync = vi.fn();
const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', () => ({
    useMutation: vi.fn((options) => ({
        mutateAsync: mockMutateAsync,
        isPending: false,
        ...options
    })),
    useQuery: vi.fn(() => ({
        data: null,
        isLoading: false,
        error: null
    })),
    useQueryClient: vi.fn(() => ({
        invalidateQueries: mockInvalidateQueries
    }))
}));

// Mock services
vi.mock('@/api/employeeService', () => ({
    addEmployee: vi.fn(),
    uploadEmployeeDocuments: vi.fn()
}));

vi.mock('@/api/roleService', () => ({
    assignRoleToUser: vi.fn()
}));

// Mock export service
vi.mock('@/pages/EmployeePage/components/EmployeeExportService', () => ({
    EmployeeExportService: {
        toPdf: vi.fn().mockResolvedValue(undefined),
        toExcel: vi.fn().mockResolvedValue(undefined)
    }
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

import { EmployeeExportService } from '@/pages/EmployeePage/components/EmployeeExportService';

const mockEmployees: Employee[] = [
    { _id: '1', name: 'John Doe', role: 'user' } as Employee,
    { _id: '2', name: 'Jane Smith', role: 'admin' } as Employee,
];

const mockRoles: Role[] = [
    { _id: 'role1', name: 'Sales Manager' } as Role,
    { _id: 'role2', name: 'Admin' } as Role,
];

describe('useEmployeeActions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with isCreateModalOpen as false', () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            totalEmployees: mockEmployees,
            roles: mockRoles
        }));

        expect(result.current.isCreateModalOpen).toBe(false);
    });

    it('should toggle create modal state', () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            totalEmployees: mockEmployees,
            roles: mockRoles
        }));

        expect(result.current.isCreateModalOpen).toBe(false);

        act(() => {
            result.current.toggleCreateModal(true);
        });

        expect(result.current.isCreateModalOpen).toBe(true);

        act(() => {
            result.current.toggleCreateModal(false);
        });

        expect(result.current.isCreateModalOpen).toBe(false);
    });

    it('should export to PDF without errors', async () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            totalEmployees: mockEmployees,
            roles: mockRoles
        }));

        await act(async () => {
            await result.current.exportPdf();
        });

        expect(EmployeeExportService.toPdf).toHaveBeenCalledWith(mockEmployees);
    });

    it('should export to Excel without errors', async () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            totalEmployees: mockEmployees,
            roles: mockRoles
        }));

        await act(async () => {
            await result.current.exportExcel();
        });

        expect(EmployeeExportService.toExcel).toHaveBeenCalledWith(mockEmployees, mockRoles);
    });

    it('should call mutateAsync with correct params when creating employee', async () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            totalEmployees: mockEmployees,
            roles: mockRoles
        }));

        const mockFormData = new FormData();
        const mockDocs: File[] = [];

        await act(async () => {
            await result.current.create(mockFormData, 'role1', mockDocs);
        });

        expect(mockMutateAsync).toHaveBeenCalledWith({
            userFormData: mockFormData,
            customRoleId: 'role1',
            documentFiles: mockDocs
        });
    });

    it('should have isCreating as false initially', () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            totalEmployees: mockEmployees,
            roles: mockRoles
        }));

        expect(result.current.isCreating).toBe(false);
    });
});
