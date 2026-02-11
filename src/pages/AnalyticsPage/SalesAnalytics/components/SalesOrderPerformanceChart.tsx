import React from 'react';
import { BarChart, Bar, Cell, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { type SalesOrderPerformanceData } from '@/api/salesDashboardService';
import { TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/ui';

interface SalesOrderPerformanceChartProps {
    data: SalesOrderPerformanceData;
    month: string;
}

const SalesOrderPerformanceChart: React.FC<SalesOrderPerformanceChartProps> = ({ data, month }) => {

    const hasData = data && data.length > 0 && data.some(d => d.salesAmount > 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">

            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">Sales Trend ({month})</h3>

            <div
                className="flex-grow [&_*]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_svg]:outline-none [&_*:focus]:outline-none"
                style={{ height: 280 }}
            >

                {hasData ? (
                    <ResponsiveContainer width="100%" height={280} style={{ outline: 'none' }}>
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            barSize={40}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                                width={80}
                                tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                formatter={(value: number | string | Array<number | string> | undefined) => [`₹${(Number(value) || 0).toLocaleString('en-IN')}`, 'Sales Amount']}
                            />
                            <Bar
                                dataKey="salesAmount"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                            >
                                {data.map((_entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === data.length - 1 ? '#197ADC' : '#94C7F3'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyState
                        title="No Sales Data"
                        description={`No sales data available for ${month}.`}
                        icon={<TrendingUp className="w-10 h-10 text-blue-200" />}
                    />
                )}
            </div>
        </div>
    );
};

export default SalesOrderPerformanceChart;