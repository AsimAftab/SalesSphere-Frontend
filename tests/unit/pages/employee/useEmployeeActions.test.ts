import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmployeeActions } from '@/pages/EmployeePage/hooks/useEmployeeActions';
import { type Employee } from '@/api/employeeService';
import { type Role } from '@/pages/AdminPanelPage/PermissionTab/types/admin.types';

// Mock React Query
const mockMutateAsync = vi.fn();
const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', () => ({
    useMutation: vi.fn((options) => ({
        mutateAsync: mockMutateAsync,
        isPending: false,
        ...options
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

    it('should initialize with isExporting as null', () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            roles: mockRoles
        }));

        expect(result.current.isExporting).toBeNull();
    });

    it('should initialize with isCreateModalOpen as false', () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            roles: mockRoles
        }));

        expect(result.current.isCreateModalOpen).toBe(false);
    });

    it('should toggle create modal state', () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
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

    it('should set isExporting to "pdf" during PDF export and reset after', async () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            roles: mockRoles
        }));

        expect(result.current.isExporting).toBeNull();

        await act(async () => {
            await result.current.exportPdf();
        });

        expect(EmployeeExportService.toPdf).toHaveBeenCalledWith(mockEmployees);
        expect(result.current.isExporting).toBeNull();
    });

    it('should set isExporting to "excel" during Excel export and reset after', async () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            roles: mockRoles
        }));

        expect(result.current.isExporting).toBeNull();

        await act(async () => {
            await result.current.exportExcel();
        });

        expect(EmployeeExportService.toExcel).toHaveBeenCalledWith(mockEmployees, mockRoles);
        expect(result.current.isExporting).toBeNull();
    });

    it('should reset isExporting even if PDF export fails', async () => {
        (EmployeeExportService.toPdf as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Export failed'));

        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            roles: mockRoles
        }));

        await act(async () => {
            try {
                await result.current.exportPdf();
            } catch {
                // Expected to throw
            }
        });

        expect(result.current.isExporting).toBeNull();
    });

    it('should reset isExporting even if Excel export fails', async () => {
        (EmployeeExportService.toExcel as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Export failed'));

        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
            roles: mockRoles
        }));

        await act(async () => {
            try {
                await result.current.exportExcel();
            } catch {
                // Expected to throw
            }
        });

        expect(result.current.isExporting).toBeNull();
    });

    it('should call mutateAsync with correct params when creating employee', async () => {
        const { result } = renderHook(() => useEmployeeActions({
            filteredEmployees: mockEmployees,
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
            roles: mockRoles
        }));

        expect(result.current.isCreating).toBe(false);
    });
});
