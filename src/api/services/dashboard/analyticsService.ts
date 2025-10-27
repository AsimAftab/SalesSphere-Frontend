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

// --- TYPES REMOVED ---
// The OrderStatus and OrderStatusDistributionData types were removed 
// as they are no longer used.

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
    // --- REMOVED: orderStatusDistribution ---
    topProductsSold: TopProductsSoldData;
    newTopProductsSold: TopProductsSoldData; // Using the same data type
    topParties: TopPartiesData;
    currentMonth: string;
}


// --- Mock Data Generation ---

// Secure random integer generator using crypto.getRandomValues()
const randomInt = (min: number, max: number) => {
  const range = max - min + 1;
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return min + (randomBuffer[0] % range);
};

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
    // --- MODIFIED: Added 5th party ---
    const parties = [
        { name: "Agrawal Traders", initials: "AT" },
        { name: "Sharma Traders", initials: "ST" },
        { name: "Singh Brothers", initials: "SB" },
        { name: "Raj Traders", initials: "RT" },
        { name: "New Traders", initials: "NT" }, // Added 5th party
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
        
        // --- REMOVED: orderStatusDistribution property ---

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