import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';

// --- TYPE INTERFACES ---

export interface AnalyticsStats {
    totalOrderValue: number;
    totalOrders: number;
}
export interface SalesOrderPerformanceDataPoint {
    name: string;
    salesAmount: number;
}
export type SalesOrderPerformanceData = SalesOrderPerformanceDataPoint[];

export interface TopProduct {
    [key: string]: string | number;
    name: string;
    value: number;
    color: string;
}
export type TopProductsSoldData = TopProduct[];

export interface TopParty {
    id: string;
    initials: string;
    name: string;
    sales: number;
    orders: number;
}
export type TopPartiesData = TopParty[];

export interface FullAnalyticsData {
    stats: AnalyticsStats;
    salesOrderPerformance: SalesOrderPerformanceData;
    topProductsSold: TopProductsSoldData;
    newTopProductsSold: TopProductsSoldData;
    topParties: TopPartiesData;
    currentMonth: string;
}

// --- ANALYTICS MAPPER (Domain Logic) ---

export class AnalyticsMapper {
    private static readonly PRODUCT_COLORS = ['#16a34a', '#f97316', '#3b82f6', '#dc2626', '#9333ea'];
    private static colorIndex = 0;

    static readonly INITIAL_STATS: AnalyticsStats = { totalOrderValue: 0, totalOrders: 0 };

    private static resetColors() {
        this.colorIndex = 0;
    }

    private static getColor() {
        return this.PRODUCT_COLORS[this.colorIndex++ % this.PRODUCT_COLORS.length];
    }

    static getMonthNumber(month: string, year: string): number {
        return new Date(Date.parse(month + " 1, " + year)).getMonth() + 1;
    }

    static getInitials(name: string | null | undefined): string {
        if (!name || typeof name !== 'string') return 'NA';
        return name.split(/\s+/).map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }

    // Mappers
    static toStats(data: { totalOrderValue?: number; totalOrders?: number } | null): AnalyticsStats {
        return {
            totalOrderValue: data?.totalOrderValue ?? 0,
            totalOrders: data?.totalOrders ?? 0,
        };
    }

    static toSalesTrend(data: { week: string; sales: number }[]): SalesOrderPerformanceData {
        if (!Array.isArray(data)) return [];
        return data.map((item) => ({
            name: item.week,
            salesAmount: item.sales
        }));
    }

    static toProductsByCategory(categories: { category: string; quantity: number }[]): TopProductsSoldData {
        this.resetColors();
        if (!Array.isArray(categories)) return [];
        return categories.map((item) => ({
            name: item.category,
            value: item.quantity,
            color: this.getColor(),
        }));
    }

    static toTopProducts(products: { product: string; quantity: number }[]): TopProductsSoldData {
        this.resetColors();
        if (!Array.isArray(products)) return [];
        return products.map((item) => ({
            name: item.product,
            value: item.quantity,
            color: this.getColor(),
        }));
    }

    static toTopParties(data: { partyId: string; partyName: string; totalOrderValue?: number; totalOrders?: number }[]): TopPartiesData {
        if (!Array.isArray(data)) return [];
        return data
            .filter(party => party && typeof party.partyName === 'string' && party.partyName.length > 0)
            .map(party => ({
                id: party.partyId,
                initials: this.getInitials(party.partyName),
                name: party.partyName,
                sales: party.totalOrderValue ?? 0,
                orders: party.totalOrders ?? 0,
            }));
    }
}

// --- FETCH FUNCTIONS ---

export const fetchMonthlyOverview = async (month: string, year: string): Promise<AnalyticsStats> => {
    try {
        const monthNumber = AnalyticsMapper.getMonthNumber(month, year);
        const response = await api.get(API_ENDPOINTS.analytics.MONTHLY_OVERVIEW, { params: { month: monthNumber, year } });
        return AnalyticsMapper.toStats(response.data.data);
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch monthly overview');
    }
};

export const fetchSalesTrend = async (month: string, year: string): Promise<SalesOrderPerformanceData> => {
    try {
        const monthNumber = AnalyticsMapper.getMonthNumber(month, year);
        const response = await api.get(API_ENDPOINTS.analytics.SALES_TREND, { params: { month: monthNumber, year } });
        return AnalyticsMapper.toSalesTrend(response.data.data);
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch sales trend');
    }
};

export const fetchProductsSoldByCategory = async (month: string, year: string): Promise<TopProductsSoldData> => {
    try {
        const monthNumber = AnalyticsMapper.getMonthNumber(month, year);
        const response = await api.get(API_ENDPOINTS.analytics.PRODUCTS_BY_CATEGORY, { params: { month: monthNumber, year } });
        return AnalyticsMapper.toProductsByCategory(response.data.data.categories);
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch products by category');
    }
};

export const fetchTopProductsSold = async (month: string, year: string): Promise<TopProductsSoldData> => {
    try {
        const monthNumber = AnalyticsMapper.getMonthNumber(month, year);
        const response = await api.get(API_ENDPOINTS.analytics.TOP_PRODUCTS, { params: { month: monthNumber, year } });
        return AnalyticsMapper.toTopProducts(response.data.data.products);
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch top products');
    }
};

export const fetchTopParties = async (month: string, year: string): Promise<TopPartiesData> => {
    try {
        const monthNumber = AnalyticsMapper.getMonthNumber(month, year);
        const response = await api.get(API_ENDPOINTS.analytics.TOP_PARTIES, { params: { month: monthNumber, year } });
        return AnalyticsMapper.toTopParties(response.data.data);
    } catch (error: unknown) {
        throw handleApiError(error, 'Failed to fetch top parties');
    }
};

// --- AGGREGATOR ---

export const fetchFullAnalyticsData = async (
    month: string,
    year: string,
    hasPermission?: (module: string, feature: string) => boolean
): Promise<FullAnalyticsData> => {

    // Default to strict (false) if no permission function provided
    const check = hasPermission || (() => false);

    // 1. Define promises with conditional logic based on permissions
    const statsPromise = check('analytics', 'viewStats')
        ? fetchMonthlyOverview(month, year)
        : Promise.resolve(AnalyticsMapper.INITIAL_STATS);

    const trendPromise = check('analytics', 'viewSalesTrend')
        ? fetchSalesTrend(month, year)
        : Promise.resolve([]);

    const categoryPromise = check('analytics', 'viewProductPerformance')
        ? fetchProductsSoldByCategory(month, year)
        : Promise.resolve([]);

    const topProductsPromise = check('analytics', 'viewProductPerformance')
        ? fetchTopProductsSold(month, year)
        : Promise.resolve([]);

    const topPartiesPromise = check('analytics', 'viewTopParties')
        ? fetchTopParties(month, year)
        : Promise.resolve([]);

    // 2. Execute parallel fetches with individual error isolation
    const [stats, salesOrderPerformance, topProductsSold, newTopProductsSold, topParties] = await Promise.all([
        statsPromise.catch(() => AnalyticsMapper.INITIAL_STATS),
        trendPromise.catch(() => []),
        categoryPromise.catch(() => []),
        topProductsPromise.catch(() => []),
        topPartiesPromise.catch(() => []),
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