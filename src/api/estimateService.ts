import api from './api';
import { type CreatedByUser, type OrderStatus } from './orderService';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

// --- 1. Interfaces ---

export interface EstimateItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface CreateEstimateInput {
  partyId: string;
  discount?: number;
  items: {
    productId: string;
    quantity: number;
    price?: number;
    discount?: number;
  }[];
}

export interface Estimate {
  _id: string;
  id: string;
  estimateNumber: string;
  partyName: string;
  partyAddress: string;
  partyOwnerName: string;
  partyPanVatNumber: string;
  items: EstimateItem[];
  totalAmount: number;
  subtotal: number;
  discount: number;
  status: OrderStatus;
  createdAt: string;
  dateTime: string;
  createdBy: CreatedByUser;
  organizationName: string;
  organizationAddress: string;
  organizationPhone: string;
  organizationPanVatNumber: string;
}

// --- 2. API Response Interface ---

interface ApiEstimateResponse {
  _id: string;
  estimateNumber: string;
  partyName: string;
  partyAddress: string;
  partyOwnerName: string;
  partyPanVatNumber: string;
  items: EstimateItem[];
  totalAmount: number;
  subtotal: number;
  discount: number;
  status: OrderStatus;
  createdAt: string;
  createdBy: CreatedByUser;
  organizationName: string;
  organizationAddress: string;
  organizationPhone: string;
  organizationPanVatNumber: string;
}

// --- 3. Mapper Logic ---

/**
 * EstimateMapper - Transforms data between backend API shape and frontend domain models.
 */
class EstimateMapper {
  static toFrontend(apiEstimate: ApiEstimateResponse): Estimate {
    return {
      ...apiEstimate,
      id: apiEstimate._id,
      dateTime: new Date(apiEstimate.createdAt).toLocaleDateString(),
    };
  }
}

// --- 4. Endpoint Configuration ---

const ESTIMATE_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.invoices.ESTIMATES_BASE,
  DETAIL: API_ENDPOINTS.invoices.ESTIMATE_DETAIL,
  BULK_DELETE: API_ENDPOINTS.invoices.ESTIMATES_BULK_DELETE,
};

// --- 5. EstimateRepositoryClass - Extends BaseRepository ---

/**
 * EstimateRepositoryClass - Extends BaseRepository for standard CRUD operations.
 */
class EstimateRepositoryClass extends BaseRepository<Estimate, ApiEstimateResponse, CreateEstimateInput, Partial<CreateEstimateInput>> {
  protected readonly endpoints = ESTIMATE_ENDPOINTS;

  protected mapToFrontend(apiData: ApiEstimateResponse): Estimate {
    return EstimateMapper.toFrontend(apiData);
  }

  // Override delete to return void
  async deleteEstimate(id: string): Promise<void> {
    try {
      await api.delete(this.endpoints.DETAIL(id));
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete estimate');
    }
  }

  // --- Entity-specific methods ---

  /**
   * Converts an estimate to an invoice (order).
   */
  async convertEstimateToOrder(id: string, deliveryDate: string): Promise<unknown> {
    try {
      const response = await api.post(
        API_ENDPOINTS.invoices.ESTIMATE_CONVERT(id),
        { expectedDeliveryDate: deliveryDate }
      );
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to convert estimate to order');
    }
  }

  /**
   * Bulk deletes multiple estimates.
   */
  async bulkDeleteEstimates(estimateIds: string[]): Promise<unknown> {
    try {
      const response = await api.delete(
        API_ENDPOINTS.invoices.ESTIMATES_BULK_DELETE,
        { data: { estimateIds } }
      );
      return response.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to bulk delete estimates');
    }
  }
}

// Create singleton instance
const estimateRepositoryInstance = new EstimateRepositoryClass();

// --- 6. EstimateRepository - Public API maintaining backward compatibility ---

export const EstimateRepository = {
  // Standard CRUD (from BaseRepository)
  getEstimates: () => estimateRepositoryInstance.getAll(),
  getEstimateById: (id: string) => estimateRepositoryInstance.getById(id),
  createEstimate: (estimateData: CreateEstimateInput) => estimateRepositoryInstance.create(estimateData),
  deleteEstimate: (id: string) => estimateRepositoryInstance.deleteEstimate(id),

  // Entity-specific methods
  convertEstimateToOrder: (id: string, deliveryDate: string) =>
    estimateRepositoryInstance.convertEstimateToOrder(id, deliveryDate),
  bulkDeleteEstimates: (estimateIds: string[]) =>
    estimateRepositoryInstance.bulkDeleteEstimates(estimateIds),
};

// --- 7. Clean Named Exports ---

export const {
  getEstimates,
  getEstimateById,
  createEstimate,
  deleteEstimate,
  convertEstimateToOrder,
  bulkDeleteEstimates
} = EstimateRepository;
