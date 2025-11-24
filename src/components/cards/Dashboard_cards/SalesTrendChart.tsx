import React from 'react';
import { type SalesTrendData } from '../../../api/dashboardService';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

interface SalesTrendChartProps {
    data?: SalesTrendData[];
}

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Updated: Removes rounding. Allows up to 2 decimal places.
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        minimumFractionDigits: 0, // If it's a whole number, don't force .00
        maximumFractionDigits: 2  // If it has decimals, show up to 2
    }).format(value);
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
                        <AreaChart 
                            data={chartData} 
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#197ADC" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#197ADC" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12, fill: '#6B7280' }} 
                                axisLine={false} 
                                tickLine={false}
                                dy={10}
                                padding={{ left: 20, right: 20 }} 
                            />
                            
                            <YAxis 
                                tick={{ fontSize: 12, fill: '#6B7280' }} 
                                axisLine={false} 
                                tickLine={false}
                                width={60}
                                // We keep the axis simple, but the tooltip will be exact
                                tickFormatter={(value) => `₹${value}`} 
                            />
                            
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '8px', 
                                    border: 'none', 
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                                }}
                                cursor={{ stroke: '#197ADC', strokeWidth: 1, strokeDasharray: '3 3' }} 
                                // This now uses the updated formatCurrency
                                formatter={(value: number) => [formatCurrency(value), 'Sales']}
                            />
                            
                            <Area 
                                type="monotone" 
                                dataKey="sales" 
                                stroke="#197ADC" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorSales)" 
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
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