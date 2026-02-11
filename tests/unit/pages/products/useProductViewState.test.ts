import { describe, it, expect } from 'vitest';

// Extracted logic from useProductViewState

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    isActive: boolean;
}

function filterProducts(
    products: Product[],
    searchTerm: string,
    selectedCategory: string[],
    selectedUnit: string[]
): Product[] {
    const term = searchTerm.toLowerCase();
    return products.filter((product) => {
        const matchesSearch = term === "" ||
            product.name.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term);

        const matchesCategory = selectedCategory.length === 0 ||
            selectedCategory.includes(product.category);

        const matchesUnit = selectedUnit.length === 0 ||
            selectedUnit.includes(product.unit);

        return matchesSearch && matchesCategory && matchesUnit;
    });
}

function paginateProducts(
    products: Product[],
    currentPage: number,
    itemsPerPage: number
): Product[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
}

function getUniqueCategories(products: Product[]): string[] {
    return Array.from(new Set(products.map(p => p.category).filter(Boolean)));
}

function getUniqueUnits(products: Product[]): string[] {
    return Array.from(new Set(products.map(p => p.unit).filter(Boolean)));
}

function sortProductsByName(products: Product[], ascending: boolean = true): Product[] {
    return [...products].sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return ascending ? comparison : -comparison;
    });
}

// Test data
const mockProducts: Product[] = [
    { _id: '1', name: 'Widget A', category: 'Electronics', price: 100, unit: 'Piece', isActive: true },
    { _id: '2', name: 'Gadget B', category: 'Electronics', price: 200, unit: 'Piece', isActive: true },
    { _id: '3', name: 'Tool C', category: 'Hardware', price: 50, unit: 'Set', isActive: false },
    { _id: '4', name: 'Part D', category: 'Hardware', price: 25, unit: 'Kg', isActive: true },
    { _id: '5', name: 'Supply E', category: 'Office', price: 10, unit: 'Pack', isActive: true },
    { _id: '6', name: 'Material F', category: 'Hardware', price: 75, unit: 'Kg', isActive: true },
];

describe('Product View State - Filter Logic', () => {
    it('should return all products when no filters applied', () => {
        const result = filterProducts(mockProducts, '', [], []);
        expect(result).toHaveLength(6);
    });

    it('should filter by search term (name)', () => {
        const result = filterProducts(mockProducts, 'Widget', [], []);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Widget A');
    });

    it('should filter by search term (category)', () => {
        const result = filterProducts(mockProducts, 'Hardware', [], []);
        expect(result).toHaveLength(3);
    });

    it('should filter by category', () => {
        const result = filterProducts(mockProducts, '', ['Electronics'], []);
        expect(result).toHaveLength(2);
    });

    it('should filter by unit', () => {
        const result = filterProducts(mockProducts, '', [], ['Kg']);
        expect(result).toHaveLength(2);
    });

    it('should filter by multiple categories', () => {
        const result = filterProducts(mockProducts, '', ['Electronics', 'Office'], []);
        expect(result).toHaveLength(3);
    });

    it('should combine search and category filters', () => {
        const result = filterProducts(mockProducts, 'Tool', ['Hardware'], []);
        expect(result).toHaveLength(1);
    });

    it('should be case insensitive', () => {
        const result = filterProducts(mockProducts, 'WIDGET', [], []);
        expect(result).toHaveLength(1);
    });

    it('should return empty when no matches', () => {
        const result = filterProducts(mockProducts, 'nonexistent', [], []);
        expect(result).toHaveLength(0);
    });
});

describe('Product View State - Pagination', () => {
    it('should return first page correctly', () => {
        const result = paginateProducts(mockProducts, 1, 2);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('1');
    });

    it('should return second page correctly', () => {
        const result = paginateProducts(mockProducts, 2, 2);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('3');
    });

    it('should handle last page with fewer items', () => {
        const result = paginateProducts(mockProducts, 3, 2);
        expect(result).toHaveLength(2);
    });

    it('should return empty for page beyond data', () => {
        const result = paginateProducts(mockProducts, 10, 2);
        expect(result).toHaveLength(0);
    });
});

describe('Product View State - Unique Values', () => {
    it('should extract unique categories', () => {
        const result = getUniqueCategories(mockProducts);
        expect(result).toContain('Electronics');
        expect(result).toContain('Hardware');
        expect(result).toContain('Office');
        expect(result.length).toBe(3);
    });

    it('should extract unique units', () => {
        const result = getUniqueUnits(mockProducts);
        expect(result).toContain('Piece');
        expect(result).toContain('Set');
        expect(result).toContain('Kg');
        expect(result).toContain('Pack');
        expect(result.length).toBe(4);
    });
});

describe('Product View State - Sorting', () => {
    it('should sort products by name ascending', () => {
        const result = sortProductsByName(mockProducts, true);
        expect(result[0].name).toBe('Gadget B');
        expect(result[result.length - 1].name).toBe('Widget A');
    });

    it('should sort products by name descending', () => {
        const result = sortProductsByName(mockProducts, false);
        expect(result[0].name).toBe('Widget A');
        expect(result[result.length - 1].name).toBe('Gadget B');
    });

    it('should not mutate original array', () => {
        const original = [...mockProducts];
        sortProductsByName(mockProducts, true);
        expect(mockProducts[0]._id).toBe(original[0]._id);
    });
});
