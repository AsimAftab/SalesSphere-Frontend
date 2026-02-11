import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock dependencies
vi.mock('@/api/authService', () => ({
    useAuth: vi.fn(() => ({
        user: { _id: 'user1', role: 'admin' }
    }))
}));

vi.mock('@/hooks/useTableSelection', () => ({
    useTableSelection: vi.fn(() => ({
        selectedIds: new Set<string>(),
        toggleRow: vi.fn(),
        selectAll: vi.fn(),
        clearSelection: vi.fn(),
        selectMultiple: vi.fn()
    }))
}));

vi.mock('@/pages/LeavePage/hooks/useLeaveData', () => ({
    useLeaveData: vi.fn(() => ({
        leaves: mockLeaves,
        isLoading: false
    }))
}));

vi.mock('@/pages/LeavePage/hooks/useLeavePermissions', () => ({
    useLeavePermissions: vi.fn(() => ({
        canCreate: true,
        canUpdate: true,
        canDelete: true,
        canBulkDelete: true,
        canExportPdf: true,
        canExportExcel: true
    }))
}));

vi.mock('@/pages/LeavePage/hooks/useLeaveActions', () => ({
    useLeaveActions: vi.fn(() => ({
        updateStatus: vi.fn(),
        bulkDelete: vi.fn(),
        isUpdating: false,
        isDeleting: false
    }))
}));

vi.mock('@/pages/LeavePage/hooks/useLeaveFilters', () => ({
    useLeaveFilters: vi.fn(() => ({
        searchQuery: '',
        setSearchQuery: vi.fn(),
        isFilterVisible: false,
        setIsFilterVisible: vi.fn(),
        filters: { status: [], employee: [], category: [] },
        setFilters: vi.fn(),
        filteredData: mockLeaves,
        filterOptions: {
            employees: ['John Doe', 'Jane Smith'],
            categories: ['Sick Leave', 'Vacation'],
            statuses: ['pending', 'approved', 'rejected']
        }
    }))
}));

import { useLeaveManager } from '@/pages/LeavePage/hooks/useLeaveManager';
import { useTableSelection } from '@/hooks/useTableSelection';
import { useLeaveData } from '@/pages/LeavePage/hooks/useLeaveData';
import { useLeaveFilters } from '@/pages/LeavePage/hooks/useLeaveFilters';
import { useLeaveActions } from '@/pages/LeavePage/hooks/useLeaveActions';

const mockLeaves = [
    { _id: 'leave1', employeeName: 'John Doe', category: 'Sick Leave', status: 'pending', startDate: '2024-01-15', endDate: '2024-01-16' },
    { _id: 'leave2', employeeName: 'Jane Smith', category: 'Vacation', status: 'approved', startDate: '2024-02-01', endDate: '2024-02-05' },
    { _id: 'leave3', employeeName: 'John Doe', category: 'Vacation', status: 'rejected', startDate: '2024-03-10', endDate: '2024-03-12' }
];

