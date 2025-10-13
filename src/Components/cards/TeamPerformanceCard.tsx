import React from 'react';

const TeamPerformanceCard = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2 lg:col-span-2">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance Today</h3>
    <div className="space-y-4">
      {data.map(member => (
        <div key={member.name} className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <span className="font-medium text-gray-600">{member.initials}</span>
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