import React from 'react';
import { type SalesTrendData } from '../../../api/dashboardService';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesTrendChartProps {
    data?: SalesTrendData[];
}

// Helper to format date string like "2025-10-09" to "Oct 9"
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => {
    const chartData = Array.isArray(data)
        ? data.map(item => ({
            name: formatDate(item.date),
            sales: Number(item.sales),
        })) 
        : [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm col-span-1 md:col-span-2 lg:col-span-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend (Last 7 Days)</h3>
            <div className="h-64">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        {/* --- MODIFIED: Increased left margin to prevent collision --- */}
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            {/* --- MODIFIED: Added labelFormatter to remove duplicate date --- */}
                            <Tooltip 
                                cursor={{stroke: '#197ADC', strokeWidth: 1, strokeDasharray: '3 3'}} 
                                formatter={(value: number, name: string) => [new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value), 'Sales']}
                                labelFormatter={(label: string) => label}
                            />
                            
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#197ADC" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#197ADC" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            
                            
                            
                            <Line 
                                type="monotone" 
                                dataKey="sales" 
                                stroke="#197ADC" 
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#197ADC' }}
                                activeDot={{ r: 6, fill: '#fff', stroke: '#197ADC', strokeWidth: 2 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-md">
                        <p className="text-gray-500">No sales trend data to display.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesTrendChart;