describe('useLeaveManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Table State', () => {
        it('should return paginated data', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.tableState.paginatedData).toBeDefined();
            expect(Array.isArray(result.current.tableState.paginatedData)).toBe(true);
        });

        it('should return full filtered data', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.tableState.data).toEqual(mockLeaves);
        });

        it('should return loading state', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.tableState.isLoading).toBe(false);
        });

        it('should return pagination config', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.tableState.pagination).toHaveProperty('currentPage');
            expect(result.current.tableState.pagination).toHaveProperty('onPageChange');
            expect(result.current.tableState.pagination).toHaveProperty('itemsPerPage');
            expect(result.current.tableState.pagination).toHaveProperty('totalItems');
        });

        it('should initialize with page 1', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.tableState.pagination.currentPage).toBe(1);
        });

        it('should have 10 items per page', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.tableState.pagination.itemsPerPage).toBe(10);
        });
    });

    describe('Pagination', () => {
        it('should change page when onPageChange is called', () => {
            const { result } = renderHook(() => useLeaveManager());

            act(() => {
                result.current.tableState.pagination.onPageChange(2);
            });

            expect(result.current.tableState.pagination.currentPage).toBe(2);
        });

        it('should slice data correctly for pagination', () => {
            const { result } = renderHook(() => useLeaveManager());

            // With 3 items and 10 per page, all should be on page 1
            expect(result.current.tableState.paginatedData.length).toBeLessThanOrEqual(10);
        });
    });

    describe('Filter State', () => {
        it('should return search query', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.filterState.searchQuery).toBeDefined();
        });

        it('should return filter visibility state', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.filterState.isVisible).toBe(false);
        });

        it('should return filter values', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.filterState.values).toHaveProperty('status');
            expect(result.current.filterState.values).toHaveProperty('employee');
            expect(result.current.filterState.values).toHaveProperty('category');
        });

        it('should return filter options', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.filterState.options).toHaveProperty('employees');
            expect(result.current.filterState.options).toHaveProperty('categories');
            expect(result.current.filterState.options).toHaveProperty('statuses');
        });
    });

    describe('Selection', () => {
        it('should return selection state', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.tableState.selection).toHaveProperty('selectedIds');
            expect(result.current.tableState.selection).toHaveProperty('toggleRow');
            expect(result.current.tableState.selection).toHaveProperty('selectAll');
            expect(result.current.tableState.selection).toHaveProperty('clearSelection');
        });

        it('should use useTableSelection hook', () => {
            renderHook(() => useLeaveManager());

            expect(useTableSelection).toHaveBeenCalled();
        });
    });

    describe('Actions', () => {
        it('should expose updateStatus action', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.actions.updateStatus).toBeDefined();
            expect(typeof result.current.actions.updateStatus).toBe('function');
        });

        it('should expose bulkDelete action', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.actions.bulkDelete).toBeDefined();
            expect(typeof result.current.actions.bulkDelete).toBe('function');
        });

        it('should expose isUpdating state', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.actions.isUpdating).toBe(false);
        });

        it('should expose isDeleting state', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.actions.isDeleting).toBe(false);
        });

        it('should clear selection after bulk delete', () => {
            const mockClearSelection = vi.fn();
            const mockBulkDelete = vi.fn();

            (useTableSelection as ReturnType<typeof vi.fn>).mockReturnValue({
                selectedIds: new Set(['leave1']),
                toggleRow: vi.fn(),
                selectAll: vi.fn(),
                clearSelection: mockClearSelection,
                selectMultiple: vi.fn()
            });

            (useLeaveActions as ReturnType<typeof vi.fn>).mockReturnValue({
                updateStatus: vi.fn(),
                bulkDelete: mockBulkDelete,
                isUpdating: false,
                isDeleting: false
            });

            const { result } = renderHook(() => useLeaveManager());

            act(() => {
                result.current.actions.bulkDelete(['leave1']);
            });

            expect(mockBulkDelete).toHaveBeenCalledWith(['leave1']);
            expect(mockClearSelection).toHaveBeenCalled();
        });
    });

    describe('Permissions', () => {
        it('should return permissions object', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.permissions).toHaveProperty('canCreate');
            expect(result.current.permissions).toHaveProperty('canUpdate');
            expect(result.current.permissions).toHaveProperty('canDelete');
            expect(result.current.permissions).toHaveProperty('canBulkDelete');
            expect(result.current.permissions).toHaveProperty('canExportPdf');
            expect(result.current.permissions).toHaveProperty('canExportExcel');
        });
    });

    describe('User Context', () => {
        it('should return current user ID', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.currentUserId).toBe('user1');
        });

        it('should return user role', () => {
            const { result } = renderHook(() => useLeaveManager());

            expect(result.current.userRole).toBe('admin');
        });
    });

    describe('Hook Composition', () => {
        it('should call useLeaveData hook', () => {
            renderHook(() => useLeaveManager());

            expect(useLeaveData).toHaveBeenCalled();
        });

        it('should call useLeaveFilters hook with leaves data', () => {
            renderHook(() => useLeaveManager());

            expect(useLeaveFilters).toHaveBeenCalledWith(mockLeaves);
        });
    });
});
