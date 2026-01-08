import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProductContent from './ProductContent';
import { useAuth } from '../../api/authService';
import { useProducts } from './useProducts';

const ProductsPage: React.FC = () => {
    const { hasPermission } = useAuth();

    // Use custom hook for logic (SRP)
    const {
        products,
        categories,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkUpdate,
        bulkDelete
    } = useProducts();

    return (
        <Sidebar>
            <ProductContent
                data={products}
                categories={categories}
                loading={isLoading}
                error={error ? (error as Error).message : null}
                hasPermission={hasPermission}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
                onBulkUpdate={bulkUpdate}
                onBulkDelete={bulkDelete}
            />
        </Sidebar>
    );
};

export default ProductsPage;