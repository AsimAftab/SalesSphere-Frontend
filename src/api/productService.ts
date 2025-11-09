import api from './api';

// --- INTERFACES ---
export interface ProductImage {
  public_id: string;
  url: string;
}
export interface ProductCategory {
  _id: string;
  name: string;
}
export interface Product {
  _id: string;
  productName: string;
  price: number;
  qty: number;
  serialNo?: string;
  isActive: boolean;
  organizationId: string;
  createdBy: string;
  image: ProductImage;
  category: ProductCategory;
}
export interface Category {
  _id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
export interface NewProductFormData {
  productName: string;
  category: string; // This is the category NAME
  price: number;
  qty: number;
  serialNo?: string;
  image?: File; 
}
export interface UpdateProductFormData {
  productName?: string;
  category?: string; // This is the category NAME
  price?: number;
  qty?: number;
  serialNo?: string;
  image?: File;
}
export interface GetProductsOptions {
  page?: number;
  limit?: number;
  category?: string; // Category ID for filtering
  isActive?: boolean;
  search?: string;
}
export interface BulkProductData {
  name: string;
  piece: number;
  price: number;
  category: string;
  imageUrl?: string;
}

// --- ADDED: Interface for decrease stock ---
export interface StockItem {
  productId: string; // Product _id
  quantity: number; // Amount to decrease
}


// --- RESPONSE INTERFACES ---
export interface GetProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}
interface ProductResponse {
  success: boolean;
  data: Product;
}
interface GetCategoriesResponse {
  success: boolean;
  count: number;
  data: Category[];
}
interface CategoryResponse {
  success: boolean;
  data: Category;
}
interface DeleteResponse {
  success: boolean;
  message: string;
}
interface BulkUpdateResponse {
  success: boolean;
  data: Product[];
}




export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<GetCategoriesResponse>('/categories');
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

export const createCategory = async (categoryName: string): Promise<Category> => {
  try {
    const response = await api.post<CategoryResponse>('/categories', { name: categoryName });
    return response.data.data;
  } catch (error) {
    console.error("Failed to create category:", error);
    throw error;
  }
};

export const getProducts = async (
  options: GetProductsOptions = {}
): Promise<GetProductsResponse> => {
  try {
    const response = await api.get<GetProductsResponse>('/products', {
      params: options,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

export const addProduct = async (
  productData: NewProductFormData
): Promise<Product> => {
  const formData = new FormData();
  formData.append('productName', productData.productName);
  formData.append('category', productData.category);
  formData.append('price', productData.price.toString());
  formData.append('qty', productData.qty.toString());
  if (productData.image) {
    formData.append('image', productData.image);
  }
  if (productData.serialNo) {
    formData.append('serialNo', productData.serialNo);
  }
  try {
    const response = await api.post<ProductResponse>('/products', formData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to add product:", error);
    throw error;
  }
};

export const updateProduct = async (
  productId: string,
  updateData: UpdateProductFormData
): Promise<Product> => {
  const formData = new FormData();
  if (updateData.productName) {
    formData.append('productName', updateData.productName);
  }
  if (updateData.category) {
    formData.append('category', updateData.category);
  }
  if (updateData.price !== undefined) {
    formData.append('price', updateData.price.toString());
  }
  if (updateData.qty !== undefined) {
    formData.append('qty', updateData.qty.toString());
  }
  if (updateData.serialNo) {
    formData.append('serialNo', updateData.serialNo);
  }
  if (updateData.image) {
    formData.append('image', updateData.image);
  }
  try {
    const response = await api.put<ProductResponse>(
      `/products/${productId}`,
      formData
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
};

export const deleteProduct = async (
  productId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<DeleteResponse>(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
};

export const bulkUpdateProducts = async (productsToUpdate: BulkProductData[]): Promise<Product[]> => {
    try {
        const response = await api.post<BulkUpdateResponse>('/products/bulk-update', productsToUpdate);
        return response.data.data;
    } catch (error) {
        console.error("Failed to bulk update products:", error);
        throw error;
    }
};

