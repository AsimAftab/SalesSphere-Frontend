import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../components/UI/EmptyState/EmptyState';
import { type FullAnalyticsData } from '../../api/analyticsService';
import AnalyticsSkeleton from './AnalyticsSkeleton';
import AnalyticsStatCard from '../../components/cards/Analytics_cards/AnalyticsStatCard';
import SalesOrderPerformanceChart from '../../components/cards/Analytics_cards/SalesOrderPerformanceChart';
import ProductsSoldByCategoryChart from '../../components/cards/Analytics_cards/ProductsSoldByCategoryChart';
import TopPartiesCard from '../../components/cards/Analytics_cards/TopPartiesCard';
import dollarIcon from '../../assets/Image/icons/dollar-icon.svg';
// Placeholder for cart icon if not found, usually in same dir
import cartIcon from '../../assets/Image/icons/cart-icon.svg';

const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface AnalyticsContentProps {
    state: {
        loading: boolean;
        error: string | null;
        data: FullAnalyticsData | null;
        selectedYear: number;
        selectedMonth: string;
    };
    actions: {
        setSelectedMonth: (month: string) => void;
    };
    permissions: {
        canViewMonthlyOverview: boolean;
        canViewSalesTrend: boolean;
        canViewCategorySales: boolean;
        canViewTopProducts: boolean;
        canViewTopParties: boolean;
    };
}

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ state, actions, permissions }) => {
    const { loading, error, data, selectedYear, selectedMonth } = state;
    const { setSelectedMonth } = actions;

    if (loading) {
        return <AnalyticsSkeleton permissions={permissions} />;
    }
    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }
    if (!data) {
        return (
            <EmptyState
                title="No Analytics Data"
                description="No analytics data available for the selected period."
                icon={
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                }
            />
        );
    }

    const { stats, salesOrderPerformance, topProductsSold, newTopProductsSold, topParties, currentMonth } = data;
    const hasSalesData = stats.totalOrderValue > 0 || stats.totalOrders > 0;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="mb-6 flex-shrink-0 ">
                <h1 className="text-3xl font-bold text-black">Analytics</h1>
            </div>

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden"
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
            >
                <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ height: '55%' }}>

                    <motion.div
                        className="lg:col-span-3 flex flex-col justify-between h-full"
                        variants={cardVariants}
                    >
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex-shrink-0">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Select Month & Year</label>
                            <div className="flex flex-col space-y-3">
                                <div
                                    className="w-1/2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 font-semibold flex items-center justify-center h-10"
                                >
                                    {selectedYear}
                                </div>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary bg-white"
                                >
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        {permissions.canViewMonthlyOverview && (
                            <div className="flex flex-col gap-6 flex-grow">
                                {hasSalesData ? (
                                    <>
                                        <AnalyticsStatCard title="Total Order Value" value={`₹${stats.totalOrderValue.toLocaleString('en-IN')}`} icon={<img src={dollarIcon} alt="Total Order Value" className="h-6 w-6" />} iconBgColor='bg-green-100' />
                                        <AnalyticsStatCard title="Total Orders" value={stats.totalOrders.toLocaleString('en-IN')} icon={<img src={cartIcon} alt="Total Orders" className="h-6 w-6" />} iconBgColor='bg-blue-100' />
                                    </>
                                ) : (
                                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-full text-gray-500 text-center">
                                        No sales data to display for the selected period.
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {permissions.canViewSalesTrend && (
                        <motion.div
                            className="lg:col-span-9 h-full"
                            variants={cardVariants}
                        >
                            <SalesOrderPerformanceChart data={salesOrderPerformance} month={currentMonth} />
                        </motion.div>
                    )}
                </div>

                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {permissions.canViewCategorySales && (
                        <motion.div
                            className="h-full min-h-[400px]"
                            variants={cardVariants}
                        >
                            <ProductsSoldByCategoryChart
                                data={topProductsSold}
                                title="Products Sold by Category"
                                subtitle="Current month category breakdown"
                                legendTitle1="Category"
                                legendTitle2="Qty"
                            />
                        </motion.div>
                    )}

                    {permissions.canViewTopProducts && (
                        <motion.div
                            className="h-full min-h-[400px]"
                            variants={cardVariants}
                        >
                            <ProductsSoldByCategoryChart
                                data={newTopProductsSold}
                                title="Top Products Sold"
                                subtitle="Current month product breakdown"
                                legendTitle1="Products"
                                legendTitle2="Qty"
                            />
                        </motion.div>
                    )}

                    {permissions.canViewTopParties && (
                        <motion.div
                            className="h-full min-h-[400px]"
                            variants={cardVariants}
                        >
                            <TopPartiesCard data={topParties} />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AnalyticsContent;