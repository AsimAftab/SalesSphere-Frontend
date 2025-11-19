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
    data: FullAnalyticsData | null;
    loading: boolean;
    error: string | null;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    selectedYear: string;
}

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

const AnalyticsSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div className="flex flex-col h-full w-full">

                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        <Skeleton width={160} height={32} />
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">

                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ height: "55%" }}>

                        <div className="lg:col-span-3 flex flex-col h-full">

                            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                <Skeleton height={22} width={150} className="mb-3" />
                                <Skeleton height={35} borderRadius={8} className="mb-3" />
                                <Skeleton height={35} borderRadius={8} />
                            </div>

                            <div className="flex flex-col gap-6 flex-grow">
                                <Skeleton height={100} borderRadius={12} />
                                <Skeleton height={100} borderRadius={12} />
                            </div>
                        </div>

                        <div className="lg:col-span-9 h-full">
                            <Skeleton height={"100%"} borderRadius={12} />
                        </div>
                    </div>

                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="h-full min-h-[400px]">
                            <Skeleton height={"100%"} borderRadius={12} />
                        </div>

                        <div className="h-full min-h-[400px]">
                            <Skeleton height={"100%"} borderRadius={12} />
                        </div>

                        <div className="h-full min-h-[400px]">
                            <Skeleton height={"100%"} borderRadius={12} />
                        </div>

                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};


const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
    data, loading, error, selectedMonth, setSelectedMonth, selectedYear
}) => {
    
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
                                    className="w-1/2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-secondary focus:border-secondary bg-white"
                                >
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                
                            </div>
                        </div>
                        
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
                    </motion.div>
                    <motion.div 
                        className="lg:col-span-9 h-full" 
                        variants={cardVariants}
                    >
                        <SalesOrderPerformanceChart data={salesOrderPerformance} month={currentMonth} />
                    </motion.div>
                </div>

                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6"> 
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
                    <motion.div 
                        className="h-full min-h-[400px]" 
                        variants={cardVariants}
                    >
                        <TopPartiesCard data={topParties} />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default AnalyticsContent;