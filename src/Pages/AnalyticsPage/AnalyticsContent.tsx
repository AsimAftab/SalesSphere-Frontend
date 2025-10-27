import React from 'react';
import { type FullAnalyticsData } from '../../api/services/dashboard/analyticsService';

// --- Card Component Imports ---
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
    setSelectedYear: (year: string) => void;
}

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
    data, loading, error, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear
}) => {
    if (loading) {
        return <div className="text-center p-10 text-gray-500">Loading Analytics...</div>;
    }
    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }
    if (!data) {
        return <div className="text-center p-10 text-gray-500">No analytics data available.</div>;
    }

    const { stats, salesOrderPerformance, topProductsSold, newTopProductsSold, topParties, currentMonth } = data;

    return (
        <div>
            {/* --- HEADER NOW ONLY CONTAINS THE TITLE --- */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-black">Analytics</h1>
            </div>

            {/* --- MAIN GRID LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* --- PARENT DIV FOR TOP ROW ALIGNMENT --- */}
                <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* --- STAT CARDS & FILTERS COLUMN --- */}
                    <div className="lg:col-span-3 flex flex-col justify-between">
                        {/* --- FILTER UI (MOVED HERE) --- */}
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
                    </div>

                    {/* --- SALES TREND CHART --- */}
                    <div className="lg:col-span-9">
                        <SalesOrderPerformanceChart data={salesOrderPerformance} month={currentMonth} />
                    </div>
                </div>

                {/* --- BOTTOM ROW OF CARDS --- */}
                <div className="lg:col-span-4">
                    <ProductsSoldByCategoryChart
                        data={topProductsSold}
                        title="Products Sold by Category"
                        subtitle="Current month category breakdown"
                        legendTitle1="Category"
                        legendTitle2="Qty"
                    />
                </div>
                <div className="lg:col-span-4">
                    <ProductsSoldByCategoryChart
                        data={newTopProductsSold}
                        title="Top Products Sold"
                        subtitle="Current month product breakdown"
                        legendTitle1="Products"
                        legendTitle2="Qty"
                    />
                </div>
                <div className="lg:col-span-4">
                    <TopPartiesCard data={topParties} />
                </div>

            </div>
        </div>
    );
};

export default AnalyticsContent;