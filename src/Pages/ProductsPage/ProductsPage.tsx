import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProductContent from './ProductContent';
import ErrorBoundary from '../../components/UI/ErrorBoundary/ErrorBoundary';
import { useAuth } from '../../api/authService';
import { useProducts } from './useProducts';

import { useProductViewState } from './useProductViewState';

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

    // Lifted View State Logic
    const { state, actions } = useProductViewState({
        data: products,
        categories,
        onUpdateProduct: updateProduct,
        onDeleteProduct: deleteProduct,
        onBulkDelete: bulkDelete
    });

    // Centralized Permissions
    const permissions = {
        canCreate: hasPermission('products', 'create'),
        canUpdate: hasPermission('products', 'update'),
        canDelete: hasPermission('products', 'delete'),
        canBulkUpload: hasPermission('products', 'bulkUpload'),
        canBulkDelete: hasPermission('products', 'bulkDelete'),
        canExportPdf: hasPermission('products', 'exportPdf'),
        canExportExcel: hasPermission('products', 'exportExcel'),
    };

    // Merge loading/error state immutably
    const mergedState = {
        ...state,
        isLoading,
        error: error ? (error as Error).message : null
    };

    return (
        <Sidebar>
            <ErrorBoundary>
                <ProductContent
                    state={mergedState}
                    actions={actions}
                    permissions={permissions}
                    categories={categories}
                    onAddProduct={addProduct}
                    onBulkUpdate={bulkUpdate}
                />
            </ErrorBoundary>
        </Sidebar>
    );
};

export default ProductsPage;