import api from './api';

// --- TYPE INTERFACES ---

// For the top stat cards
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
// For both of the product-related pie charts
export interface TopProduct {
    name: string;
    value: number;
    color: string; 
}
export type TopProductsSoldData = TopProduct[];
// For the "Top Parties of the Month" list
export interface TopParty {
    id: string; // From API or generated
    initials: string; // Calculated
    name: string;
    sales: number;
    orders: number;
}
export type TopPartiesData = TopParty[];

// --- Main Interface for All Analytics Data ---
export interface FullAnalyticsData {
    stats: AnalyticsStats;
    salesOrderPerformance: SalesOrderPerformanceData;
    topProductsSold: TopProductsSoldData;
    newTopProductsSold: TopProductsSoldData; 
    topParties: TopPartiesData;
    currentMonth: string;
}

// --- UTILITY FUNCTIONS ---

// Function to generate initials from a name (e.g., "Agrawal Traders" -> "AT")
const getInitials = (name: string | null | undefined): string => {
    // Check if name is defined and is a string before attempting to split.
    if (!name || typeof name !== 'string') {
        return 'NA'; // Return a safe placeholder like 'NA' (Not Available)
    }
    
    return name.split(/\s+/)
               .map(word => word[0])
               .join('')
               .toUpperCase()
               .slice(0, 2);
}

// Function to generate consistent colors for the pie charts (using your existing colors)
const PRODUCT_COLORS = ['#16a34a', '#f97316', '#3b82f6', '#dc2626', '#9333ea'];
let colorIndex = 0;
const getColor = () => PRODUCT_COLORS[colorIndex++ % PRODUCT_COLORS.length];

// Helper to convert month name (e.g., "January") to number (1-12)
const getMonthNumber = (month: string, year: string): number => {
     return new Date(Date.parse(month + " 1, " + year)).getMonth() + 1;
}

// --- REAL API FETCHING FUNCTIONS (Individual Calls) ---

export const fetchMonthlyOverview = async (month: string, year: string): Promise<AnalyticsStats> => {
    const monthNumber = getMonthNumber(month, year);
    
    const response = await api.get('/analytics/monthly-overview', {
        params: { month: monthNumber, year },
    });
    
    // Map the API response structure to the required AnalyticsStats
    return {
        totalOrderValue: response.data.data.totalOrderValue,
        totalOrders: response.data.data.totalOrders,
    };
};

export const fetchSalesTrend = async (month: string, year: string): Promise<SalesOrderPerformanceData> => {
    const monthNumber = getMonthNumber(month, year);

    const response = await api.get('/analytics/sales-trend', {
        params: { month: monthNumber, year },
    });

    // Map the API response (week: string, sales: number) to the frontend type
    return response.data.data.map((item: { week: string, sales: number }) => ({
        name: item.week,
        salesAmount: item.sales,
    }));
};

export const fetchProductsSoldByCategory = async (month: string, year: string): Promise<TopProductsSoldData> => {
    const monthNumber = getMonthNumber(month, year);
    colorIndex = 0; // Reset color index for this chart

    const response = await api.get('/analytics/products-by-category', {
        params: { month: monthNumber, year },
    });

    // Map the API response (category: string, quantity: number) to the frontend type
    return response.data.data.categories.map((item: { category: string, quantity: number }) => ({
        name: item.category,
        value: item.quantity,
        color: getColor(),
    }));
};

export const fetchTopProductsSold = async (month: string, year: string): Promise<TopProductsSoldData> => {
    const monthNumber = getMonthNumber(month, year);
    colorIndex = 0; // Reset color index for this chart

    const response = await api.get('/analytics/top-products', {
        params: { month: monthNumber, year },
    });

    // Map the API response (product: string, quantity: number) to the frontend type
    return response.data.data.products.map((item: { product: string, quantity: number }) => ({
        name: item.product,
        value: item.quantity,
        color: getColor(),
    }));
};

// --- FIXED INTERFACE FOR BACKEND RESPONSE ---
interface TopPartyBackendResponse {
    partyId: string;
    partyName: string;
    totalOrderValue: number;
    totalOrders: number;
}

export const fetchTopParties = async (month: string, year: string): Promise<TopPartiesData> => {
    const monthNumber = getMonthNumber(month, year);

    const response = await api.get('/analytics/top-parties', {
        params: { month: monthNumber, year },
    });

  
    const partiesData: TopPartyBackendResponse[] = response.data.data || [];

    return partiesData
        
        .filter((party): party is TopPartyBackendResponse => !!party && typeof party.partyName === 'string' && party.partyName.length > 0)
        .map(party => ({
            
            id: party.partyId, 
            initials: getInitials(party.partyName), 
    
            name: party.partyName,                 
            sales: party.totalOrderValue ?? 0,     
            orders: party.totalOrders ?? 0,        
        }));
};


export const fetchFullAnalyticsData = async (month: string, year: string): Promise<FullAnalyticsData> => {
    const [stats, salesOrderPerformance, topProductsSold, newTopProductsSold, topParties] = await Promise.all([
        fetchMonthlyOverview(month, year),
        fetchSalesTrend(month, year),
        fetchProductsSoldByCategory(month, year),
        fetchTopProductsSold(month, year), 
        fetchTopParties(month, year),
    ]);

    return {
        stats,
        salesOrderPerformance,
        topProductsSold,
        newTopProductsSold, 
        topParties,
        currentMonth: month,
    };
};