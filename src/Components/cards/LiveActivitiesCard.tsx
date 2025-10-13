import React from 'react';

const LiveActivitiesCard = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Field Activities</h3>
    <ul className="relative border-l border-gray-200 ml-2">
      {data.map((activity, index) => (
        <li key={index} className="mb-6 ml-6">
          <span className="absolute flex items-center justify-center w-4 h-4 bg-green-200 rounded-full -left-2 ring-4 ring-white"><div className="w-2 h-2 bg-green-500 rounded-full"></div></span>
          <p className="text-sm font-semibold text-gray-700">{activity.name} <span className="text-xs font-normal text-gray-400 ml-2">{activity.time}</span></p>
          <p className="text-xs text-gray-500">{activity.details}</p>
          <a href="#" className="text-xs text-blue-600 hover:underline">{activity.location}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default LiveActivitiesCard;