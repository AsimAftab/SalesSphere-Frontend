import React from 'react';
import { type SalesTrendData } from '../../api/dashboardService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- ADDED: Interface to define the component's props ---
interface SalesTrendChartProps {
    data?: SalesTrendData;
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm col-span-1 md:col-span-2 lg:col-span-12">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend (Last 7 Days)</h3>
    <div className="h-64">
        {data && data.labels && data.data ? (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.labels.map((label, index) => ({ name: label, sales: data.data[index] }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(25, 122, 220, 0.1)'}} />
                    <Bar dataKey="sales" fill="#197ADC" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-md"><p className="text-gray-500">Chart will be displayed here.</p></div>
        )}
    </div>
  </div>
);

export default SalesTrendChart;
