import apiClient from './api';
import { API_ENDPOINTS } from './endpoints';

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

// --- 2. Mapper Logic (Logic Preservation) ---

class InvoiceMapper {
  /**
   * Maps InvoiceListItem to the Order type used by OrderListContent.tsx
   * Preserves the exact Date formatting logic from your original code.
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

// --- 3. Centralized Endpoints ---

const ENDPOINTS = {
  BASE: API_ENDPOINTS.invoices.BASE,
  DETAIL: API_ENDPOINTS.invoices.DETAIL,
  STATUS: API_ENDPOINTS.invoices.STATUS,
};

// --- 4. Repository Pattern ---

export const InvoiceRepository = {
  async getOrders(): Promise<Order[]> {
    console.log("Fetching all invoices from API...");
    const response = await apiClient.get<{ success: boolean; data: InvoiceListItem[] }>(ENDPOINTS.BASE);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data.map(InvoiceMapper.toOrder);
    }
    return [];
  },

  async getOrderById(invoiceId: string): Promise<InvoiceData | null> {
    console.log(`Fetching details for invoice ID: ${invoiceId}`);
    try {
      const response = await apiClient.get<{ success: boolean; data: InvoiceData }>(ENDPOINTS.DETAIL(invoiceId));
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch invoice ${invoiceId}:`, error);
      return null;
    }
  },

  async updateOrderStatus(invoiceId: string, newStatus: OrderStatus): Promise<InvoiceData> {
    console.log(`API: Updating status for invoice ${invoiceId} to ${newStatus}`);
    const response = await apiClient.put<{ success: boolean; data: InvoiceData }>(
      ENDPOINTS.STATUS(invoiceId), 
      { status: newStatus }
    );
    return response.data.data;
  },
};

// --- 5. Clean Named Exports ---

export const {
  getOrders,
  getOrderById,
  updateOrderStatus
} = InvoiceRepository;