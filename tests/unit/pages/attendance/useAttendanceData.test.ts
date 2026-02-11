import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn()
}));

// Mock attendance service
vi.mock('@/api/attendanceService', () => ({
    fetchAttendanceData: vi.fn()
}));

import { useQuery } from '@tanstack/react-query';
import { useAttendanceData } from '@/pages/AttendancePage/hooks/useAttendanceData';

const mockAttendanceData = {
    employees: [
        { id: 'emp1', name: 'John Doe', attendance: { '2024-01-15': 'present' } },
        { id: 'emp2', name: 'Jane Smith', attendance: { '2024-01-15': 'absent' } }
    ],
    summary: {
        totalPresent: 1,
        totalAbsent: 1
    }
};

describe('useAttendanceData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Query Configuration', () => {
        it('should call useQuery with correct query key', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            renderHook(() => useAttendanceData('January', 2024));

            expect(useQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryKey: ['attendance', 'January', 2024]
                })
            );
        });

        it('should include month in query key', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            renderHook(() => useAttendanceData('February', 2024));

            expect(useQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryKey: ['attendance', 'February', 2024]
                })
            );
        });

        it('should include year in query key', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            renderHook(() => useAttendanceData('January', 2025));

            expect(useQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryKey: ['attendance', 'January', 2025]
                })
            );
        });

        it('should have staleTime of 5 minutes', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            renderHook(() => useAttendanceData('January', 2024));

            expect(useQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    staleTime: 1000 * 60 * 5
                })
            );
        });

        it('should use placeholderData for previous data', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            renderHook(() => useAttendanceData('January', 2024));

            expect(useQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    placeholderData: expect.any(Function)
                })
            );
        });
    });

    describe('Return Value', () => {
        it('should return data from query', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            const { result } = renderHook(() => useAttendanceData('January', 2024));

            expect(result.current.data).toEqual(mockAttendanceData);
        });

        it('should return isLoading state', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null
            });

            const { result } = renderHook(() => useAttendanceData('January', 2024));

            expect(result.current.isLoading).toBe(true);
        });

        it('should return error state', () => {
            const mockError = new Error('Failed to fetch attendance');
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: undefined,
                isLoading: false,
                error: mockError
            });

            const { result } = renderHook(() => useAttendanceData('January', 2024));

            expect(result.current.error).toBe(mockError);
        });

        it('should return undefined data when loading', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null
            });

            const { result } = renderHook(() => useAttendanceData('January', 2024));

            expect(result.current.data).toBeUndefined();
        });
    });

    describe('Month Changes', () => {
        it('should refetch when month changes', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            const { rerender } = renderHook(
                ({ month, year }) => useAttendanceData(month, year),
                { initialProps: { month: 'January', year: 2024 } }
            );

            rerender({ month: 'February', year: 2024 });

            // Check that useQuery was called with new month
            expect(useQuery).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    queryKey: ['attendance', 'February', 2024]
                })
            );
        });

        it('should refetch when year changes', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            const { rerender } = renderHook(
                ({ month, year }) => useAttendanceData(month, year),
                { initialProps: { month: 'January', year: 2024 } }
            );

            rerender({ month: 'January', year: 2025 });

            expect(useQuery).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    queryKey: ['attendance', 'January', 2025]
                })
            );
        });
    });

    describe('Query Function', () => {
        it('should pass fetchAttendanceData as queryFn', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: mockAttendanceData,
                isLoading: false,
                error: null
            });

            renderHook(() => useAttendanceData('January', 2024));

            expect(useQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryFn: expect.any(Function)
                })
            );
        });
    });
});
