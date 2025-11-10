import React from 'react';
import { type TeamMemberPerformance } from '../../../api/dashboardService'; 

interface TeamPerformanceCardProps {
  data: TeamMemberPerformance[];
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  const first = names[0] ? names[0][0] : '';
  const last = names.length > 1 ? names[names.length - 1][0] : '';
  return (first + last).toUpperCase();
};

const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance Today</h3>
    
    <div className="space-y-4 overflow-y-auto pr-2 flex-1">
      {data.map(member => (
        <div key={member._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-x-3">
            
            {/* AVATAR LOGIC */}
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                {getInitials(member.name)}
              </span>
            )}
            
            <div>
              <p className="text-sm font-semibold text-gray-700">{member.name}</p>
              
              {/* === 1. CHANGED === */}
              {/* Removed orders from this line */}
              <p className="text-xs text-gray-500 capitalize">
                {member.role}
              </p>
            </div>
          </div>
          
          {/* === 2. WRAPPED === */}
          {/* Wrapped sales and orders in a div to stack them */}
          <div className="flex flex-col items-end">
            <p className="text-sm font-bold text-green-600">₹{member.sales}</p>
            
            {/* 3. ADDED */}
            {/* Added orders here, aligned to the right */}
            <p className="text-xs text-gray-500">{member.orders} orders</p>
          </div>

        </div>
      ))}
    </div>
  </div>
);

export default TeamPerformanceCard;