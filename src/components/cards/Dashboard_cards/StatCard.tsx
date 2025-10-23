import React from 'react';

// --- ADDED: Interface to define the component's props ---
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; // Assuming icon is an imported URL string
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBgColor }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`rounded-full p-3 ${iconBgColor}`}>
      <img src={icon} alt={title} className="h-6 w-6" />
    </div>
  </div>
);

export default StatCard;
