import React from 'react';

// FIX: This interface must accept a string 'icon' for the image path
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; // <-- This prop accepts the image path (string)
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBgColor }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-start justify-between h-full">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`rounded-full p-3 ${iconBgColor}`}>
      {/* FIX: This must be an <img> tag to render the image path */}
      <img src={icon} alt={title} className="h-6 w-6" /> 
    </div>
  </div>
);

export default StatCard;