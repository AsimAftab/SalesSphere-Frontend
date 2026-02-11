import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

// --- 1. Interface Segregation ---

export type InvoiceStatus = 'pending' | 'in progress' | 'in transit' | 'completed' | 'rejected';

export interface InvoiceItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface CreatedByUser {
  _id: string;
  name: string;
  email: string;
  id: string;
}

export interface Invoice {
  _id: string;
  party: string;
  organizationName: string;
  organizationPanVatNumber: string;
  organizationAddress: string;
  organizationPhone: string;
  partyName: string;
  partyOwnerName: string;
  partyAddress: string;
  partyPanVatNumber: string;
  invoiceNumber: string;
  expectedDeliveryDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: InvoiceStatus;
  organizationId: string;
  createdBy: CreatedByUser;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListItem {
  _id: string;
  invoiceNumber: string;
  partyName: string;
  totalAmount: number;
  status: InvoiceStatus;
  createdAt: string;
  expectedDeliveryDate: string;
  createdBy: CreatedByUser;
}

export type Order = InvoiceListItem & {
  id: string;
  dateTime: string;
};

export type OrderStatus = InvoiceStatus;
export type InvoiceData = Invoice;

// --- 2. Mapper Logic ---

/**
 * InvoiceMapper - Transforms data between backend API shape and frontend domain models.
 */
class InvoiceMapper {
  /**
   * Maps InvoiceListItem to the Order type used by OrderListContent.tsx.
   */
  static toOrder(inv: InvoiceListItem): Order {
    return {
      ...inv,
      id: inv._id,
      totalAmount: Number(inv.totalAmount.toFixed(2)),
      dateTime: new Date(inv.createdAt).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    };
  }
}

// --- 3. Endpoint Configuration ---

const ORDER_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.invoices.BASE,
  DETAIL: API_ENDPOINTS.invoices.DETAIL,
};

// --- 4. OrderRepositoryClass - Extends BaseRepository ---

/**
 * OrderRepositoryClass - Extends BaseRepository for standard CRUD operations.
 */
class OrderRepositoryClass extends BaseRepository<Order, InvoiceListItem, never, never> {
  protected readonly endpoints = ORDER_ENDPOINTS;

  protected mapToFrontend(apiData: InvoiceListItem): Order {
    return InvoiceMapper.toOrder(apiData);
  }

  // --- Entity-specific methods ---

  /**
   * Fetches detailed information for a specific invoice.
   */
  async getOrderDetails(invoiceId: string): Promise<InvoiceData | null> {
    try {
      const response = await api.get<{ success: boolean; data: InvoiceData }>(this.endpoints.DETAIL(invoiceId));
      return response.data.data || null;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch order details');
    }
  }

  /**
   * Updates the status of an invoice.
   */
  async updateOrderStatus(invoiceId: string, newStatus: OrderStatus): Promise<InvoiceData> {
    try {
      const response = await api.put<{ success: boolean; data: InvoiceData }>(
        API_ENDPOINTS.invoices.STATUS(invoiceId),
        { status: newStatus }
      );
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update order status');
    }
  }
}

// Create singleton instance
const orderRepositoryInstance = new OrderRepositoryClass();

// --- 5. InvoiceRepository - Public API maintaining backward compatibility ---

export const InvoiceRepository = {
  // Standard CRUD (from BaseRepository)
  getOrders: () => orderRepositoryInstance.getAll(),

  // Entity-specific methods
  getOrderById: (invoiceId: string) => orderRepositoryInstance.getOrderDetails(invoiceId),
  updateOrderStatus: (invoiceId: string, newStatus: OrderStatus) =>
    orderRepositoryInstance.updateOrderStatus(invoiceId, newStatus),
};

// --- 6. Clean Named Exports ---

export const {
  getOrders,
  getOrderById,
  updateOrderStatus
} = InvoiceRepository;
