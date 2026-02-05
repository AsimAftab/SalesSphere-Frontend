import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

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
  id: string;
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

/**
 * ProductMapper - Transforms data between backend API shape and frontend domain models.
 */
export class ProductMapper {
  /**
   * Transforms an API product response to frontend Product model.
   */
  static toFrontend(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct._id,
      productName: apiProduct.productName,
      price: apiProduct.price,
      qty: apiProduct.qty,
      serialNo: apiProduct.serialNo || 'N/A',
      isActive: apiProduct.isActive,
      organizationId: apiProduct.organizationId,
      createdBy: typeof apiProduct.createdBy === 'object' ? apiProduct.createdBy.name : apiProduct.createdBy || 'Unknown',
      image: apiProduct.image,
      category: apiProduct.category || { _id: '', name: 'N/A' }
    };
  }

  /**
   * Formats a number as Indian Rupees currency.
   */
  static formatCurrency(amount: number): string {
    return `RS ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }

  /**
   * Formats stock quantity with units.
   */
  static formatStock(qty: number): string {
    return `${qty} units`;
  }

  /**
   * Converts product form data to FormData for multipart/form-data submission.
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

// --- 4. Endpoint Configuration ---

const PRODUCT_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.products.BASE,
  DETAIL: API_ENDPOINTS.products.DETAIL,
  BULK_DELETE: API_ENDPOINTS.products.BULK_DELETE,
};

// --- 5. ProductRepositoryClass - Extends BaseRepository ---

/**
 * ProductRepositoryClass - Extends BaseRepository for standard CRUD operations.
 */
class ProductRepositoryClass extends BaseRepository<Product, ApiProduct, NewProductFormData, UpdateProductFormData> {
  protected readonly endpoints = PRODUCT_ENDPOINTS;

  protected mapToFrontend(apiData: ApiProduct): Product {
    return ProductMapper.toFrontend(apiData);
  }

  protected mapToPayload(data: NewProductFormData | UpdateProductFormData): FormData {
    return ProductMapper.toFormData(data);
  }

  // --- Entity-specific methods ---

  /**
   * Fetches all product categories.
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get(API_ENDPOINTS.products.CATEGORIES);
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch categories');
    }
  }

  /**
   * Creates a new product category.
   */
  async createCategory(categoryName: string): Promise<Category> {
    try {
      const response = await api.post(API_ENDPOINTS.products.CATEGORIES, { name: categoryName });
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create category');
    }
  }

  /**
   * Fetches products with optional filtering.
   */
  async getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
    try {
      const response = await api.get(this.endpoints.BASE, { params: options });
      const apiData = response.data.data || response.data;
      if (Array.isArray(apiData)) {
        return apiData.map(ProductMapper.toFrontend);
      }
      return [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch products');
    }
  }

  /**
   * Bulk updates/imports multiple products.
   */
  async bulkUpdateProducts(productsToUpdate: BulkProductData[]): Promise<{ success: boolean; data: Product[] }> {
    try {
      const response = await api.post(API_ENDPOINTS.products.BULK_IMPORT, {
        products: productsToUpdate
      });
      let mappedData = response.data.data;
      if (Array.isArray(mappedData)) {
        mappedData = mappedData.map((p: ApiProduct) => ProductMapper.toFrontend(p));
      }
      return { ...response.data, data: mappedData };
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to bulk update products');
    }
  }

  /**
   * Bulk deletes multiple products.
   */
  async bulkDeleteProducts(productIds: string[]): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(API_ENDPOINTS.products.BULK_DELETE, {
        data: { productIds },
      });
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to bulk delete products');
    }
  }
}

// Create singleton instance
const productRepositoryInstance = new ProductRepositoryClass();

// --- 6. ProductRepository - Public API maintaining backward compatibility ---

export const ProductRepository = {
  // Category methods
  getCategories: () => productRepositoryInstance.getCategories(),
  createCategory: (categoryName: string) => productRepositoryInstance.createCategory(categoryName),

  // Standard CRUD (from BaseRepository)
  getProducts: (options?: GetProductsOptions) => productRepositoryInstance.getProducts(options),
  addProduct: (productData: NewProductFormData) => productRepositoryInstance.create(productData),
  updateProduct: (productId: string, updateData: UpdateProductFormData) => productRepositoryInstance.update(productId, updateData),
  deleteProduct: (productId: string) => productRepositoryInstance.delete(productId),

  // Bulk operations
  bulkUpdateProducts: (productsToUpdate: BulkProductData[]) => productRepositoryInstance.bulkUpdateProducts(productsToUpdate),
  bulkDeleteProducts: (productIds: string[]) => productRepositoryInstance.bulkDeleteProducts(productIds),
};

// --- 7. Clean Named Exports ---

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
