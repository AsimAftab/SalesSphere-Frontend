import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    bulkUpdateProducts,
    bulkDeleteProducts,
    type UpdateProductFormData
} from '@/api/productService';
import toast from 'react-hot-toast';

const PRODUCTS_QUERY_KEY = ['products'];
const CATEGORIES_QUERY_KEY = ['categories'];

export const useProducts = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Products
    const productsQuery = useQuery({
        queryKey: PRODUCTS_QUERY_KEY,
        queryFn: () => getProducts(),
    });

    // 2. Fetch Categories
    const categoriesQuery = useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: () => getCategories(),
    });

    // 3. Mutation for Adding a Product
    const addProductMutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            toast.success("Product added successfully!");
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const apiErrorMessage = error.response?.data?.message || 'Could not save the new product.';
            toast.error(apiErrorMessage);
            throw new Error(apiErrorMessage);
        }
    });

    // 4. Mutation for Updating a Product
    const updateProductMutation = useMutation({
        mutationFn: (variables: { productId: string, data: UpdateProductFormData }) =>
            updateProduct(variables.productId, variables.data),
        onSuccess: () => {
            toast.success("Product updated successfully!");
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const apiErrorMessage = error.response?.data?.message || 'Could not update the product.';
            toast.error(apiErrorMessage);
            throw new Error(apiErrorMessage);
        }
    });

    // 5. Mutation for Deleting a Product
    const deleteProductMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted successfully.");
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const apiErrorMessage = error.response?.data?.message || 'Could not delete the product.';
            toast.error(apiErrorMessage);
        }
    });

    // 6. Mutation for Mass Deleting Products
    const bulkDeleteMutation = useMutation({
        mutationFn: bulkDeleteProducts,
        onSuccess: () => {
            toast.success("Mass delete completed successfully.");
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const apiErrorMessage = error.response?.data?.message || 'Failed to delete selected products.';
            toast.error(apiErrorMessage);
        }
    });

    // 7. Mutation for Bulk Updating
    const bulkUpdateMutation = useMutation({
        mutationFn: bulkUpdateProducts,
        onSuccess: () => {
            toast.success("Products imported successfully!");
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            const apiErrorMessage = error.response?.data?.message || 'Failed to process the import.';
            toast.error(apiErrorMessage);
            throw new Error(apiErrorMessage);
        }
    });

    // Combine loading and error states
    const isLoading = productsQuery.isLoading || categoriesQuery.isLoading;
    const error = productsQuery.error || categoriesQuery.error;

    return {
        products: productsQuery.data || [],
        categories: categoriesQuery.data || [],
        isLoading,
        error,
        addProduct: addProductMutation.mutateAsync,
        updateProduct: (productId: string, data: UpdateProductFormData) => updateProductMutation.mutateAsync({ productId, data }),
        deleteProduct: deleteProductMutation.mutateAsync,
        bulkUpdate: bulkUpdateMutation.mutateAsync,
        bulkDelete: bulkDeleteMutation.mutateAsync,
    };
};
