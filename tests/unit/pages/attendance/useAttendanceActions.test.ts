import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock dependencies
const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', () => ({
    useMutation: vi.fn((options) => ({
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        ...options
    })),
    useQueryClient: vi.fn(() => ({
        invalidateQueries: mockInvalidateQueries
    }))
}));

vi.mock('react-hot-toast', () => ({
    toast: { success: vi.fn(), error: vi.fn() }
}));

vi.mock('@/api/attendanceService', () => ({
    updateSingleAttendance: vi.fn(),
    updateBulkAttendance: vi.fn()
}));

import { useMutation } from '@tanstack/react-query';
import { useAttendanceActions } from '@/pages/AttendancePage/hooks/useAttendanceActions';

describe('useAttendanceActions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should return singleUpdateMutation', () => {
            const { result } = renderHook(() => useAttendanceActions('January', 2024));

            expect(result.current.singleUpdateMutation).toBeDefined();
        });

        it('should return bulkUpdateMutation', () => {
            const { result } = renderHook(() => useAttendanceActions('January', 2024));

            expect(result.current.bulkUpdateMutation).toBeDefined();
        });

        it('should return isUpdating state', () => {
            const { result } = renderHook(() => useAttendanceActions('January', 2024));

            expect(result.current.isUpdating).toBe(false);
        });
    });

    describe('Single Update Mutation', () => {
        it('should create mutation for single update', () => {
            renderHook(() => useAttendanceActions('January', 2024));

            expect(useMutation).toHaveBeenCalled();
        });

        it('should use updateSingleAttendance as mutation function', () => {
            renderHook(() => useAttendanceActions('January', 2024));

            const mutationCalls = (useMutation as ReturnType<typeof vi.fn>).mock.calls;
            expect(mutationCalls.length).toBeGreaterThan(0);

            // First call should be for single update
            expect(mutationCalls[0][0]).toHaveProperty('mutationFn');
        });
    });

    describe('Bulk Update Mutation', () => {
        it('should create mutation for bulk update', () => {
            renderHook(() => useAttendanceActions('January', 2024));

            // useMutation should be called twice (single and bulk)
            expect(useMutation).toHaveBeenCalledTimes(2);
        });
    });

    describe('isUpdating State', () => {
        it('should be true when single update is pending', () => {
            (useMutation as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce({ isPending: true }) // single
                .mockReturnValueOnce({ isPending: false }); // bulk

            const { result } = renderHook(() => useAttendanceActions('January', 2024));

            expect(result.current.isUpdating).toBe(true);
        });

        it('should be true when bulk update is pending', () => {
            (useMutation as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce({ isPending: false }) // single
                .mockReturnValueOnce({ isPending: true }); // bulk

            const { result } = renderHook(() => useAttendanceActions('January', 2024));

            expect(result.current.isUpdating).toBe(true);
        });

        it('should be true when both updates are pending', () => {
            (useMutation as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce({ isPending: true }) // single
                .mockReturnValueOnce({ isPending: true }); // bulk

            const { result } = renderHook(() => useAttendanceActions('January', 2024));

            expect(result.current.isUpdating).toBe(true);
        });

        it('should be false when neither update is pending', () => {
            (useMutation as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce({ isPending: false }) // single
                .mockReturnValueOnce({ isPending: false }); // bulk

            const { result } = renderHook(() => useAttendanceActions('January', 2024));

            expect(result.current.isUpdating).toBe(false);
        });
    });

    describe('Query Invalidation', () => {
        it('should invalidate attendance query on single update success', () => {
            let onSuccessCallback: ((data: unknown, variables: { employeeId: string }) => void) | undefined;

            (useMutation as ReturnType<typeof vi.fn>).mockImplementation((options) => {
                if (!onSuccessCallback) {
                    onSuccessCallback = options.onSuccess;
                }
                return { isPending: false };
            });

            renderHook(() => useAttendanceActions('January', 2024));

            // Simulate success callback
            if (onSuccessCallback) {
                onSuccessCallback({}, { employeeId: 'emp1' });
            }

            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ['attendance', 'January', 2024]
            });
        });

        it('should invalidate attendanceDetail query on single update success', () => {
            let onSuccessCallback: ((data: unknown, variables: { employeeId: string }) => void) | undefined;

            (useMutation as ReturnType<typeof vi.fn>).mockImplementation((options) => {
                if (!onSuccessCallback) {
                    onSuccessCallback = options.onSuccess;
                }
                return { isPending: false };
            });

            renderHook(() => useAttendanceActions('January', 2024));

            if (onSuccessCallback) {
                onSuccessCallback({}, { employeeId: 'emp1' });
            }

            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ['attendanceDetail', 'emp1']
            });
        });

        it('should invalidate attendanceSummary query on single update success', () => {
            let onSuccessCallback: ((data: unknown, variables: { employeeId: string }) => void) | undefined;

            (useMutation as ReturnType<typeof vi.fn>).mockImplementation((options) => {
                if (!onSuccessCallback) {
                    onSuccessCallback = options.onSuccess;
                }
                return { isPending: false };
            });

            renderHook(() => useAttendanceActions('January', 2024));

            if (onSuccessCallback) {
                onSuccessCallback({}, { employeeId: 'emp1' });
            }

            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ['attendanceSummary', 'emp1']
            });
        });
    });

    describe('Month and Year Parameters', () => {
        it('should use month parameter for invalidation', () => {
            let onSuccessCallback: ((data: unknown, variables: { employeeId: string }) => void) | undefined;

            (useMutation as ReturnType<typeof vi.fn>).mockImplementation((options) => {
                if (!onSuccessCallback) {
                    onSuccessCallback = options.onSuccess;
                }
                return { isPending: false };
            });

            renderHook(() => useAttendanceActions('February', 2024));

            if (onSuccessCallback) {
                onSuccessCallback({}, { employeeId: 'emp1' });
            }

            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ['attendance', 'February', 2024]
            });
        });

        it('should use year parameter for invalidation', () => {
            let onSuccessCallback: ((data: unknown, variables: { employeeId: string }) => void) | undefined;

            (useMutation as ReturnType<typeof vi.fn>).mockImplementation((options) => {
                if (!onSuccessCallback) {
                    onSuccessCallback = options.onSuccess;
                }
                return { isPending: false };
            });

            renderHook(() => useAttendanceActions('January', 2025));

            if (onSuccessCallback) {
                onSuccessCallback({}, { employeeId: 'emp1' });
            }

            expect(mockInvalidateQueries).toHaveBeenCalledWith({
                queryKey: ['attendance', 'January', 2025]
            });
        });
    });
});
