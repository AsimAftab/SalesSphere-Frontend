import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type SalesOrderPerformanceData } from '../../../api/services/dashboard/analyticsService';

interface SalesOrderPerformanceChartProps {
  data: SalesOrderPerformanceData;
  month: string; // Prop to receive the month name
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-blue-600 mt-1">
          Sales : ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const SalesOrderPerformanceChart: React.FC<SalesOrderPerformanceChartProps> = ({ data, month }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      {/* Updated title to be dynamic */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend ({month})</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
                label={{ value: 'Sales Amount', angle: -90, position: 'insideLeft', dx: -10, style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#a0a0a0' }} content={<CustomTooltip />} />
            <Line
                type="monotone"
                dataKey="salesAmount"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Sales Amount"
                dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesOrderPerformanceChart;