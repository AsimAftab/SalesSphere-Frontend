/**
 * Product Picker Modal
 * 
 * Modal for selecting products to add to an order.
 * Follows SOLID principles:
 * - SRP: Modal orchestration only, delegates to ProductGrid
 * - OCP: Uses FormModal which is extensible
 * - DIP: Depends on abstractions (callbacks) not concrete implementations
 */

import React from 'react';
import { Package, ShoppingCart } from 'lucide-react';
import { FormModal, Button } from '@/components/ui';
import type { Product } from '@/api/productService';
import type { CartItem } from '@/pages/OrderListPage/Transaction/hooks/useTransactionManager';
import ProductGrid from './components/ProductGrid';
import { useProductSelection } from './hooks/useProductSelection';

export interface ProductPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    isLoading: boolean;
    cartItems: CartItem[];
    onAddProduct: (product: Product) => void;
    onRemoveProduct: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
    isOpen,
    onClose,
    products,
    isLoading,
    cartItems,
    onAddProduct,
    onRemoveProduct,
    onUpdateQuantity
}) => {
    const {
        searchTerm,
        setSearchTerm,
        selectedCategories,
        toggleCategory,
        categories,
        filteredProducts,
        getCartItem
    } = useProductSelection({ products, cartItems });

    const footer = (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">{cartItems.length} Products Selected</p>
                    <p className="text-xs text-gray-500">Review your selection in the order table</p>
                </div>
            </div>
            <Button variant="primary" onClick={onClose}>
                Done & Review Order
            </Button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Products"
            description="Search and select items to add to the order"
            size="xl"
            icon={<Package className="h-5 w-5 text-blue-600" />}
            footer={footer}
        >
            <div className="h-[60vh]">
                <ProductGrid
                    products={filteredProducts}
                    cartItems={cartItems}
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onToggleCategory={toggleCategory}
                    onAddProduct={onAddProduct}
                    onRemoveProduct={onRemoveProduct}
                    onUpdateQuantity={onUpdateQuantity}
                    getCartItem={getCartItem}
                />
            </div>
        </FormModal>
    );
};

export default ProductPickerModal;
