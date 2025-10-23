import { decreaseProductStock } from './productService';

// --- TYPE DEFINITIONS ---
export type OrderStatus = 'In Progress' | 'Completed' | 'Rejected' | 'In Transit';

export interface Order {
  id: string;
  partyName: string;
  address: string;
  dateTime: string;
  status: OrderStatus;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  productName: string;
}

export interface FullOrder {
  id: number;
  customerName: string;
  items: OrderItem[];
  status: 'Pending' | 'Completed' | 'Cancelled';
  totalAmount: number;
  createdAt: Date;
}

export interface InvoiceData {
  from: { name: string; address: string; phone: string; email: string; taxId: string; };
  to: { name: string; contact: string; address: string; phone: string; email: string; };
  items: { desc: string; detail: string; qty: number; rate: number; }[];
  issueDate: string;
}

// --- MOCK DATABASES ---
let mockOrders: Order[] = [
  { id: '0001', partyName: 'Christine Brooks', address: '089 Kutch Green Apt. 448', dateTime: '04 Sep 2019 & 10:00', status: 'Completed' },
  { id: '0002', partyName: 'Rosie Pearson', address: '979 Immanuel Ferry Suite 526', dateTime: '28 May 2019 & 11:00', status: 'Completed' },
  // FIX: New mock orders now use the updated status list, including 'In Progress'
  ...Array.from({ length: 73 }, (_, i) => ({ id: `000${i + 3}`, partyName: `Customer ${i + 3}`, address: '123 Fake Street', dateTime: '01 Jan 2020 & 12:00', status: ['In Progress', 'Rejected', 'In Transit', 'Completed'][i % 4] as OrderStatus })),
];

let mockFullOrders: FullOrder[] = [
    { id: 101, customerName: 'John Doe', items: [{ productId: 1, quantity: 1, productName: 'Apple Watch Series 4' }], status: 'Completed', totalAmount: 690, createdAt: new Date() }
];
let nextOrderId = 102;

const mockInvoiceData: Record<string, InvoiceData> = {
    '00001': {
        from: { name: 'Digital Solutions Inc.', address: 'Lahan, Siraha 56502, Province No. 2, Nepal', phone: '+977-9800000000', email: 'billing@digitalsolutions.com', taxId: '12345678', },
        to: { name: 'Christine Brooks (Acme Corp)', contact: 'John Smith', address: 'Biratnagar, Morang 56613, Koshi Province, Nepal', phone: '+977-9800000000', email: 'accounts@acmecorp.com', },
        items: [
            { desc: 'Premium Website Development', detail: 'Custom responsive website with CMS integration', qty: 1, rate: 5500.00 },
            { desc: 'UI/UX Design Services', detail: 'Complete design system with interface mockups', qty: 1, rate: 2800.00 },
        ],
        issueDate: 'October 16, 2025',
    },
};

// --- SERVICE FUNCTIONS ---
export const getOrders = async (): Promise<Order[]> => {
    console.log("Fetching all orders...");
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockOrders];
};

export const getOrderById = async (orderId: string): Promise<InvoiceData | null> => {
    console.log(`Fetching details for order ID: ${orderId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockInvoiceData[orderId] || mockInvoiceData['00001'];
};

export const createOrder = async (customerName: string, items: Omit<OrderItem, 'productName'>[]): Promise<FullOrder> => {
    console.log("ORDER SERVICE: Creating new order...");
    await new Promise(resolve => setTimeout(resolve, 500)); 

    await decreaseProductStock(items.map(i => ({ productId: i.productId, quantity: i.quantity })));
    console.log("ORDER SERVICE: Stock successfully decreased.");

    const newOrder: FullOrder = {
        id: nextOrderId++,
        customerName,
        items: items.map(item => ({ ...item, productName: `Product ID: ${item.productId}`})),
        status: 'Completed', // Note: This is for a different order type, can be adjusted
        totalAmount: 0,
        createdAt: new Date(),
    };

    mockFullOrders.unshift(newOrder);
    return newOrder;
};

// --- NEW FUNCTION TO UPDATE ORDER STATUS ---
export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<Order> => {
    console.log(`API: Updating status for order ${orderId} to ${newStatus}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
        throw new Error("Order not found");
    }

    mockOrders[orderIndex].status = newStatus;
    return { ...mockOrders[orderIndex] };
};

