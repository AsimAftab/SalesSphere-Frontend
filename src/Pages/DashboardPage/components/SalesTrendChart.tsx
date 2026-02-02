import React from 'react';
import { type SalesTrendData, DashboardMapper } from '../../../api/dashboard';
import {
    BarChart,
    Bar,
    Cell,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import InfoCard from '../../../components/ui/SharedCards/InfoCard';
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState';

interface SalesTrendChartProps {
    data?: SalesTrendData[];
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => {
    // Process data using centralized Mapper logic for consistency
    const chartData = Array.isArray(data)
        ? data.map(item => ({
            name: DashboardMapper.formatChartDate(item.date),
            sales: Number(item.sales),
        }))
        : [];

    return (
        <InfoCard title="Sales Trend (Last 7 Days)" className="col-span-1 md:col-span-2 lg:col-span-12">
            <div className="h-64 w-full" style={{ minHeight: '256px' }}>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            barSize={40} // Consistent bar width for professional look
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
                                width={60}
                                tickFormatter={(value) => `₹${value}`}
                            />

                            <Tooltip
                                cursor={{ fill: '#F3F4F6' }} // Subtle hover background for bars
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                // Centralized currency formatting
                                formatter={(value: number) => [DashboardMapper.formatCurrency(value), 'Sales']}
                            />

                            <Bar
                                dataKey="sales"
                                radius={[4, 4, 0, 0]} // Rounded top corners
                                animationDuration={1500}
                            >
                                {chartData.map((_entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === chartData.length - 1 ? '#197ADC' : '#94C7F3'}
                                    // Highlights the most recent day with a primary color
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyState
                        title="No Sales Data"
                        description="No sales trend data available for the last 7 days."
                        icon={<TrendingUp className="w-10 h-10 text-blue-200" />}
                    />
                )}
            </div>
        </InfoCard>
    );
};

export default SalesTrendChart;