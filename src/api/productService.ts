import api from './api';

// --- 1. Interface Segregation ---

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
  category: string; 
  price: number;
  qty: number;
  serialNo?: string;
  image?: File; 
}

export interface UpdateProductFormData {
  productName?: string;
  category?: string; 
  price?: number;
  qty?: number;
  serialNo?: string;
  image?: File;
}

export interface GetProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
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

export interface StockItem {
  productId: string;
  quantity: number;
}

// --- 2. Mapper Logic (Logic Preservation) ---

class ProductMapper {
  /**
   * Transforms product data into FormData for Multipart/Form-Data requests
   * Preserves existing logic for appending conditional fields.
   */
  static toFormData(data: NewProductFormData | UpdateProductFormData): FormData {
    const formData = new FormData();
    
    if (data.productName) formData.append('productName', data.productName);
    if (data.category) formData.append('category', data.category);
    
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.qty !== undefined) formData.append('qty', data.qty.toString());
    
    if (data.serialNo) formData.append('serialNo', data.serialNo);
    if (data.image) formData.append('image', data.image);
    
    return formData;
  }
}

// --- 3. Centralized Endpoints ---

const ENDPOINTS = {
  CATEGORIES: '/categories',
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  BULK_IMPORT: '/products/bulk-import',
  BULK_DELETE: '/products/bulk-delete',
};

// --- 4. Repository Pattern ---

export const ProductRepository = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get(ENDPOINTS.CATEGORIES);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  },

  async createCategory(categoryName: string): Promise<Category> {
    try {
      const response = await api.post(ENDPOINTS.CATEGORIES, { name: categoryName });
      return response.data.data;
    } catch (error) {
      console.error("Failed to create category:", error);
      throw error;
    }
  },

  async getProducts(options: GetProductsOptions = {}): Promise<any> {
    try {
      const response = await api.get(ENDPOINTS.PRODUCTS, { params: options });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    }
  },

  async addProduct(productData: NewProductFormData): Promise<Product> {
    try {
      const formData = ProductMapper.toFormData(productData);
      const response = await api.post(ENDPOINTS.PRODUCTS, formData);
      return response.data.data;
    } catch (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
  },

  async updateProduct(productId: string, updateData: UpdateProductFormData): Promise<Product> {
    try {
      const formData = ProductMapper.toFormData(updateData);
      const response = await api.put(ENDPOINTS.PRODUCT_BY_ID(productId), formData);
      return response.data.data;
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(ENDPOINTS.PRODUCT_BY_ID(productId));
      return response.data;
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  },

  async bulkUpdateProducts(productsToUpdate: BulkProductData[]): Promise<any> {
    try {
      const response = await api.post(ENDPOINTS.BULK_IMPORT, { 
        products: productsToUpdate 
      });
      return response.data;
    } catch (error) {
      console.error("Failed to bulk update products:", error);
      throw error;
    }
  },

  async bulkDeleteProducts(productIds: string[]): Promise<any> {
    try {
      const response = await api.delete(ENDPOINTS.BULK_DELETE, {
        data: { productIds },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to bulk delete products:", error);
      throw error;
    }
  }
};

// --- 5. Clean Named Exports ---

export const {
  getCategories,
  createCategory,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
  bulkDeleteProducts
} = ProductRepository;