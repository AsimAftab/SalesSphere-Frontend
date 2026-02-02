import apiClient from './api';
import { type CreatedByUser, type OrderStatus } from './orderService';
import { API_ENDPOINTS } from './endpoints';

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

/**
 * UPDATED INTERFACE
 * Added missing fields for PDF generation and Details Preview
 */
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

// Internal Response Interfaces
interface ApiListResponse {
  success: boolean;
  data: Estimate[];
}

interface ApiSingleResponse {
  success: boolean;
  data: Estimate;
}

interface ApiGenericResponse {
  success: boolean;
  data: unknown;
}

// --- 2. Mapper Logic ---
class EstimateMapper {
  static toFrontend(apiEstimate: Estimate): Estimate {
    return {
      ...apiEstimate,
      id: apiEstimate._id,
      dateTime: new Date(apiEstimate.createdAt).toLocaleDateString(),
    };
  }
}

// --- 3. Centralized Endpoints ---
const ENDPOINTS = {
  BASE: API_ENDPOINTS.invoices.ESTIMATES_BASE,
  DETAIL: API_ENDPOINTS.invoices.ESTIMATE_DETAIL,
  CONVERT: API_ENDPOINTS.invoices.ESTIMATE_CONVERT,
  BULK_DELETE: API_ENDPOINTS.invoices.ESTIMATES_BULK_DELETE,
};

// --- 4. Repository Pattern ---
export const EstimateRepository = {
  /**
   * GET ALL ESTIMATES
   */
  async getEstimates(): Promise<Estimate[]> {
    const response = await apiClient.get<ApiListResponse>(ENDPOINTS.BASE);
    return response.data.data.map(EstimateMapper.toFrontend);
  },

  /**
   * GET SINGLE ESTIMATE
   */
  async getEstimateById(id: string): Promise<Estimate> {
    const response = await apiClient.get<ApiSingleResponse>(ENDPOINTS.DETAIL(id));
    return EstimateMapper.toFrontend(response.data.data);
  },

  /**
   * CREATE ESTIMATE
   */
  async createEstimate(estimateData: CreateEstimateInput): Promise<Estimate> {
    const response = await apiClient.post<ApiSingleResponse>(ENDPOINTS.BASE, estimateData);
    return EstimateMapper.toFrontend(response.data.data);
  },

  /**
   * DELETE ESTIMATE
   */
  async deleteEstimate(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.DETAIL(id));
  },

  /**
   * CONVERT TO INVOICE (ORDER)
   */
  async convertEstimateToOrder(id: string, deliveryDate: string): Promise<unknown> {
    const response = await apiClient.post<ApiGenericResponse>(
      ENDPOINTS.CONVERT(id),
      { expectedDeliveryDate: deliveryDate }
    );
    return response.data.data;
  },

  /**
   * BULK DELETE ESTIMATES
   */
  async bulkDeleteEstimates(estimateIds: string[]): Promise<unknown> {
    const response = await apiClient.delete<ApiGenericResponse>(
      ENDPOINTS.BULK_DELETE,
      { data: { estimateIds } }
    );
    return response.data;
  }
};

// --- 5. Clean Named Exports ---
export const {
  getEstimates,
  getEstimateById,
  createEstimate,
  deleteEstimate,
  convertEstimateToOrder,
  bulkDeleteEstimates
} = EstimateRepository;