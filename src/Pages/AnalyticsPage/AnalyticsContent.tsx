import React from 'react';
import { motion } from 'framer-motion';
import { type FullAnalyticsData } from '../../api/analyticsService';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AnalyticsStatCard from '../../components/cards/Analytics_cards/AnalyticsStatCard';
import SalesOrderPerformanceChart from '../../components/cards/Analytics_cards/SalesOrderPerformanceChart';
import ProductsSoldByCategoryChart from '../../components/cards/Analytics_cards/ProductsSoldByCategoryChart';
import TopPartiesCard from '../../components/cards/Analytics_cards/TopPartiesCard';
import dollarIcon from '../../assets/Image/icons/dollar-icon.svg';
import cartIcon from '../../assets/Image/icons/cart-icon.svg';

interface AnalyticsContentProps {
    // Props 
    data: FullAnalyticsData | null;
    loading: boolean;
    error: string | null;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
}

// --- Animation Variants ---
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

// --- AnalyticsSkeleton Component ---
const AnalyticsSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div>
                {/* Skeleton for Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        <Skeleton width={150} />
                    </h1>
                </div>
                {/* Skeleton for Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* --- Top Row Parent --- */}
                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        <div className="lg:col-span-3 flex flex-col justify-between">
                            <div className="p-4 mb-6">
                                <Skeleton height={120} borderRadius={12} />
                            </div>
                            <div className="flex flex-col gap-6">
                                <Skeleton height={100} borderRadius={12} />
                                <Skeleton height={100} borderRadius={12} />
                            </div>
                        </div>
                        <div className="lg:col-span-9">
                            <Skeleton height={360} borderRadius={12} /> 
                        </div>
                    </div>
                    {/* --- Bottom Row of Cards --- */}
                    <div className="lg:col-span-4">
                        <Skeleton height={400} borderRadius={12} />
                    </div>
                    <div className="lg:col-span-4">
                        <Skeleton height={400} borderRadius={12} />
                    </div>
                    <div className="lg:col-span-4">
                        <Skeleton height={400} borderRadius={12} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};


const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
    data, loading, error, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear
}) => {
    
    // --- Loading/Error/NoData Logic ---
    if (loading) {
        return <AnalyticsSkeleton />;
    }
    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }
    if (!data) {
        return <div className="text-center p-10 text-gray-500">No analytics data available.</div>;
    }

    const { stats, salesOrderPerformance, topProductsSold, newTopProductsSold, topParties, currentMonth } = data;

    // --- This is the MODIFIED section ---
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-black">Analytics</h1>
            </div>

            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-12 gap-6" // This is the main grid
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
            >

                {/* --- STAT CARDS & FILTERS (Now a direct child) --- */}
                <motion.div 
                    className="lg:col-span-3 flex flex-col justify-between" 
                    variants={cardVariants}
                >
                    {/* --- FILTER UI --- */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Select Month & Year</label>
                        <div className="flex flex-col space-y-3">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                {[2025, 2024, 2023].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* --- STAT CARDS CONTAINER --- */}
                    <div className="flex flex-col gap-6">
                        <AnalyticsStatCard
                            title="Total Order Value"
                            value={`₹${stats.totalOrderValue.toLocaleString('en-IN')}`}
                            icon={<img src={dollarIcon} alt="Total Order Value" className="h-6 w-6" />}
                            iconBgColor='bg-green-100'
                        />
                        <AnalyticsStatCard
                            title="Total Orders"
                            value={stats.totalOrders.toLocaleString('en-IN')}
                            icon={<img src={cartIcon} alt="Total Orders" className="h-6 w-6" />}
                            iconBgColor='bg-blue-100'
                        />
                    </div>
                </motion.div>

                {/* --- SALES TREND CHART --- */}
                <motion.div 
                    className="lg:col-span-9" 
                    variants={cardVariants}
                >
                    <SalesOrderPerformanceChart data={salesOrderPerformance} month={currentMonth} />
                </motion.div>


                {/* --- BOTTOM ROW CARDS --- */}
                <motion.div className="lg:col-span-4" variants={cardVariants}>
                    <ProductsSoldByCategoryChart
                        data={topProductsSold}
                        title="Products Sold by Category"
                        subtitle="Current month category breakdown"
                        legendTitle1="Category"
                        legendTitle2="Qty"
                    />
                </motion.div>
                <motion.div className="lg:col-span-4" variants={cardVariants}>
                    <ProductsSoldByCategoryChart
                        data={newTopProductsSold}
                        title="Top Products Sold"
                        subtitle="Current month product breakdown"
                        legendTitle1="Products"
                        legendTitle2="Qty"
                    />
                </motion.div>
                <motion.div className="lg:col-span-4" variants={cardVariants}>
                    <TopPartiesCard data={topParties} />
                </motion.div>

            </motion.div>
        </div>
    );
};

export default AnalyticsContent;