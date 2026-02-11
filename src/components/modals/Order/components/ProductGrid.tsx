/**
 * Product Grid Component
 * 
 * Renders a grid of product cards with search and category filtering.
 * Follows Single Responsibility Principle - only handles product grid display.
 */

import React from 'react';
import { Package, Loader2 } from 'lucide-react';
import { SearchBar, FilterDropdown } from '@/components/ui';
import type { Product } from '@/api/productService';
import type { CartItem } from '@/pages/OrderListPage/Transaction/hooks/useTransactionManager';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
    cartItems: CartItem[];
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    categories: string[];
    selectedCategories: string[];
    onToggleCategory: (cat: string) => void;
    onAddProduct: (product: Product) => void;
    onRemoveProduct: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    getCartItem: (productId: string) => CartItem | undefined;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    isLoading,
    searchTerm,
    onSearchChange,
    categories,
    selectedCategories,
    onToggleCategory,
    onAddProduct,
    onRemoveProduct,
    onUpdateQuantity,
    getCartItem
}) => {
    // Handle category selection changes from FilterDropdown
    const handleCategoryChange = (values: string[]) => {
        // Find the difference to determine which category was toggled
        const added = values.find(v => !selectedCategories.includes(v));
        const removed = selectedCategories.find(v => !values.includes(v));

        if (added) onToggleCategory(added);
        if (removed) onToggleCategory(removed);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search Bar & Category Filter Row */}
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search products..."
                        className="flex-1 !w-full"
                    />
                    <FilterDropdown
                        label="Category"
                        options={categories}
                        selected={selectedCategories}
                        onChange={handleCategoryChange}
                        align="right"
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-50">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                        <p className="text-sm font-medium text-gray-500">Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                cartItem={getCartItem(product.id)}
                                onAdd={onAddProduct}
                                onRemove={onRemoveProduct}
                                onUpdateQuantity={onUpdateQuantity}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-60">
                        <Package className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search terms or filters to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;
