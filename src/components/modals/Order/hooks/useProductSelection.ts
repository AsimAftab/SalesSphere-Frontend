/**
 * Product Selection Hook
 * 
 * Handles product filtering, category selection, and search logic.
 * Follows Single Responsibility Principle - only handles product selection state.
 */

import { useState, useMemo } from 'react';
import type { Product } from '@/api/productService';
import type { CartItem } from '@/pages/OrderListPage/Transaction/hooks/useTransactionManager';

interface UseProductSelectionProps {
    products: Product[];
    cartItems: CartItem[];
}

interface UseProductSelectionReturn {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategories: string[];
    toggleCategory: (cat: string) => void;
    clearCategories: () => void;
    categories: string[];
    filteredProducts: Product[];
    getCartItem: (productId: string) => CartItem | undefined;
    isInCart: (productId: string) => boolean;
}

export const useProductSelection = ({
    products,
    cartItems
}: UseProductSelectionProps): UseProductSelectionReturn => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = products.map((p) => p.category?.name).filter((name): name is string => !!name);
        return Array.from(new Set(cats));
    }, [products]);

    // Filter products based on search and categories
    const filteredProducts = useMemo(() => {
        const list = products.filter((p) => {
            const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 ||
                (p.category?.name && selectedCategories.includes(p.category.name));
            return matchesSearch && matchesCategory;
        });

        // Sort: In-cart items first
        return [...list].sort((a, b) => {
            const aInCart = cartItems.some(item => item.productId === a.id);
            const bInCart = cartItems.some(item => item.productId === b.id);
            if (aInCart && !bInCart) return -1;
            if (!aInCart && bInCart) return 1;
            return 0;
        });
    }, [products, searchTerm, selectedCategories, cartItems]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const clearCategories = () => {
        setSelectedCategories([]);
    };

    const getCartItem = (productId: string) => {
        return cartItems.find(item => item.productId === productId);
    };

    const isInCart = (productId: string) => {
        return cartItems.some(item => item.productId === productId);
    };

    return {
        searchTerm,
        setSearchTerm,
        selectedCategories,
        toggleCategory,
        clearCategories,
        categories,
        filteredProducts,
        getCartItem,
        isInCart
    };
};

export default useProductSelection;
