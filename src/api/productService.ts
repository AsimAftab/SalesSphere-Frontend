import api from './api';

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
  name: string;
  piece: number;
  price: number;
  category: string;
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
  createdBy: string;
  image: ProductImage;
  category: ProductCategory;
}


// --- 3. Mapper Logic (Data Transformation Layer) ---

// Add these formatting methods to your existing ProductMapper class
export class ProductMapper {
    static toFrontend(apiProduct: ApiProduct): Product {
        return {
            id: apiProduct._id,
            productName: apiProduct.productName,
            price: apiProduct.price,
            qty: apiProduct.qty,
            serialNo: apiProduct.serialNo || 'N/A', // Centralized fallback
            isActive: apiProduct.isActive,
            organizationId: apiProduct.organizationId,
            createdBy: apiProduct.createdBy,
            image: apiProduct.image,
            category: apiProduct.category || { _id: '', name: 'N/A' } // Centralized fallback
        };
    }

    // NEW: Centralized formatting logic
    static formatCurrency(amount: number): string {
        return `RS ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }

    static formatStock(qty: number): string {
        return `${qty} units`;
    }

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
  CATEGORIES: '/categories',
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  BULK_IMPORT: '/products/bulk-import',
  BULK_DELETE: '/products/bulk-delete',
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

  async bulkUpdateProducts(productsToUpdate: BulkProductData[]): Promise<{ success: boolean, data: any }> {
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