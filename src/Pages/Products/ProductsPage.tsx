import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProductContent from './ProductContent';
// Import all the necessary functions and types from your service
import { getProducts, addProduct, updateProduct, deleteProduct, type Product } from '../../api/productService';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load product data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- LOGIC TO HANDLE ADDING A PRODUCT ---
  const handleAddProduct = async (newProductData: Omit<Product, 'id' | 'imageUrl'> & { imageUrl: string | null }) => {
    try {
      // In a real app, you would upload the image file and get a URL back from the server.
      // For this mock setup, we'll just use the blob URL provided by the modal.
      const productToAdd = {
        ...newProductData,
        imageUrl: newProductData.imageUrl || 'https://placehold.co/40x40/cccccc/ffffff?text=N/A'
      };
      
      const savedProduct = await addProduct(productToAdd);
      // Add the new product to the top of the list in the UI
      setProducts(prevProducts => [savedProduct, ...(prevProducts || [])]);
    } catch (error) {
      console.error("Failed to add product:", error);
      // You could show an error message to the user here
    }
  };

  // --- LOGIC TO HANDLE UPDATING A PRODUCT ---
  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const savedProduct = await updateProduct(updatedProduct);
      // Find and update the product in the local state to refresh the UI
      setProducts(prevProducts =>
        prevProducts?.map(p => (p.id === savedProduct.id ? savedProduct : p)) || null
      );
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  // --- LOGIC TO HANDLE DELETING A PRODUCT ---
  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      // Remove the product from the local state to refresh the UI
      setProducts(prevProducts => prevProducts?.filter(p => p.id !== productId) || null);
    } catch (error) {
      console.error("Failed to delete product:", error);
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
      />
    </Sidebar>
  );
};

export default ProductsPage;

