import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProductContent from './ProductContent';
import { 
    getProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    getCategories,
    bulkUpdateProducts,
    type UpdateProductFormData,
    // type BulkProductData 
} from '../../api/productService';
import toast from 'react-hot-toast';

// Define query keys for caching
const PRODUCTS_QUERY_KEY = ['products'];
const CATEGORIES_QUERY_KEY = ['categories'];

const ProductsPage: React.FC = () => {
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
        onError: (error: any) => {
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
        onError: (error: any) => {
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
        onError: (error: any) => {
            const apiErrorMessage = error.response?.data?.message || 'Could not delete the product.';
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
        onError: (error: any) => {
            const apiErrorMessage = error.response?.data?.message || 'Failed to process the import.';
            toast.error(apiErrorMessage);
            throw new Error(apiErrorMessage);
        }
    });

    // Combine loading and error states
    const isLoading = productsQuery.isLoading || categoriesQuery.isLoading;
    const error = productsQuery.error || categoriesQuery.error;

    return (
        <Sidebar>
            <ProductContent
                data={productsQuery.data?.data || null}
                categories={categoriesQuery.data || []}
                loading={isLoading}
                error={error ? (error as Error).message : null}
                
                onAddProduct={addProductMutation.mutateAsync}
                onUpdateProduct={(productId, data) => 
                    updateProductMutation.mutateAsync({ productId, data })
                }
                onDeleteProduct={deleteProductMutation.mutateAsync}
                onBulkUpdate={bulkUpdateMutation.mutateAsync}
            />
        </Sidebar>
    );
};

export default ProductsPage;