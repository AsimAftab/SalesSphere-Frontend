import React, { useMemo, useRef } from 'react';
import type { PartyDistributionItem } from '../../../api/dashboard';
import InfoCard from '../../../components/UI/shared_cards/InfoCard';
import { PieChart, ChevronRight } from 'lucide-react';
import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';
import { Link } from 'react-router-dom';

interface PartyDistributionCardProps {
    data: PartyDistributionItem[];
    total: number;
}

const PartyDistributionCard: React.FC<PartyDistributionCardProps> = ({ data, total }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const distribution = useMemo(() => {
        if (!data || data.length === 0) return [];

        // 1. Map to unified types
        const mapped = data.map(item => ({
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
        <InfoCard
            title="Party Distribution"
            scrollableRef={scrollRef}
            showScrollIndicator={distribution.length > 5}
        >
            {!hasData ? (
                <EmptyState
                    title="No Parties Found"
                    description="Start building your distribution network. Add parties to track their type and performance."
                    icon={<PieChart className="w-10 h-10 text-blue-200" />}
                    action={
                        <Link to="/parties" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                            + Add New Party
                        </Link>
                    }
                />
            ) : (
                <div className="h-full flex flex-col relative">
                    {/* Header Row */}
                    <div className="flex justify-between items-center py-3 px-3 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Party Type</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-8">{total}</span>
                    </div>

                    {/* List content */}
                    <div
                        ref={scrollRef}
                        className="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    >
                        {distribution.map((item, index) => (
                            <Link
                                key={item.type}
                                to={`/parties?type=${encodeURIComponent(item.type)}`}
                                className="flex justify-between items-center py-3 px-3 rounded-lg hover:bg-blue-100 transition-all duration-300 group border-b border-gray-100 last:border-0 hover:shadow-sm hover:pl-4 cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${index % 2 === 0 ? 'bg-blue-400 group-hover:bg-blue-600' : 'bg-indigo-400 group-hover:bg-indigo-600'}`}></div>
                                    <span className="font-medium text-gray-700 text-sm capitalize group-hover:text-blue-800 transition-colors">{item.type}</span>
                                </div>

                                <div className="flex items-center gap-2 relative z-10">
                                    <span className="font-bold text-gray-900 text-sm bg-gray-100 px-2.5 py-0.5 rounded-full group-hover:bg-white group-hover:text-blue-700 transition-colors shadow-sm border border-transparent group-hover:border-blue-100">{item.count}</span>
                                    <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </InfoCard>
    );
};

export default PartyDistributionCard;
