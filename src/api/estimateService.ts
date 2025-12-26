import apiClient from './api';
import { type CreatedByUser, type OrderStatus } from './orderService';

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
  partyOwnerName: string;         // ADDED: Fixes image_253e41.png
  partyPanVatNumber: string;      // ADDED: Fixes image_253e41.png
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
  organizationPanVatNumber: string; // ADDED: Fixes image_253e41.png
}

/**
 * GET ALL ESTIMATES
 */
export const getEstimates = async (): Promise<Estimate[]> => {
  const response = await apiClient.get<{ success: boolean; data: Estimate[] }>('/invoices/estimates');
  return response.data.data.map((est) => ({
    ...est,
    id: est._id,
    dateTime: new Date(est.createdAt).toLocaleDateString(),
  }));
};

/**
 * GET SINGLE ESTIMATE
 */
export const getEstimateById = async (id: string): Promise<Estimate> => {
  const response = await apiClient.get<{ success: boolean; data: Estimate }>(`/invoices/estimates/${id}`);
  const est = response.data.data;
  return { ...est, id: est._id, dateTime: new Date(est.createdAt).toLocaleDateString() };
};

/**
 * CREATE ESTIMATE
 */
export const createEstimate = async (estimateData: CreateEstimateInput): Promise<Estimate> => {
  const response = await apiClient.post<{ success: boolean; data: Estimate }>('/invoices/estimates', estimateData);
  return {
    ...response.data.data,
    id: response.data.data._id
  };
};

/**
 * DELETE ESTIMATE
 */
export const deleteEstimate = async (id: string): Promise<void> => {
  await apiClient.delete(`/invoices/estimates/${id}`);
};

/**
 * CONVERT TO INVOICE (ORDER)
 */
export const convertEstimateToOrder = async (id: string, deliveryDate: string): Promise<any> => {
  const response = await apiClient.post<{ success: boolean; data: any }>(
    `/invoices/estimates/${id}/convert`, 
    { expectedDeliveryDate: deliveryDate }
  );
  return response.data.data;
};

/**
 * BULK DELETE ESTIMATES
 */
export const bulkDeleteEstimates = async (estimateIds: string[]): Promise<any> => {
  const response = await apiClient.delete<{ success: boolean; data: any }>(
    '/invoices/estimates/bulk-delete', 
    { data: { estimateIds } }
  );
  return response.data;
};