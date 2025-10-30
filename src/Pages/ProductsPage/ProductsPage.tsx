import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProductContent from './ProductContent';
// Import all the necessary functions and types from your service
import { 
    getProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    bulkUpdateProducts, 
    type Product,
    type NewProductData, // Make sure to export this type from your service
    type BulkProductData // Make sure to export this type from your service
} from '../../api/productService';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Reusable function to fetch and set products
    const fetchProducts = useCallback(async () => {
        try {
            // No need to set loading here if only used for initial load
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load product data. Please try again later.');
            console.error(err);
        }
    }, []);

    // Fetch initial data
    useEffect(() => {
        const initialLoad = async () => {
            setLoading(true);
            await fetchProducts();
            setLoading(false);
        };
        initialLoad();
    }, [fetchProducts]);

    // --- LOGIC TO HANDLE ADDING A PRODUCT ---
    const handleAddProduct = async (newProductData: NewProductData) => {
        try {
            const savedProduct = await addProduct(newProductData);
            // Add the new product to the top of the list in the UI
            setProducts(prevProducts => [savedProduct, ...(prevProducts || [])]);
        } catch (error) {
            console.error("Failed to add product:", error);
            setError("Could not save the new product. Please try again.");
            // Re-throw error so modal can show it
            throw error;
        }
    };

    // --- LOGIC TO HANDLE UPDATING A PRODUCT ---
    const handleUpdateProduct = async (updatedProduct: Product) => {
        try {
            const savedProduct = await updateProduct(updatedProduct);
            // FIX: Use _id for comparison
            setProducts(prevProducts =>
                prevProducts?.map(p => (p._id === savedProduct._id ? savedProduct : p)) || null
            );
        } catch (error) {
            console.error("Failed to update product:", error);
            setError("Could not update the product. Please try again.");
            // Re-throw error so modal can show it
            throw error;
        }
    };

    // --- LOGIC TO HANDLE DELETING A PRODUCT ---
    // FIX: productId must be a string
    const handleDeleteProduct = async (productId: string) => { 
        try {
            await deleteProduct(productId);
            // FIX: Use _id for comparison
            setProducts(prevProducts => prevProducts?.filter(p => p._id !== productId) || null);
        } catch (error) {
            console.error("Failed to delete product:", error);
            setError("Could not delete the product. Please try again.");
        }
    };

    // --- LOGIC TO HANDLE BULK UPDATING PRODUCTS ---
    const handleBulkUpdate = async (productsToUpdate: BulkProductData[]) => {
        try {
            // The service now returns the full updated list.
            const updatedProductList = await bulkUpdateProducts(productsToUpdate);
            // Directly set the state with the new list to trigger a re-render.
            setProducts(updatedProductList);
        } catch (error) {
            console.error("Failed to bulk update products:", error);
            // Propagate the error up to be caught by the file handler in ProductContent
            throw new Error("The server failed to process the bulk update.");
        }
    };

    return (
        <Sidebar>
            {/* Pass all the data and the handler functions down to the content component */}
            <ProductContent
                data={products}
                loading={loading}
                error={error}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onBulkUpdate={handleBulkUpdate}
            />
        </Sidebar>
    );
};

export default ProductsPage;

