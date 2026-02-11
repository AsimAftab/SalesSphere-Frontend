import React, { useMemo } from 'react';
import { type Product } from '@/api/productService';
import { DataTable, textColumn, imageColumn, type TableColumn, type TableAction } from '@/components/ui';

interface ProductTableProps {
    products: Product[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onSelectAll: (checked: boolean) => void;
    startIndex: number;
    loading: boolean;
    canBulkDelete: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onImageClick: (product: Product) => void;
    formatCurrency: (amount: number) => string;
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    selectedIds,
    onToggle,
    onSelectAll,
    startIndex,
    loading,
    canBulkDelete,
    canUpdate,
    canDelete,
    onEdit,
    onDelete,
    onImageClick,
    formatCurrency
}) => {
    const columns: TableColumn<Product>[] = useMemo(() => [
        imageColumn<Product>('image', 'Image', {
            getImageUrl: (product) => product.image?.url,
            getFallback: (product) => product.productName,
            onClick: onImageClick,
        }),
        textColumn<Product>('serialNo', 'Serial No.', (product) => product.serialNo || 'N/A'),
        textColumn<Product>('productName', 'Product Name', 'productName'),
        textColumn<Product>('category', 'Category', (product) => product.category?.name || 'N/A'),
        {
            key: 'price',
            label: 'Price',
            render: (_, product) => formatCurrency(product.price),
        },
        textColumn<Product>('qty', 'Stock (Qty)', (product) => String(product.qty)),
    ], [formatCurrency, onImageClick]);

    const actions: TableAction<Product>[] = useMemo(() => {
        const actionList: TableAction<Product>[] = [];

        if (canUpdate) {
            actionList.push({
                type: 'edit',
                label: 'Edit',
                onClick: onEdit,
            });
        }

        if (canDelete) {
            actionList.push({
                type: 'delete',
                label: 'Delete',
                onClick: onDelete,
            });
        }

        return actionList;
    }, [canUpdate, canDelete, onEdit, onDelete]);

    const rowClassName = (_item: Product, isSelected: boolean): string => {
        return isSelected ? 'bg-blue-100' : '';
    };

    return (
        <DataTable<Product>
            data={products}
            columns={columns}
            getRowId={(product) => product.id}
            selectable={canBulkDelete}
            selectedIds={selectedIds}
            onToggleSelection={onToggle}
            onSelectAll={onSelectAll}
            showSerialNumber={true}
            startIndex={startIndex}
            actions={actions.length > 0 ? actions : undefined}
            actionsLabel="Action"
            loading={loading}
            hideOnMobile={true}
            rowClassName={rowClassName}
            className="overflow-x-auto"
        />
    );
};

export default ProductTable;
