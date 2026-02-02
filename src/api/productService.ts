import api from './api';
import { API_ENDPOINTS } from './endpoints';

export interface ProductImage {
  public_id: string;
  url: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
}

export interface Product {
  id: string; // Decoupled from backend '_id'
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
  productName: string;
  qty: number;
  price: number;
  category: string;
  serialNo?: string;
  imageUrl?: string;
}

// --- 2. Backend API Interfaces (Raw Shape) ---

interface ApiProduct {
  _id: string;
  productName: string;
  price: number;
  qty: number;
  serialNo?: string;
  isActive: boolean;
  organizationId: string;
  createdBy: string | { _id: string; name: string };
  image: ProductImage;
  category: ProductCategory;
}


// --- 3. Mapper Logic (Data Transformation Layer) ---

// Add these formatting methods to your existing ProductMapper class
/**
 * ProductMapper - Transforms data between backend API shape and frontend domain models.
 * Handles all data transformation logic for products.
 */
export class ProductMapper {
  /**
   * Transforms an API product response to frontend Product model.
   * Handles populated fields (createdBy can be object or string) and provides fallbacks for missing data.
   * 
   * @param apiProduct - Raw product data from backend API
   * @returns Normalized Product object for frontend use
   */
  static toFrontend(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct._id,
      productName: apiProduct.productName,
      price: apiProduct.price,
      qty: apiProduct.qty,
      serialNo: apiProduct.serialNo || 'N/A', // Centralized fallback
      isActive: apiProduct.isActive,
      organizationId: apiProduct.organizationId,
      createdBy: typeof apiProduct.createdBy === 'object' ? apiProduct.createdBy.name : apiProduct.createdBy || 'Unknown',
      image: apiProduct.image,
      category: apiProduct.category || { _id: '', name: 'N/A' } // Centralized fallback
    };
  }

  /**
   * Formats a number as Indian Rupees currency.
   * 
   * @param amount - Numeric amount to format
   * @returns Formatted currency string (e.g., "RS 1,234.56")
   * @example
   * ProductMapper.formatCurrency(1234.5) // "RS 1,234.50"
   */
  static formatCurrency(amount: number): string {
    return `RS ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }

  /**
   * Formats stock quantity with units.
   * 
   * @param qty - Quantity to format
   * @returns Formatted stock string (e.g., "5 units")
   */
  static formatStock(qty: number): string {
    return `${qty} units`;
  }

  /**
   * Converts product form data to FormData for multipart/form-data submission.
   * Only appends fields that are defined to avoid sending undefined values.
   * 
   * @param data - Product form data from create or update forms
   * @returns FormData object ready for API submission
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

// --- 4. Centralized Endpoints ---

const ENDPOINTS = {
  CATEGORIES: API_ENDPOINTS.products.CATEGORIES,
  PRODUCTS: API_ENDPOINTS.products.BASE,
  PRODUCT_BY_ID: API_ENDPOINTS.products.DETAIL,
  BULK_IMPORT: API_ENDPOINTS.products.BULK_IMPORT,
  BULK_DELETE: API_ENDPOINTS.products.BULK_DELETE,
};

// --- 5. Repository Pattern (Strict Types, No Try-Catch noise) ---

export const ProductRepository = {
  // Categories (Kept simple for now)
  async getCategories(): Promise<Category[]> {
    const response = await api.get(ENDPOINTS.CATEGORIES);
    return response.data.data;
  },

  async createCategory(categoryName: string): Promise<Category> {
    const response = await api.post(ENDPOINTS.CATEGORIES, { name: categoryName });
    return response.data.data;
  },

  // Products
  async getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
    const response = await api.get(ENDPOINTS.PRODUCTS, { params: options });

    const apiData = response.data.data || response.data;
    if (Array.isArray(apiData)) {
      return apiData.map(ProductMapper.toFrontend);
    }
    return [];
  },

  async addProduct(productData: NewProductFormData): Promise<Product> {
    const formData = ProductMapper.toFormData(productData);
    const response = await api.post(ENDPOINTS.PRODUCTS, formData);
    return ProductMapper.toFrontend(response.data.data);
  },

  async updateProduct(productId: string, updateData: UpdateProductFormData): Promise<Product> {
    const formData = ProductMapper.toFormData(updateData);
    const response = await api.put(ENDPOINTS.PRODUCT_BY_ID(productId), formData);
    return ProductMapper.toFrontend(response.data.data);
  },

  async deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(ENDPOINTS.PRODUCT_BY_ID(productId));
    return response.data;
  },

  async bulkUpdateProducts(productsToUpdate: BulkProductData[]): Promise<{ success: boolean, data: Product[] }> {
    const response = await api.post(ENDPOINTS.BULK_IMPORT, {
      products: productsToUpdate
    });
    let mappedData = response.data.data;
    if (Array.isArray(mappedData)) {
      mappedData = mappedData.map((p: ApiProduct) => ProductMapper.toFrontend(p));
    }
    return { ...response.data, data: mappedData };
  },

  async bulkDeleteProducts(productIds: string[]): Promise<{ success: boolean }> {
    // Note: Backend controller expects { productIds }
    const response = await api.delete(ENDPOINTS.BULK_DELETE, {
      data: { productIds },
    });
    return response.data;
  }

};

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