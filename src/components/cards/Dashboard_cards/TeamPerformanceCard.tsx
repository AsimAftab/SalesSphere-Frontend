import React from 'react';
import { type TeamMemberPerformance } from '../../../api/services/dashboard/dashboardService';

// --- ADDED: Interface to define the component's props ---
interface TeamPerformanceCardProps {
  data: TeamMemberPerformance[];
}

const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm h-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance Today</h3>
    <div className="space-y-4">
      {data.map(member => (
        <div key={member.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-x-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-700">{member.name}</p>
              <p className="text-xs text-gray-500">{member.orders} orders</p>
            </div>
          </div>
          <p className="text-sm font-bold text-green-600">₹{member.sales}</p>
        </div>
      ))}
    </div>
  </div>
);

export default TeamPerformanceCard;
