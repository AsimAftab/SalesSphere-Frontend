import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';
import { type FullAnalyticsData } from '../../../api/salesDashboardService';
import { type StatCardData } from './components/useSalesViewState';
import SalesSkeleton from './components/SalesSkeleton';
import StatCard from '../../../components/UI/shared_cards/StatCard';
import SalesOrderPerformanceChart from './components/SalesOrderPerformanceChart';
import ProductsSoldByCategoryChart from './components/ProductsSoldByCategoryChart';
import TopPartiesCard from './components/TopPartiesCard';
import DropDown from '../../../components/UI/DropDown/DropDown';

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

interface SalesContentProps {
    state: {
        loading: boolean;
        error: string | null;
        data: FullAnalyticsData | null;
        selectedYear: number;
        selectedMonth: string;
        statCardsData: StatCardData[];
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

const SalesContent: React.FC<SalesContentProps> = ({ state, actions, permissions }) => {
    const { loading, error, data, selectedYear, selectedMonth } = state;
    const { setSelectedMonth } = actions;

    if (loading) {
        return <SalesSkeleton permissions={permissions} />;
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

    const { salesOrderPerformance, topProductsSold, newTopProductsSold, topParties, currentMonth } = data;
    // Removed hasSalesData check as requested - Stat cards will render even with 0 values

    return (
        <div className="flex flex-col w-full">
            {/* Page Header */}
            <div className="mb-6 flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                    Sales Analytics
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                    Track revenue performance, order trends, and sales distribution.
                </p>
            </div>

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow pb-6 2xl:pb-0"
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
            >
                <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">

                    <motion.div
                        className="lg:col-span-3 flex flex-col justify-between h-full"
                        variants={cardVariants}
                    >
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-100 shadow-sm mb-6 flex-shrink-0">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-pre-line mb-3">Select Month & Year</label>
                            <div className="flex space-x-3">
                                <div
                                    className="w-1/3 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 font-semibold flex items-center justify-center h-10"
                                >
                                    {selectedYear}
                                </div>
                                <div className="flex-1">
                                    <DropDown
                                        value={selectedMonth}
                                        onChange={(val) => setSelectedMonth(val)}
                                        options={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => ({
                                            value: month,
                                            label: month
                                        }))}
                                        className="h-10"
                                        triggerClassName="!min-h-0 h-10 py-0 !rounded-lg border-gray-300 text-sm font-medium text-gray-800"
                                        hideScrollbar={true}
                                        placeholder="Select Month"
                                    />
                                </div>
                            </div>
                        </div>

                        {permissions.canViewMonthlyOverview && (
                            <div className="flex flex-col gap-6 flex-grow">
                                {state.statCardsData.map((card) => (
                                    <StatCard
                                        key={card.title}
                                        title={card.title}
                                        value={card.value}
                                        icon={card.icon}
                                        iconBgColor={card.iconBgColor}
                                    />
                                ))}
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
                            className="h-[23rem]"
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
                            className="h-[23rem]"
                            variants={cardVariants}
                        >
                            <ProductsSoldByCategoryChart
                                data={newTopProductsSold}
                                title="Top 5 Products Sold of the Month"
                                subtitle="Current month product breakdown"
                                legendTitle1="Products"
                                legendTitle2="Qty"
                            />
                        </motion.div>
                    )}

                    {permissions.canViewTopParties && (
                        <motion.div
                            className="h-[23rem]"
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

export default SalesContent;