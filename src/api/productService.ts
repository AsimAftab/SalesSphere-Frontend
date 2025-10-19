// This is the main data structure for a single product
export interface Product {
  id: number;
  imageUrl: string;
  name: string;
  category: string;
  price: number;
  piece: number;
}

// --- MOCK DATABASE ---
let mockProducts: Product[] = [
    { id: 1, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 2, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    { id: 3, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 4, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    { id: 5, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 6, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    { id: 7, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 8, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    { id: 9, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 10, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    { id: 11, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 12, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    { id: 13, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 14, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    { id: 15, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 16, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    

    // ... other mock products
];

// --- GET ALL PRODUCTS ---
export const getProducts = async (): Promise<Product[]> => {
  console.log("Fetching all products...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockProducts];
};

// --- ADD A NEW PRODUCT ---
export const addProduct = async (newProductData: Omit<Product, 'id'>): Promise<Product> => {
    console.log("API: Adding new product...", newProductData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProduct: Product = {
        id: Math.max(0, ...mockProducts.map(p => p.id)) + 1,
        ...newProductData,
    };
    mockProducts.unshift(newProduct);
    return newProduct;
};

// --- UPDATE AN EXISTING PRODUCT ---
export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    console.log("API: Updating product...", updatedProduct);
    await new Promise(resolve => setTimeout(resolve, 500));
    mockProducts = mockProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    return updatedProduct;
};

// --- DELETE A PRODUCT ---
export const deleteProduct = async (productId: number): Promise<{ success: boolean }> => {
    console.log("API: Deleting product with ID:", productId);
    await new Promise(resolve => setTimeout(resolve, 500));
    mockProducts = mockProducts.filter(p => p.id !== productId);
    return { success: true };
};

// --- BULK UPDATE PRODUCTS ---
export const bulkUpdateProducts = async (productsToUpdate: any[]): Promise<Product[]> => {
    console.log("API: Bulk updating products...", productsToUpdate);
    await new Promise(resolve => setTimeout(resolve, 500));

    productsToUpdate.forEach(productData => {
        const existingProductIndex = mockProducts.findIndex(p => p.name.toLowerCase() === productData.name.toLowerCase());
        if (existingProductIndex !== -1) {
            mockProducts[existingProductIndex].piece += productData.piece;
        } else {
            const newProduct: Product = {
                id: Math.max(0, ...mockProducts.map(p => p.id)) + 1,
                name: productData.name,
                category: productData.category,
                price: productData.price,
                piece: productData.piece,
                imageUrl: 'https://placehold.co/40x40/cccccc/ffffff?text=N/A',
            };
            mockProducts.unshift(newProduct);
        }
    });
    
    return [...mockProducts];
};

// --- FIX: ADDED AND EXPORTED the missing function ---
/**
 * Decreases the stock ('piece' count) for a list of products.
 * @param items - An array of objects with productId and quantity.
 */
export const decreaseProductStock = async (items: { productId: number; quantity: number }[]): Promise<void> => {
    console.log("PRODUCT SERVICE: Decreasing stock for order items...", items);
    await new Promise(resolve => setTimeout(resolve, 100));

    items.forEach(item => {
        const productIndex = mockProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
            mockProducts[productIndex].piece -= item.quantity;
        } else {
            console.warn(`PRODUCT SERVICE: Product with ID ${item.productId} not found.`);
        }
    });
};

