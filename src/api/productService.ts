//import api from './api';

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
// In a real app, this data would live on your server.
let mockProducts: Product[] = [
    { id: 1, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=AW', name: 'Apple Watch Series 4', category: 'Digital Product', price: 690, piece: 63 },
    { id: 2, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=MH', name: 'Microsoft Headsquare', category: 'Digital Product', price: 190, piece: 13 },
    { id: 3, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=WD', name: 'Women\'s Dress', category: 'Fashion', price: 640, piece: 635 },
    { id: 4, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=SA', name: 'Samsung A50', category: 'Mobile', price: 400, piece: 67 },
    { id: 5, imageUrl: 'https://placehold.co/40x40/1F2937/FFF?text=C', name: 'Camera', category: 'Electronic', price: 420, piece: 52 },
    ...Array.from({ length: 73 }, (_, i) => ({ id: i + 6, imageUrl: `https://placehold.co/40x40/333/FFF?text=P${i+6}`, name: `Product ${i+6}`, category: 'General', price: 100 + i*5, piece: 20 + i })),
];

// --- GET ALL PRODUCTS ---
export const getProducts = async (): Promise<Product[]> => {
  console.log("Fetching all products...");
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return mockProducts;
};

// --- ADD A NEW PRODUCT ---
export const addProduct = async (newProductData: Omit<Product, 'id'>): Promise<Product> => {
    console.log("API: Adding new product...", newProductData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProduct: Product = {
        id: Math.max(...mockProducts.map(p => p.id)) + 1, // Simulate generating a new ID
        ...newProductData,
    };
    mockProducts = [newProduct, ...mockProducts]; // Add to the start of the list
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

