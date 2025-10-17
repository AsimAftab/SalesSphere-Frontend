import React from 'react';
import { type TopPartiesData } from '../../../api/analyticsService';

interface TopPartiesCardProps {
  data: TopPartiesData;
}

const TopPartiesCard: React.FC<TopPartiesCardProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Top 5 Parties of the Month</h3>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>
      <div className="space-y-4">
        {data.map((party) => (
          <div key={party.id} className="flex items-center">
            {/* Initials Circle (no change) */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
              {party.initials}
            </div>
            
            {/* Middle section (order count removed from here) */}
            <div className="ml-4 flex-grow">
              <p className="font-semibold text-gray-700">{party.name}</p>
            </div>

            {/* Right section (order count added here) */}
            <div className="text-right">
              <p className="font-bold text-green-600">
                {`₹${party.sales.toLocaleString('en-IN')}`}
              </p>
              <p className="text-xs text-gray-500">{party.orders} orders</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPartiesCard;