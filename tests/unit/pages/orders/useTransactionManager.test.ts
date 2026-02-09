/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock dependencies
const mockNavigate = vi.fn();
const mockMutate = vi.fn();

vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(),
    useMutation: vi.fn(() => ({
        mutate: mockMutate,
        isPending: false
    })),
    useQueryClient: vi.fn(() => ({
        invalidateQueries: vi.fn()
    }))
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()])
}));

vi.mock('react-hot-toast', () => ({
    toast: { success: vi.fn(), error: vi.fn() }
}));

vi.mock('@/api/auth', () => ({
    useAuth: vi.fn(() => ({
        hasPermission: vi.fn(() => true)
    }))
}));

vi.mock('@/api/partyService', () => ({
    getParties: vi.fn()
}));

vi.mock('@/api/productService', () => ({
    getProducts: vi.fn()
}));

vi.mock('@/api/api', () => ({
    default: { post: vi.fn() }
}));

vi.mock('@/utils/dateUtils', () => ({
    formatDateToLocalISO: vi.fn((date) => date.toISOString().split('T')[0])
}));

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/api/auth';
import { useTransactionManager } from '@/pages/OrderListPage/Transaction/hooks/useTransactionManager';

const mockParties = [
    { id: 'p1', companyName: 'ABC Corp' },
    { id: 'p2', companyName: 'XYZ Ltd' }
];

const mockProducts = [
    { id: 'prod1', productName: 'Product A', price: 100, qty: 50, category: { name: 'Electronics' } },
    { id: 'prod2', productName: 'Product B', price: 200, qty: 30, category: { name: 'Electronics' } },
    { id: 'prod3', productName: 'Product C', price: 150, qty: 20, category: { name: 'Clothing' } }
];

describe('useTransactionManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Use mockImplementation with queryKey to determine which data to return
        (useQuery as ReturnType<typeof vi.fn>).mockImplementation((options: { queryKey: string[] }) => {
            if (options.queryKey[0] === 'parties') {
                return { data: mockParties, isLoading: false };
            }
            if (options.queryKey[0] === 'products') {
                return { data: mockProducts, isLoading: false };
            }
            return { data: undefined, isLoading: false };
        });

        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
            new URLSearchParams(),
            vi.fn()
        ]);

        (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
            hasPermission: vi.fn(() => true)
        });
    });

    describe('Initial State', () => {
        it('should initialize with empty cart', () => {
            const { result } = renderHook(() => useTransactionManager());

            expect(result.current.state.items).toEqual([]);
        });

        it('should initialize with no selected party', () => {
            const { result } = renderHook(() => useTransactionManager());

            expect(result.current.state.selectedPartyId).toBe('');
        });

        it('should initialize with zero discount', () => {
            const { result } = renderHook(() => useTransactionManager());

            expect(result.current.state.overallDiscount).toBe(0);
        });

        it('should default to order mode', () => {
            const { result } = renderHook(() => useTransactionManager());

            expect(result.current.state.isOrder).toBe(true);
        });
    });

    describe('Estimate Mode', () => {
        it('should switch to estimate mode when type=estimate in URL', () => {
            (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
                new URLSearchParams('type=estimate'),
                vi.fn()
            ]);

            const { result } = renderHook(() => useTransactionManager());

            expect(result.current.state.isOrder).toBe(false);
        });

        it('should force estimate mode when user cannot create orders but can create estimates', () => {
            (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
                hasPermission: vi.fn((resource, action) => {
                    if (resource === 'invoices' && action === 'create') return false;
                    if (resource === 'estimates' && action === 'create') return true;
                    return false;
                })
            });

            const { result } = renderHook(() => useTransactionManager());

            expect(result.current.state.isOrder).toBe(false);
        });
    });

    describe('Product Filtering', () => {
        it('should filter products by search term', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.setSearchTerm('Product A');
            });

            expect(result.current.state.filteredProducts).toHaveLength(1);
            expect(result.current.state.filteredProducts[0].productName).toBe('Product A');
        });

        it('should filter products by category', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleCategory('Clothing');
            });

            expect(result.current.state.filteredProducts).toHaveLength(1);
            expect(result.current.state.filteredProducts[0].productName).toBe('Product C');
        });

        it('should derive unique categories from products', () => {
            const { result } = renderHook(() => useTransactionManager());

            expect(result.current.state.categories).toContain('Electronics');
            expect(result.current.state.categories).toContain('Clothing');
            expect(result.current.state.categories).toHaveLength(2);
        });
    });

    describe('Cart Management', () => {
        it('should add product to cart', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleProduct(mockProducts[0] as any);
            });

            expect(result.current.state.items).toHaveLength(1);
            expect(result.current.state.items[0].productName).toBe('Product A');
            expect(result.current.state.items[0].quantity).toBe(1);
        });

        it('should increment quantity when adding existing product', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleProduct(mockProducts[0] as any);
            });

            act(() => {
                result.current.actions.toggleProduct(mockProducts[0] as any);
            });

            expect(result.current.state.items).toHaveLength(1);
            expect(result.current.state.items[0].quantity).toBe(2);
        });

        it('should remove item from cart', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleProduct(mockProducts[0] as any);
            });

            act(() => {
                result.current.actions.removeItem('prod1');
            });

            expect(result.current.state.items).toHaveLength(0);
        });

        it('should update item field', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleProduct(mockProducts[0] as any);
            });

            act(() => {
                result.current.actions.updateItem(0, 'quantity', 5);
            });

            expect(result.current.state.items[0].quantity).toBe(5);
        });
    });

    describe('Totals Calculation', () => {
        it('should calculate subtotal correctly', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleProduct(mockProducts[0] as any); // 100
            });

            act(() => {
                result.current.actions.toggleProduct(mockProducts[1] as any); // 200
            });

            expect(result.current.state.totals.subtotal).toBe(300);
        });

        it('should apply overall discount correctly', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleProduct(mockProducts[0] as any); // 100
            });

            act(() => {
                result.current.actions.setOverallDiscount(10); // 10%
            });

            expect(result.current.state.totals.finalTotal).toBe(90);
            expect(result.current.state.totals.discountAmount).toBe(10);
        });

        it('should apply item-level discount correctly', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleProduct(mockProducts[0] as any); // 100
            });

            act(() => {
                result.current.actions.updateItem(0, 'discount', 20); // 20% item discount
            });

            expect(result.current.state.totals.subtotal).toBe(80); // 100 - 20%
        });
    });

    describe('Category Toggle', () => {
        it('should add category when toggling unselected category', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleCategory('Electronics');
            });

            expect(result.current.state.selectedCategories).toContain('Electronics');
        });

        it('should remove category when toggling selected category', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleCategory('Electronics');
            });

            act(() => {
                result.current.actions.toggleCategory('Electronics');
            });

            expect(result.current.state.selectedCategories).not.toContain('Electronics');
        });
    });

    describe('Product Sorting', () => {
        it('should sort in-cart items first', () => {
            const { result } = renderHook(() => useTransactionManager());

            act(() => {
                result.current.actions.toggleProduct(mockProducts[2] as any); // Product C
            });

            expect(result.current.state.filteredProducts[0].productName).toBe('Product C');
        });
    });
});
