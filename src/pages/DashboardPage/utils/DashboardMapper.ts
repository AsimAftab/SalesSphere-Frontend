import { type FullDashboardData } from '@/api/dashboard';
import { type StatCardData } from '../hooks/useDashboardViewState';

/**
 * Transforms raw dashboard data into valid StatCardData objects for the UI.
 * This function encapsulates all "Presentation Logic" for the stat cards,
 * keeping the data fetching hook pure.
 * 
 * @param data - The full dashboard data object from the API
 * @returns An array of StatCardData objects ready for rendering
 */
export const transformToStatCards = (data: FullDashboardData | undefined): StatCardData[] => {
    if (!data?.stats) return [];

    const { stats } = data;

    return [
        {
            title: "Total No. of Parties",
            value: stats.totalParties,
            iconType: 'parties',
            iconBgColor: 'bg-blue-100',
            link: '/parties',
        },
        {
            title: "Today's Total Parties",
            value: stats.totalPartiesToday,
            iconType: 'parties',
            iconBgColor: 'bg-blue-100',
            link: '/parties?filter=today',
        },
        {
            title: "Today's Total Orders",
            value: stats.totalOrdersToday,
            iconType: 'orders',
            iconBgColor: 'bg-purple-100',
            link: '/order-lists?filter=today',
        },
        {
            title: 'Total Pending Orders',
            value: stats.pendingOrders,
            iconType: 'pending',
            iconBgColor: 'bg-orange-100',
            link: '/order-lists?status=pending',
        },
        {
            title: "Today's Total Order Value",
            value: `Rs ${Number(stats.totalSalesToday).toLocaleString('en-IN')}`,
            iconType: 'revenue',
            iconBgColor: 'bg-green-100',
        },
    ];
};
