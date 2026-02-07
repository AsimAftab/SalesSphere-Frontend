import React, { useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { type TopProductsSoldData } from '@/api/salesDashboardService';
import { ChevronsDown, ShoppingCart } from 'lucide-react';
import { InfoCard, EmptyState } from '@/components/ui';

export interface ProductsSoldByCategoryChartProps {
    data: TopProductsSoldData;
    title: string;
    subtitle: string;
    legendTitle1: string;
    legendTitle2: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: { name: string; value: number } }>;
    total: number;
}

const CustomTooltip = ({ active, payload, total }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percent = ((data.value / total) * 100).toFixed(0);
        return (
            <div className="bg-white p-2 border border-gray-100 shadow-md rounded-lg text-xs">
                <p className="font-semibold">{data.name}</p>
                <p>{`${data.value.toLocaleString()} units (${percent}%)`}</p>
            </div>
        );
    }
    return null;
};

const ProductsSoldByCategoryChart: React.FC<ProductsSoldByCategoryChartProps> = ({
    data,
    title,
    subtitle,
    legendTitle1,
    legendTitle2
}) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    const hasData = data && data.length > 0 && total > 0;
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef?.current) {
            scrollRef.current.scrollBy({ top: 60, behavior: 'smooth' });
        }
    };

    return (
        <InfoCard
            title={title}
            subtitle={subtitle}
        >
            {hasData ? (
                <div className="flex flex-col md:flex-row justify-between flex-grow h-full">
                    <div
                        className="w-full md:w-1/2 relative flex-shrink-0 [&_*]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_svg]:outline-none [&_*:focus]:outline-none"
                        style={{ height: '280px' }}
                    >
                        <ResponsiveContainer width="100%" height={280} style={{ outline: 'none' }}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius="80%"
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip total={total} />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6 space-y-3 flex flex-col">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b">
                            <span className="text-xs font-bold text-gray-500 uppercase">{legendTitle1}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase">{legendTitle2}</span>
                        </div>

                        <div className="flex-1 relative">
                            <div
                                ref={data.length > 5 ? scrollRef : undefined}
                                className={`pr-2 space-y-3 ${data.length > 5 ? 'overflow-y-auto max-h-[165px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' : ''}`}
                            >
                                {data.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-base">
                                        <div className="flex items-center truncate mr-2">
                                            <span
                                                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                                                style={{ backgroundColor: item.color }}
                                            ></span>
                                            <span className="text-gray-600 truncate" title={item.name}>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-800 flex-shrink-0">{item.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Scroll Indicator - overlays on top of list */}
                            {data.length > 5 && (
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 cursor-pointer outline-none z-10"
                                    onClick={handleScroll}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleScroll(); }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-300 rounded-full p-1.5">
                                        <ChevronsDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between text-base">
                            <span className="font-semibold text-gray-700">Total:</span>
                            <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState
                    title="No Data Available"
                    description={`No products sold data available for this breakdown.`}
                    icon={<ShoppingCart className="w-10 h-10 text-blue-200" />}
                />
            )}
        </InfoCard>
    );
};

export default ProductsSoldByCategoryChart;