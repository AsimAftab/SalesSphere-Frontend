import React from 'react';

// Define the props for the component
interface BeatPlanStatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
}

const BeatPlanStatCard: React.FC<BeatPlanStatCardProps> = ({ title, value, icon, iconBgColor }) => {
  return (
    // --- THIS IS THE MAIN CHANGE ---
    // Changed 'space-x-4' to 'justify-between' to push items to the edges.
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
      
      {/* Title and Value */}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>

      {/* Icon with colored background */}
      <div className={`p-3 rounded-md ${iconBgColor}`}>
        {icon}
      </div>

    </div>
  );
};

export default BeatPlanStatCard;