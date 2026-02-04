import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEmployeePermissions } from '@/pages/EmployeePage/hooks/useEmployeePermissions';

// Mock the auth service
vi.mock('@/api/authService', () => ({
    useAuth: vi.fn()
}));

import { useAuth } from '@/api/authService';

describe('useEmployeePermissions', () => {
    const mockHasPermission = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
            hasPermission: mockHasPermission
        });
    });

    it('should return canCreate true when user has create permission', () => {
        mockHasPermission.mockImplementation((resource, action) => {
            if (resource === 'employees' && action === 'create') return true;
            return false;
        });

        const { result } = renderHook(() => useEmployeePermissions());

        expect(result.current.canCreate).toBe(true);
        expect(result.current.canExport).toBe(false);
    });

    it('should return canExport true when user has exportPdf permission', () => {
        mockHasPermission.mockImplementation((resource, action) => {
            if (resource === 'employees' && action === 'exportPdf') return true;
            return false;
        });

        const { result } = renderHook(() => useEmployeePermissions());

        expect(result.current.canCreate).toBe(false);
        expect(result.current.canExport).toBe(true);
    });

    it('should return canExport true when user has exportExcel permission', () => {
        mockHasPermission.mockImplementation((resource, action) => {
            if (resource === 'employees' && action === 'exportExcel') return true;
            return false;
        });

        const { result } = renderHook(() => useEmployeePermissions());

        expect(result.current.canExport).toBe(true);
    });

    it('should return all permissions true when user has all permissions', () => {
        mockHasPermission.mockReturnValue(true);

        const { result } = renderHook(() => useEmployeePermissions());

        expect(result.current.canCreate).toBe(true);
        expect(result.current.canExport).toBe(true);
    });

    it('should return all permissions false when user has no permissions', () => {
        mockHasPermission.mockReturnValue(false);

        const { result } = renderHook(() => useEmployeePermissions());

        expect(result.current.canCreate).toBe(false);
        expect(result.current.canExport).toBe(false);
    });
});
