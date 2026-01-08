import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; 
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBgColor }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-start justify-between h-full border border-gray-100 hover:border-blue-100 transition-colors">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      {/* Ensure value defaults to 0 if null/undefined is passed */}
      <p className="text-3xl font-bold text-gray-800">
        {value !== undefined && value !== null ? value : 0}
      </p>
    </div>
    <div className={`rounded-full p-3 flex-shrink-0 ${iconBgColor}`}>
      <img src={icon} alt={title} className="h-6 w-6 object-contain" /> 
    </div>
  </div>
);

export default StatCard;