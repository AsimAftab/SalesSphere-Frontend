/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock dependencies
const mockMutateAsync = vi.fn();
const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(),
    useMutation: vi.fn((options) => ({
        mutateAsync: mockMutateAsync.mockImplementation(async (data) => {
            if (options.onSuccess) options.onSuccess();
            return data;
        }),
        isPending: false
    })),
    useQueryClient: vi.fn(() => ({
        invalidateQueries: mockInvalidateQueries
    }))
}));

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() }
}));

vi.mock('@/api/productService', () => ({
    getProducts: vi.fn(),
    addProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    getCategories: vi.fn(),
    bulkUpdateProducts: vi.fn(),
    bulkDeleteProducts: vi.fn()
}));

import { useQuery } from '@tanstack/react-query';
import { useProducts } from '@/pages/ProductsPage/hooks/useProducts';

const mockProducts = [
    { id: '1', productName: 'Product A', price: 100, qty: 50, category: { name: 'Electronics' } },
    { id: '2', productName: 'Product B', price: 200, qty: 30, category: { name: 'Electronics' } },
    { id: '3', productName: 'Product C', price: 150, qty: 20, category: { name: 'Clothing' } }
];

const mockCategories = [
    { _id: 'cat1', name: 'Electronics' },
    { _id: 'cat2', name: 'Clothing' }
];

describe('useProducts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockMutateAsync.mockReset();

        (useQuery as ReturnType<typeof vi.fn>)
            .mockReturnValueOnce({
                data: mockProducts,
                isLoading: false,
                error: null
            })
            .mockReturnValueOnce({
                data: mockCategories,
                isLoading: false,
                error: null
            });
    });

    describe('Data Fetching', () => {
        it('should return products list', () => {
            const { result } = renderHook(() => useProducts());

            expect(result.current.products).toEqual(mockProducts);
        });

        it('should return categories list', () => {
            const { result } = renderHook(() => useProducts());

            expect(result.current.categories).toEqual(mockCategories);
        });

        it('should return empty arrays when data is undefined', () => {
            (useQuery as ReturnType<typeof vi.fn>)
                .mockReset()
                .mockReturnValueOnce({ data: undefined, isLoading: true, error: null })
                .mockReturnValueOnce({ data: undefined, isLoading: true, error: null });

            const { result } = renderHook(() => useProducts());

            expect(result.current.products).toEqual([]);
            expect(result.current.categories).toEqual([]);
        });

        it('should return loading state when either query is loading', () => {
            (useQuery as ReturnType<typeof vi.fn>)
                .mockReset()
                .mockReturnValueOnce({ data: mockProducts, isLoading: true, error: null })
                .mockReturnValueOnce({ data: mockCategories, isLoading: false, error: null });

            const { result } = renderHook(() => useProducts());

            expect(result.current.isLoading).toBe(true);
        });

        it('should return error when products query fails', () => {
            const mockError = new Error('Failed to fetch products');
            (useQuery as ReturnType<typeof vi.fn>)
                .mockReset()
                .mockReturnValueOnce({ data: undefined, isLoading: false, error: mockError })
                .mockReturnValueOnce({ data: mockCategories, isLoading: false, error: null });

            const { result } = renderHook(() => useProducts());

            expect(result.current.error).toBe(mockError);
        });

        it('should return error when categories query fails', () => {
            const mockError = new Error('Failed to fetch categories');
            (useQuery as ReturnType<typeof vi.fn>)
                .mockReset()
                .mockReturnValueOnce({ data: mockProducts, isLoading: false, error: null })
                .mockReturnValueOnce({ data: undefined, isLoading: false, error: mockError });

            const { result } = renderHook(() => useProducts());

            expect(result.current.error).toBe(mockError);
        });
    });

    describe('Add Product', () => {
        it('should expose addProduct mutation function', () => {
            const { result } = renderHook(() => useProducts());

            expect(result.current.addProduct).toBeDefined();
            expect(typeof result.current.addProduct).toBe('function');
        });

        it('should call mutateAsync when adding product', async () => {
            const { result } = renderHook(() => useProducts());

            const formData = new FormData();
            formData.append('productName', 'New Product');

            await result.current.addProduct(formData as any);

            expect(mockMutateAsync).toHaveBeenCalledWith(formData);
        });
    });

    describe('Update Product', () => {
        it('should expose updateProduct mutation function', () => {
            const { result } = renderHook(() => useProducts());

            expect(result.current.updateProduct).toBeDefined();
            expect(typeof result.current.updateProduct).toBe('function');
        });

        it('should call mutateAsync with productId and data when updating', async () => {
            const { result } = renderHook(() => useProducts());

            const updateData = { productName: 'Updated Product' };
            await result.current.updateProduct('prod1', updateData as any);

            expect(mockMutateAsync).toHaveBeenCalledWith({
                productId: 'prod1',
                data: updateData
            });
        });
    });

    describe('Delete Product', () => {
        it('should expose deleteProduct mutation function', () => {
            const { result } = renderHook(() => useProducts());

            expect(result.current.deleteProduct).toBeDefined();
            expect(typeof result.current.deleteProduct).toBe('function');
        });

        it('should call mutateAsync when deleting product', async () => {
            const { result } = renderHook(() => useProducts());

            await result.current.deleteProduct('prod1');

            expect(mockMutateAsync).toHaveBeenCalledWith('prod1');
        });
    });

    describe('Bulk Operations', () => {
        it('should expose bulkUpdate mutation function', () => {
            const { result } = renderHook(() => useProducts());

            expect(result.current.bulkUpdate).toBeDefined();
            expect(typeof result.current.bulkUpdate).toBe('function');
        });

        it('should expose bulkDelete mutation function', () => {
            const { result } = renderHook(() => useProducts());

            expect(result.current.bulkDelete).toBeDefined();
            expect(typeof result.current.bulkDelete).toBe('function');
        });

        it('should call mutateAsync when bulk updating', async () => {
            const { result } = renderHook(() => useProducts());

            const bulkData = [{ productName: 'Product 1' }, { productName: 'Product 2' }];
            await result.current.bulkUpdate(bulkData as any);

            expect(mockMutateAsync).toHaveBeenCalledWith(bulkData);
        });

        it('should call mutateAsync when bulk deleting', async () => {
            const { result } = renderHook(() => useProducts());

            const ids = ['prod1', 'prod2'];
            await result.current.bulkDelete(ids);

            expect(mockMutateAsync).toHaveBeenCalledWith(ids);
        });
    });

    describe('Combined Loading State', () => {
        it('should be loading when only products are loading', () => {
            (useQuery as ReturnType<typeof vi.fn>)
                .mockReset()
                .mockReturnValueOnce({ data: undefined, isLoading: true, error: null })
                .mockReturnValueOnce({ data: mockCategories, isLoading: false, error: null });

            const { result } = renderHook(() => useProducts());

            expect(result.current.isLoading).toBe(true);
        });

        it('should be loading when only categories are loading', () => {
            (useQuery as ReturnType<typeof vi.fn>)
                .mockReset()
                .mockReturnValueOnce({ data: mockProducts, isLoading: false, error: null })
                .mockReturnValueOnce({ data: undefined, isLoading: true, error: null });

            const { result } = renderHook(() => useProducts());

            expect(result.current.isLoading).toBe(true);
        });

        it('should not be loading when both are loaded', () => {
            const { result } = renderHook(() => useProducts());

            expect(result.current.isLoading).toBe(false);
        });
    });
});
