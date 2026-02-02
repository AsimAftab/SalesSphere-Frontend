import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InfoCard } from '@/components/ui';

interface OrganizationOverviewChartProps {
    organizations: {
        total: number;
        active: number;
        recent: number;
    };
}

const OrganizationOverviewChart: React.FC<OrganizationOverviewChartProps> = ({ organizations }) => {
    const data = [
        { name: 'All Orgs', count: organizations.total, fill: '#3b82f6' },
        { name: 'Active (Enabled)', count: organizations.active, fill: '#22c55e' },
        { name: 'New (30 Days)', count: organizations.recent, fill: '#6366f1' },
    ];

    return (
        <InfoCard title="Organization Overview" className="border-2 border-gray-100">
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} barSize={48}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </InfoCard>
    );
};

export default OrganizationOverviewChart;
