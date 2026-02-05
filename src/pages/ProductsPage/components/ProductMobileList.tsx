import React from 'react';
import { type Product } from '@/api/productService';
import { SquarePen, Trash2 } from 'lucide-react';
import { MobileCard, MobileCardList, type MobileCardAction } from '@/components/ui';

interface ProductMobileListProps {
    products: Product[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    canBulkDelete: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onImageClick?: (product: Product) => void;
    formatCurrency: (amount: number) => string;
}

const getStockStatus = (qty: number) => {
    if (qty === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-700' };
    if (qty <= 10) return { label: 'Low Stock', className: 'bg-amber-100 text-amber-700' };
    return { label: 'In Stock', className: 'bg-green-100 text-green-700' };
};

const ProductMobileList: React.FC<ProductMobileListProps> = ({
    products,
    selectedIds,
    onToggle,
    canBulkDelete,
    canUpdate,
    canDelete,
    onEdit,
    onDelete,
    onImageClick,
    formatCurrency
}) => {
    return (
        <MobileCardList isEmpty={products.length === 0} emptyMessage="No products found">
            {products.map((product, index) => {
                const stockStatus = getStockStatus(product.qty);

                // Build actions - limit to Edit and Delete
                const actions: MobileCardAction[] = [];

                if (canUpdate) {
                    actions.push({
                        label: 'Edit Product',
                        icon: SquarePen,
                        onClick: () => onEdit(product),
                        variant: 'primary',
                    });
                }
                if (canDelete) {
                    actions.push({
                        label: 'Delete',
                        icon: Trash2,
                        onClick: () => onDelete(product),
                        variant: 'danger',
                    });
                }

                return (
                    <MobileCard
                        key={product.id}
                        id={product.id}
                        header={{
                            selectable: canBulkDelete,
                            isSelected: selectedIds.includes(product.id),
                            onToggleSelection: () => onToggle(product.id),
                            serialNumber: index + 1,
                            title: product.productName,
                            avatar: product.image?.url ? {
                                imageUrl: product.image.url,
                                initials: product.productName.substring(0, 2).toUpperCase(),
                                bgColor: 'bg-gray-100',
                                textColor: 'text-gray-600',
                                onClick: onImageClick ? () => onImageClick(product) : undefined,
                            } : undefined,
                            badge: {
                                type: 'custom',
                                label: stockStatus.label,
                                className: stockStatus.className,
                            },
                        }}
                        details={[
                            {
                                label: 'Price',
                                value: formatCurrency(product.price),
                                valueClassName: 'font-bold text-secondary',
                            },
                            {
                                label: 'Stock',
                                value: `${product.qty} units`,
                                valueClassName: product.qty <= 10 ? 'font-semibold text-amber-600' : 'font-semibold text-gray-800',
                            },
                            {
                                label: 'Category',
                                value: product.category?.name || 'Uncategorized',
                            },
                            {
                                label: 'Serial No',
                                value: product.serialNo || 'N/A',
                            },
                        ]}
                        detailsLayout="grid"
                        actions={actions}
                        actionsFullWidth={actions.length === 1}
                    />
                );
            })}
        </MobileCardList>
    );
};

export default ProductMobileList;
