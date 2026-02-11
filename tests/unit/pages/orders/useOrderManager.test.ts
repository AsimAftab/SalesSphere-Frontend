/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(),
    useMutation: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: false
    })),
    useQueryClient: vi.fn(() => ({
        invalidateQueries: vi.fn()
    }))
}));

vi.mock('react-router-dom', () => ({
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()])
}));

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() }
}));

vi.mock('@/api/orderService', () => ({
    getOrders: vi.fn(),
    updateOrderStatus: vi.fn()
}));

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

// Import after mocks
import useOrderManager from '@/pages/OrderListPage/Orders/hooks/useOrderManager';

const mockOrders = [
    {
        _id: '1',
        invoiceNumber: 'INV-001',
        partyName: 'ABC Corp',
        dateTime: '2024-01-15T10:00:00Z',
        status: 'pending',
        createdBy: { name: 'John Doe' }
    },
    {
        _id: '2',
        invoiceNumber: 'INV-002',
        partyName: 'XYZ Ltd',
        dateTime: '2024-02-20T10:00:00Z',
        status: 'completed',
        createdBy: { name: 'Jane Smith' }
    },
    {
        _id: '3',
        invoiceNumber: 'INV-003',
        partyName: 'ABC Corp',
        dateTime: '2024-01-10T10:00:00Z',
        status: 'in progress',
        createdBy: { name: 'John Doe' }
    }
];

describe('useOrderManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
            data: mockOrders,
            isLoading: false,
            error: null
        });
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
            new URLSearchParams(),
            vi.fn()
        ]);
    });

    describe('Initial State', () => {
        it('should initialize with default state values', () => {
            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.currentPage).toBe(1);
            expect(result.current.state.searchTerm).toBe('');
            expect(result.current.state.isFilterVisible).toBe(false);
            expect(result.current.state.editingOrder).toBeNull();
        });

        it('should return all orders when no filters applied', () => {
            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.orders).toHaveLength(3);
        });

        it('should return loading state correctly', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null
            });

            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.isLoading).toBe(true);
        });

        it('should return error message when query fails', () => {
            (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
                data: undefined,
                isLoading: false,
                error: new Error('Failed to fetch')
            });

            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.error).toBe('Failed to fetch');
        });
    });

    describe('Search Filtering', () => {
        it('should filter orders by party name', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setSearchTerm('ABC');
            });

            expect(result.current.state.orders).toHaveLength(2);
            expect(result.current.state.orders.every((o: any) => o.partyName.includes('ABC'))).toBe(true);
        });

        it('should filter orders by invoice number', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setSearchTerm('INV-001');
            });

            expect(result.current.state.orders).toHaveLength(1);
            expect(result.current.state.orders[0].invoiceNumber).toBe('INV-001');
        });

        it('should be case insensitive', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setSearchTerm('abc');
            });

            expect(result.current.state.orders).toHaveLength(2);
        });
    });

    describe('Status Filtering', () => {
        it('should filter orders by status', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setFilters({
                    ...result.current.state.filters,
                    status: ['pending']
                });
            });

            expect(result.current.state.orders).toHaveLength(1);
            expect(result.current.state.orders[0].status).toBe('pending');
        });

        it('should filter by multiple statuses', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setFilters({
                    ...result.current.state.filters,
                    status: ['pending', 'completed']
                });
            });

            expect(result.current.state.orders).toHaveLength(2);
        });
    });

    describe('Derived Options', () => {
        it('should derive unique creator names', () => {
            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.options.creators).toContain('John Doe');
            expect(result.current.state.options.creators).toContain('Jane Smith');
            expect(result.current.state.options.creators).toHaveLength(2);
        });

        it('should derive unique party names', () => {
            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.options.parties).toContain('ABC Corp');
            expect(result.current.state.options.parties).toContain('XYZ Ltd');
            expect(result.current.state.options.parties).toHaveLength(2);
        });

        it('should provide month options', () => {
            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.options.months).toHaveLength(12);
            expect(result.current.state.options.months[0]).toBe('January');
        });

        it('should provide status options', () => {
            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.options.statuses).toContain('pending');
            expect(result.current.state.options.statuses).toContain('completed');
        });
    });

    describe('Actions', () => {
        it('should update current page', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setCurrentPage(2);
            });

            expect(result.current.state.currentPage).toBe(2);
        });

        it('should toggle filter visibility', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setIsFilterVisible(true);
            });

            expect(result.current.state.isFilterVisible).toBe(true);
        });

        it('should set editing order', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setEditingOrder(mockOrders[0] as any);
            });

            expect(result.current.state.editingOrder).toEqual(mockOrders[0]);
        });

        it('should reset all filters', () => {
            const { result } = renderHook(() => useOrderManager());

            act(() => {
                result.current.actions.setSearchTerm('test');
                result.current.actions.setFilters({
                    status: ['pending'],
                    month: ['January'],
                    creators: ['John'],
                    parties: ['ABC'],
                    date: new Date()
                });
            });

            act(() => {
                result.current.actions.onResetFilters();
            });

            expect(result.current.state.searchTerm).toBe('');
            expect(result.current.state.filters.status).toEqual([]);
            expect(result.current.state.filters.month).toEqual([]);
        });
    });

    describe('URL Parameters', () => {
        it('should initialize filters from URL status param', () => {
            (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
                new URLSearchParams('status=pending'),
                vi.fn()
            ]);

            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.filters.status).toContain('pending');
            expect(result.current.state.isFilterVisible).toBe(true);
        });

        it('should initialize date filter from URL today param', () => {
            (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
                new URLSearchParams('filter=today'),
                vi.fn()
            ]);

            const { result } = renderHook(() => useOrderManager());

            expect(result.current.state.filters.date).not.toBeNull();
            expect(result.current.state.isFilterVisible).toBe(true);
        });
    });

    describe('Sorting', () => {
        it('should sort orders by date descending', () => {
            const { result } = renderHook(() => useOrderManager());

            const dates = result.current.state.orders.map((o: any) => new Date(o.dateTime).getTime());

            for (let i = 0; i < dates.length - 1; i++) {
                expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
            }
        });
    });
});
