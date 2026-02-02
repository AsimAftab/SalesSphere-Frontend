import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { Props as LegendProps } from 'recharts/types/component/DefaultLegendContent';
import { InfoCard } from '@/components/ui';

interface RoleDistributionChartProps {
    roleDistribution: {
        admin: number;
        user: number;
        superadmin: number;
    };
}

const COLORS = ['#6366f1', '#3b82f6', '#f59e0b'];

const RoleDistributionChart: React.FC<RoleDistributionChartProps> = ({ roleDistribution }) => {
    const data = [
        { name: 'Org Admin', value: roleDistribution.admin },
        { name: 'Org User', value: roleDistribution.user },
        { name: 'Superadmin (System)', value: roleDistribution.superadmin },
    ];

    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    const renderLegend = (props: LegendProps) => {
        const payload = props.payload;
        if (!payload) return null;
        return (
            <ul className="flex flex-col gap-2 text-sm">
                {payload.map((entry, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-700">
                            {entry.value}: {entry.payload?.value ?? 0} ({total > 0 ? (((entry.payload?.value ?? 0) / total) * 100).toFixed(1) : 0}%)
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <InfoCard title="Role Distribution" className="border-2 border-gray-100">
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        paddingAngle={2}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend content={renderLegend} />
                </PieChart>
            </ResponsiveContainer>
        </InfoCard>
    );
};

export default RoleDistributionChart;
