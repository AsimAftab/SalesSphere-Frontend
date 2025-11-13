// src/pages/AnalyticsContent.tsx

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

// --- Interface and Animation Constants (Required for compilation) ---

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

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        <Skeleton width={160} height={32} />
                    </h1>
                </div>

                {/* MAIN GRID (same as real content) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">

                    {/* ===================== TOP ROW (55%) ===================== */}
                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ height: "55%" }}>

                        {/* LEFT PANEL (Filters + Stat Cards) */}
                        <div className="lg:col-span-3 flex flex-col h-full">

                            {/* Filter Box */}
                            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                <Skeleton height={22} width={150} className="mb-3" />
                                <Skeleton height={35} borderRadius={8} className="mb-3" />
                                <Skeleton height={35} borderRadius={8} />
                            </div>

                            {/* Stat Cards (match spacing & flow) */}
                            <div className="flex flex-col gap-6 flex-grow">
                                <Skeleton height={100} borderRadius={12} />
                                <Skeleton height={100} borderRadius={12} />
                            </div>
                        </div>

                        {/* SALES TREND (Right side) */}
                        <div className="lg:col-span-9 h-full">
                            <Skeleton height={"100%"} borderRadius={12} />
                        </div>
                    </div>

                    {/* ===================== BOTTOM ROW (same height) ===================== */}
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

    return (
        // 🌟 FIX 1: Use h-full and remove all vertical padding here.
        // We will apply padding to the children instead.
        <div className="flex flex-col h-full w-full overflow-hidden"> 
            
            {/* Header: Apply top padding here (pt-6) and side padding (px-6) */}
            <div className="mb-6 flex-shrink-0 "> 
                <h1 className="text-3xl font-bold text-black">Analytics</h1>
            </div>

            <motion.div 
                // 🌟 FIX 2: Apply side and bottom padding here (px-6 pb-6).
                // flex-grow will ensure it consumes all remaining vertical space.
                // overflow-hidden prevents internal scrolling, forcing content to fit.
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden"
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
            >

                {/* --- STAT CARDS & SALES TREND (TOP ROW) --- */}
                {/* Fixed height distribution for the top row */}
                <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ height: '55%' }}> 
                    
                    {/* STAT CARDS & FILTERS (lg:col-span-3) */}
                    <motion.div 
                        className="lg:col-span-3 flex flex-col justify-between h-full" 
                        variants={cardVariants}
                    >
                        {/* Filter UI (flex-shrink-0) */}
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex-shrink-0">
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
                        
                        {/* STAT CARDS CONTAINER (flex-grow to fill remaining space in column) */}
                        <div className="flex flex-col gap-6 flex-grow">
                             <AnalyticsStatCard title="Total Order Value" value={`₹${stats.totalOrderValue.toLocaleString('en-IN')}`} icon={<img src={dollarIcon} alt="Total Order Value" className="h-6 w-6" />} iconBgColor='bg-green-100' />
                             <AnalyticsStatCard title="Total Orders" value={stats.totalOrders.toLocaleString('en-IN')} icon={<img src={cartIcon} alt="Total Orders" className="h-6 w-6" />} iconBgColor='bg-blue-100' />
                        </div>
                    </motion.div>

                    {/* SALES TREND CHART (lg:col-span-9) */}
                    <motion.div 
                        className="lg:col-span-9 h-full" // Use h-full to fit the 55% height
                        variants={cardVariants}
                    >
                        <SalesOrderPerformanceChart data={salesOrderPerformance} month={currentMonth} />
                    </motion.div>
                </div>

                {/* --- BOTTOM ROW CARDS (BOTTOM ROW) --- */}
                {/* Fixed height distribution for the bottom row */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6"> 
    
                    {/* Card 1: Products Sold by Category */}
                    <motion.div 
                        // 🎯 FIX: Add min-h to guarantee space for the internal 280px chart
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
                    
                    {/* Card 2: Top Products Sold */}
                    <motion.div 
                        // 🎯 FIX: Add min-h to guarantee space for the internal 280px chart
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
                    
                    {/* Card 3: Top Parties */}
                    <motion.div 
                        // 🎯 FIX: Add min-h to guarantee space
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