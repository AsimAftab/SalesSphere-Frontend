import apiClient from './api'; // Assuming your client is here

export type InvoiceStatus = 'pending' | 'in progress' | 'in transit' | 'completed' | 'rejected';

/**
 * Represents an item within an invoice.
 * Based on invoiceItemSchema.
 */
export interface InvoiceItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discount: number; // Add this field
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
  party: string; // Party ID
  organizationName: string;
  organizationPanVatNumber: string;
  organizationAddress: string;
  organizationPhone: string;
  partyName: string;
  partyOwnerName: string;
  partyAddress: string;
  partyPanVatNumber: string;
  invoiceNumber: string;
  expectedDeliveryDate: string; // This is a Date string
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: InvoiceStatus;
  organizationId: string;
  createdBy: CreatedByUser;
  createdAt: string; // This is a Date string
  updatedAt: string; // This is a Date string
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


// This is for OrderListContent.tsx
export type Order = InvoiceListItem & { 
    id: string; // Alias _id to id
    dateTime: string; // Alias createdAt to dateTime
};

export type OrderStatus = InvoiceStatus;

export type InvoiceData = Invoice;



export const getOrders = async (): Promise<Order[]> => {
  console.log("Fetching all invoices from API...");
  const response = await apiClient.get<{ success: boolean; data: InvoiceListItem[] }>('/invoices');
  
  // Map the backend data to the frontend 'Order' type
  return response.data.data.map((inv: InvoiceListItem) => ({
    ...inv,
    id: inv._id, // Alias _id to id
    dateTime: new Date(inv.createdAt).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
  }));
};


export const getOrderById = async (invoiceId: string): Promise<InvoiceData | null> => {
  console.log(`Fetching details for invoice ID: ${invoiceId}`);
  const response = await apiClient.get<{ success: boolean; data: InvoiceData }>
(`/invoices/${invoiceId}`);
  return response.data.data;
};


export const updateOrderStatus = async (invoiceId: string, newStatus: OrderStatus): Promise<InvoiceData> => {
  console.log(`API: Updating status for invoice ${invoiceId} to ${newStatus}`);
  const response = await apiClient.put<{ success: boolean; data: InvoiceData }>
(`/invoices/${invoiceId}/status`, { status: newStatus });
  return response.data.data;
};