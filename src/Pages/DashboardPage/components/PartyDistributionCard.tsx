import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartyDistribution } from '../../../api/dashboardService';
import InfoCard from '../../../components/shared_cards/InfoCard';
import { PieChart } from 'lucide-react';
import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';
import { Link } from 'react-router-dom';

const PartyDistributionCard: React.FC = () => {
    const { data } = useQuery({
        queryKey: ['partyDistribution'],
        queryFn: getPartyDistribution,
        staleTime: 1000 * 60 * 15, // 15 minutes
    });


    const distribution = useMemo(() => {
        if (!data || !data.distribution) return [];

        // 1. Map to unified types
        const mapped = data.distribution.map(item => ({
            ...item,
            type: (item.type === 'Unspecified' || !item.type) ? 'Not Specified' : item.type
        }));

        // 2. Aggregate counts by type (combines multiple "Not Specified" into one)
        const aggregated = mapped.reduce((acc: Record<string, number>, item) => {
            acc[item.type] = (acc[item.type] || 0) + item.count;
            return acc;
        }, {});

        // 3. Convert back to array and sort
        return Object.entries(aggregated)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => {
                if (a.type === 'Not Specified') return 1;
                if (b.type === 'Not Specified') return -1;
                return b.count - a.count; // Sort by count descending for others
            });
    }, [data]);

    const hasData = distribution.length > 0;

    return (
        <InfoCard title="Party Distribution">
            {!hasData ? (
                <EmptyState
                    title="No Parties Found"
                    description="Start building your distribution network. Add parties to track their type and performance."
                    icon={<PieChart className="w-6 h-6 text-indigo-500" />}
                    action={
                        <Link to="/parties" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                            + Add New Party
                        </Link>
                    }
                />
            ) : (
                <div className="h-full flex flex-col">
                    {/* Header Row */}
                    <div className="flex justify-between items-center py-3 px-2 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Party Type</span>
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{data?.total || 0}</span>
                    </div>

                    {/* List content */}
                    <div className="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        {distribution.map((item) => (
                            <Link
                                key={item.type}
                                to={`/parties?type=${encodeURIComponent(item.type)}`}
                                className="flex justify-between items-center py-3 px-2 rounded-md hover:bg-gray-50 transition-all duration-200 group border-b border-gray-50 last:border-0"
                            >
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-700 text-sm capitalize">{item.type}</span>
                                </div>

                                <span className="font-semibold text-gray-900 text-sm">{item.count}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </InfoCard>
    );
};

export default PartyDistributionCard;
