// For the two small stat cards at the top
export interface AnalyticsStats {
    totalOrderValue: number;
    totalOrders: number;
}

// For the main "Sales Order Performance" line chart
export interface SalesOrderPerformanceDataPoint {
    name: string; // e.g., "Week 1", "Week 2"
    salesAmount: number;
}
export type SalesOrderPerformanceData = SalesOrderPerformanceDataPoint[];

// For the "Order Status Distribution" pie chart
export interface OrderStatus {
    name: 'Delivered' | 'Pending' | 'Processing' | 'Cancelled';
    value: number; // The count of orders
    color: string;
}
export type OrderStatusDistributionData = OrderStatus[];


// For both of the product-related pie charts
export interface TopProduct {
    name: string;
    value: number;
    color: string;
}
export type TopProductsSoldData = TopProduct[];


// For the "Top Parties of the Month" list
export interface TopParty {
    id: string;
    initials: string;
    name: string;
    sales: number;
    orders: number;
}
export type TopPartiesData = TopParty[];


// --- Main Interface for All Analytics Data ---
export interface FullAnalyticsData {
    stats: AnalyticsStats;
    salesOrderPerformance: SalesOrderPerformanceData;
    orderStatusDistribution: OrderStatusDistributionData;
    topProductsSold: TopProductsSoldData;
    newTopProductsSold: TopProductsSoldData; // Using the same data type
    topParties: TopPartiesData;
    currentMonth: string;
}


// --- Mock Data Generation ---

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockSalesPerformance = (): SalesOrderPerformanceData => {
    const data = [];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
    for (const week of weeks) {
        data.push({
            name: week,
            salesAmount: randomInt(3000, 8000),
        });
    }
    return data;
}

const generateMockTopParties = (): TopPartiesData => {
    const parties = [
        { name: "Agrawal Traders", initials: "AT" },
        { name: "Sharma Traders", initials: "ST" },
        { name: "Singh Brothers", initials: "SB" },
        { name: "Raj Traders", initials: "RT" },
    ];
    return parties.map(p => ({
        id: crypto.randomUUID(),
        ...p,
        sales: randomInt(20000, 35000),
        orders: randomInt(30, 60),
    }));
}


// --- Mock API Fetch Function ---

export const getFullAnalyticsData = async (month: string, year: string): Promise<FullAnalyticsData> => {
    // Simulate a network delay for the refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Fetching new data for ${month} ${year}...`); // For debugging

    const mockData: FullAnalyticsData = {
        stats: {
            totalOrderValue: randomInt(350000, 500000),
            totalOrders: randomInt(1100, 1600),
        },
        salesOrderPerformance: generateMockSalesPerformance(),
        currentMonth: month, // Use the passed month for the chart title
        orderStatusDistribution: [
            { name: 'Delivered', value: randomInt(700, 900), color: '#22c55e' },
            { name: 'Pending', value: randomInt(250, 400), color: '#f97316' },
            { name: 'Processing', value: randomInt(80, 150), color: '#3b82f6' },
            { name: 'Cancelled', value: randomInt(30, 70), color: '#ef4444' },
        ],
        topProductsSold: [
            { name: 'Electronics', value: randomInt(1100, 1400), color: '#16a34a' },
            { name: 'Clothing', value: randomInt(800, 1100), color: '#f97316' },
            { name: 'Home & Garden', value: randomInt(500, 750), color: '#3b82f6' },
            { name: 'Sports', value: randomInt(350, 550), color: '#dc2626' },
            { name: 'Books', value: randomInt(200, 350), color: '#9333ea' },
        ],
        newTopProductsSold: [
            { name: 'Pipes', value: randomInt(1000, 1500), color: '#16a34a' },
            { name: 'Connectors', value: randomInt(400, 600), color: '#f97316' },
            { name: 'Others', value: randomInt(100, 200), color: '#dc2626' },
            { name: 'Bolts', value: randomInt(50, 100), color: '#3b82f6' },
        ],
        topParties: generateMockTopParties(),
    };

    if (Math.random() > 0.95) {
        throw new Error("Failed to fetch analytics data from the server.");
    }

    return mockData;
};


// import api from './api'; // 1. Import your configured Axios instance

// // For the two small stat cards at the top
// export interface AnalyticsStats {
//     totalOrderValue: number;
//     totalOrders: number;
// }

// // For the main "Sales Order Performance" line chart
// export interface SalesOrderPerformanceDataPoint {
//     name: string; // e.g., "Week 1", "Week 2"
//     salesAmount: number;
// }
// export type SalesOrderPerformanceData = SalesOrderPerformanceDataPoint[];

// // For the "Order Status Distribution" pie chart
// export interface OrderStatus {
//     name: 'Delivered' | 'Pending' | 'Processing' | 'Cancelled';
//     value: number; // The count of orders
//     color: string;
// }
// export type OrderStatusDistributionData = OrderStatus[];


// // For both of the product-related pie charts
// export interface TopProduct {
//     name: string;
//     value: number;
//     color: string;
// }
// export type TopProductsSoldData = TopProduct[];


// // For the "Top Parties of the Month" list
// export interface TopParty {
//     id: string;
//     initials: string;
//     name: string;
//     sales: number;
//     orders: number;
// }
// export type TopPartiesData = TopParty[];


// // --- Main Interface for All Analytics Data ---
// // This interface is crucial. Your backend API MUST return a JSON object
// // that exactly matches this shape for the code to work correctly.
// export interface FullAnalyticsData {
//     stats: AnalyticsStats;
//     salesOrderPerformance: SalesOrderPerformanceData;
//     orderStatusDistribution: OrderStatusDistributionData;
//     topProductsSold: TopProductsSoldData;
//     newTopProductsSold: TopProductsSoldData;
//     topParties: TopPartiesData;
//     currentMonth: string;
// }


// // --- REAL API FETCH FUNCTION ---
// // This is the only function you need to change.
// export const getFullAnalyticsData = async (month: string, year: string): Promise<FullAnalyticsData> => {
//     try {
//         // 2. Make a GET request to your backend's analytics endpoint.
//         // The month and year are passed as query parameters.
//         const response = await api.get<FullAnalyticsData>('/analytics', {
//             params: {
//                 month,
//                 year,
//             },
//         });

//         // 3. Return the data from the API response.
//         // Your Axios interceptor will automatically handle the JWT for authentication.
//         return response.data;

//     } catch (error) {
//         // The error will be caught by the calling component (AnalyticsPage)
//         console.error("Failed to fetch analytics data from API:", error);
//         throw new Error("Could not retrieve analytics data.");
//     }
// };
