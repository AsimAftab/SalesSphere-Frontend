import api from './api';

// --- INTERFACES ---

/**
 * Main Product data structure.
 * Aligned with the backend Mongoose model.
 * Use this interface in your React components.
 */
export interface Product {
    _id: string; // <-- CRITICAL: Changed from 'id: number' to '_id: string'
    imageUrl: string;
    name: string;
    category: string;
    price: number;
    piece: number; // This is the stock count
    sku?: string;
    description?: string;
    isActive: boolean;
    organizationId: string;
    createdBy: string;
}

/**
 * Data structure for creating a new product.
 * Omits backend-generated fields.
 */
export type NewProductData = Omit<Product, '_id' | 'isActive' | 'organizationId' | 'createdBy'>;

/**
 * Data structure for the bulk import/update feature.
 */
export interface BulkProductData {
    name: string;
    piece: number;
    price: number;
    category: string;
    imageUrl?: string;
}

/**
 * Data structure for the decrease stock feature.
 */
export interface StockItem {
    productId: string; // <-- Changed from number to string
    quantity: number;
}

// --- RESPONSE TYPE INTERFACES (from backend) ---

interface GetProductsResponse {
    success: boolean;
    count: number;
    data: Product[];
}

interface ProductResponse {
    success: boolean;
    data: Product;
}

interface DeleteResponse {
    success: boolean;
    message: string;
}

interface BulkUpdateResponse {
    success: boolean;
    data: Product[];
}

interface DecreaseStockResponse {
    success: boolean;
    message: string;
    data: any; // Raw bulkWrite result
}


// --- API FUNCTIONS ---

/**
 * Fetches all active products for the organization.
 * Corresponds to: getProducts()
 */
export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get<GetProductsResponse>('/products');
        return response.data.data; // Return the array of products
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error; // Re-throw for the component to handle
    }
};

/**
 * Creates a new product.
 * Corresponds to: addProduct()
 */
export const addProduct = async (newProductData: NewProductData): Promise<Product> => {
    try {
        const response = await api.post<ProductResponse>('/products', newProductData);
        return response.data.data;
    } catch (error) {
        console.error("Failed to add product:", error);
        throw error;
    }
};

/**
 * Updates an existing product.
 * Corresponds to: updateProduct()
 * Note: Sends the entire product object (minus _id) in the body.
 * The backend controller will whitelist the fields.
 */
export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    try {
        // Separate _id from the update data
        const { _id, ...updateData } = updatedProduct;
        
        const response = await api.put<ProductResponse>(
            `/products/${_id}`, // Send ID in the URL
            updateData          // Send the rest in the body
        );
        return response.data.data;
    } catch (error) {
        console.error("Failed to update product:", error);
        throw error;
    }
};

/**
 * Deactivates a product (soft delete).
 * Corresponds to: deleteProduct()
 */
export const deleteProduct = async (productId: string): Promise<{ success: boolean }> => {
    try {
        // Note the change: productId is now a string
        const response = await api.delete<DeleteResponse>(`/products/${productId}`);
        return { success: response.data.success };
    } catch (error) {
        console.error("Failed to delete product:", error);
        throw error;
    }
};

/**
 * Bulk updates or creates products.
 * Corresponds to: bulkUpdateProducts()
 */
export const bulkUpdateProducts = async (productsToUpdate: BulkProductData[]): Promise<Product[]> => {
    try {
        const response = await api.post<BulkUpdateResponse>('/products/bulk-update', productsToUpdate);
        return response.data.data; // Returns the list of updated/created products
    } catch (error) {
        console.error("Failed to bulk update products:", error);
        throw error;
    }
};

/**
 * Decreases stock for multiple items.
 * Corresponds to: decreaseProductStock()
 */
export const decreaseProductStock = async (items: StockItem[]): Promise<void> => {
    try {
        // Note: items param now uses StockItem interface with productId: string
        await api.post<DecreaseStockResponse>('/products/decrease-stock', items);
        // No return value, as per your original function
    } catch (error) {
        console.error("Failed to decrease product stock:", error);
        throw error;
    }
};
