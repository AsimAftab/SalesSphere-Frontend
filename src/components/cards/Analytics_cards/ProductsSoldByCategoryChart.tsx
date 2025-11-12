import React, { useRef, useState, useLayoutEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { type TopProductsSoldData } from '../../../api/analyticsService';

export interface ProductsSoldByCategoryChartProps {
    data: TopProductsSoldData;
    title: string;
    subtitle: string;
    legendTitle1: string;
    legendTitle2: string;
}

const ProductsSoldByCategoryChart: React.FC<ProductsSoldByCategoryChartProps> = ({
    data,
    title,
    subtitle,
    legendTitle1,
    legendTitle2
}) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Observe container size changes
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setReady(true);
                }
            }
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full"> {/* Ensure outer container uses h-full */}
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

            <div className="flex flex-col md:flex-row justify-between flex-grow"> {/* Flex-grow allows it to fill space */}
                {/* Chart Container */}
                <div 
                    ref={containerRef} 
                    className="w-full md:w-1/2 relative flex-shrink-0" 
                    // FIX: Set a guaranteed height for the chart wrapper directly
                    style={{ height: '280px' }} 
                >
                    {ready && (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data as any}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius="80%"
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {data.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) =>
                                        `${value.toLocaleString()} units (${((value / total) * 100).toFixed(0)}%)`
                                    }
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Legend Section */}
                <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6 space-y-3 flex flex-col">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b">
                        <span className="text-xs font-bold text-gray-500 uppercase">{legendTitle1}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase">{legendTitle2}</span>
                    </div>

                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-base">
                            <div className="flex items-center truncate mr-2">
                                <span
                                    className="w-3 h-3 rounded-full mr-3"
                                    style={{ backgroundColor: item.color }}
                                ></span>
                                <span className="text-gray-600 truncate" title={item.name}>
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-medium text-gray-800">{item.value.toLocaleString()}</span>
                        </div>
                    ))}

                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-base">
                        <span className="font-semibold text-gray-700">Total:</span>
                        <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsSoldByCategoryChart;