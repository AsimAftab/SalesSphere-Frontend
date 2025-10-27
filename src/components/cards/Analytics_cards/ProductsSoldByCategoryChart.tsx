import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { type TopProductsSoldData } from '../../../api/services/dashboard/analyticsService';

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

      <div className="flex-grow flex flex-col md:flex-row items-center justify-between">

        <div className="w-full md:w-1/2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} units (${((value / total) * 100).toFixed(0)}%)`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6 space-y-3">

            <div className="flex items-center justify-between mb-2 pb-2 border-b">
                <span className="text-xs font-bold text-gray-500 uppercase">{legendTitle1}</span>
                <span className="text-xs font-bold text-gray-500 uppercase">{legendTitle2}</span>
            </div>

            {data.map(item => (
                <div key={item.name} className="flex items-center justify-between text-base">
                    <div className="flex items-center truncate mr-2">
                        <span className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="text-gray-600 truncate" title={item.name}>{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-800">{item.value.toLocaleString()}</span>
                </div>
            ))}

            <div className="!mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-base">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsSoldByCategoryChart;
