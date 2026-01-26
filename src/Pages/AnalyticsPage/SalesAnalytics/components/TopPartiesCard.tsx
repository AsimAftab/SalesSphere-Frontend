import React, { useRef } from 'react';
import { type TopPartiesData } from '../../../../api/salesDashboardService';
import InfoCard from '../../../../components/UI/shared_cards/InfoCard';
import { EmptyState } from '../../../../components/UI/EmptyState/EmptyState';
import { Users } from 'lucide-react';

interface TopPartiesCardProps {
    data: TopPartiesData;
}

const TopPartiesCard: React.FC<TopPartiesCardProps> = ({ data }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasData = data && data.length > 0 && data.some(party => (party.sales ?? 0) > 0);

    return (
        <InfoCard
            title="Top 5 Parties of the Month"
            scrollableRef={data.length > 3 ? scrollRef : undefined}
            showScrollIndicator={data.length > 3}
        >
            {hasData ? (
                <div
                    ref={scrollRef}
                    className="space-y-4 flex-grow overflow-y-auto mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                >
                    {data.map((party) => (
                        <div
                            key={party.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >

                            <div className="flex items-center gap-x-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm flex-shrink-0 border border-gray-200">
                                    {party.initials.charAt(0)}
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-700 truncate">{party.name}</p>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0 ml-4">
                                <p className="font-bold text-green-600">
                                    {`₹${(party.sales ?? 0).toLocaleString('en-IN')}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(party.orders ?? 0)} orders
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No Data Available"
                    description="No top parties found for the selected period."
                    icon={<Users className="w-10 h-10 text-blue-200" />}
                />
            )}
        </InfoCard>
    );
};

export default TopPartiesCard;