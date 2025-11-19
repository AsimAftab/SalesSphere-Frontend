import React from 'react';
import { type TopPartiesData } from '../../../api/analyticsService';

interface TopPartiesCardProps {
    data: TopPartiesData;
}

const TopPartiesCard: React.FC<TopPartiesCardProps> = ({ data }) => {
   
    const hasData = data && data.length > 0 && data.some(party => (party.sales ?? 0) > 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-800">Top 5 Parties of the Month</h3>
            </div>
            
            {hasData ? (
                <div className="space-y-4 flex-grow overflow-y-auto">
                    {data.map((party) => (
                        <div key={party.id} className="flex items-center">
                            
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm flex-shrink-0">
                                {party.initials}
                            </div>
                            
                            <div className="ml-4 flex-grow min-w-0">
                                <p className="font-semibold text-gray-700 truncate">{party.name}</p>
                            </div>

                            <div className="text-right flex-shrink-0">
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
                <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
                    No top parties found for the selected period.
                </div>
            )}
        </div>
    );
};

export default TopPartiesCard;