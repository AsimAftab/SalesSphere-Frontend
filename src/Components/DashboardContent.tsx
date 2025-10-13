import React from 'react';

// --- Icon Imports ---
import usersGroupIcon from '../assets/Image/icons/users-group-icon.svg';
import dollarIcon from '../assets/Image/icons/dollar-icon.svg';
import cartIcon from '../assets/Image/icons/cart-icon.svg';
import clockIcon from '../assets/Image/icons/clock-icon.svg';

// --- Card Component Imports ---
import StatCard from './cards/StatCard';
import TeamPerformanceCard from './cards/TeamPerformanceCard';
import AttendanceSummaryCard from './cards/AttendanceSummaryCard';
import LiveActivitiesCard from './cards/LiveActivitiesCard';
import SalesTrendChart from './cards/SalesTrendChart';

const DashboardContent = () => {
  const statCardsData = [
    { title: "Today's Total Parties", value: '847', icon: usersGroupIcon, iconBgColor: 'bg-blue-100' },
    { title: "Today's Total Sales", value: '₹125K', icon: dollarIcon, iconBgColor: 'bg-green-100' },
    { title: "Today's Total Orders", value: '342', icon: cartIcon, iconBgColor: 'bg-indigo-100' },
    { title: "Pending Orders", value: '89', icon: clockIcon, iconBgColor: 'bg-orange-100' },
  ];
  const teamPerformanceData = [
    { initials: 'RK', name: 'Rajesh Kumar', orders: 45, sales: '28,500' },
    { initials: 'PS', name: 'Priya Sharma', orders: 52, sales: '31,200' },
    { initials: 'AS', name: 'Amit Singh', orders: 38, sales: '24,800' },
  ];
  const attendanceData = { strength: 35, present: 28, absent: 4, onLeave: 3, rate: 80.1 };
  const liveActivitiesData = [
    { name: 'Rajesh Kumar', time: '10:30 AM', details: 'Client Meeting', location: 'Sector 14, Gurgaon' },
    { name: 'Priya Sharma', time: '11:15 AM', details: 'Product Demo', location: 'Connaught Place, Delhi' },
    { name: 'Amit Singh', time: '2:45 PM', details: 'Site Visit', location: 'MG Road, Bangalore' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Good Morning!!</h1>
        <p className="text-md text-gray-500">Tuesday, October 7, 2025</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {statCardsData.map(card => (
          <div key={card.title} className="lg:col-span-3">
            <StatCard {...card} />
          </div>
        ))}
        <div className="lg:col-span-4">
          <TeamPerformanceCard data={teamPerformanceData} />
        </div>
        <div className="lg:col-span-4">
          <AttendanceSummaryCard data={attendanceData} />
        </div>
        <div className="lg:col-span-4">
          <LiveActivitiesCard data={liveActivitiesData} />
        </div>
        <div className="lg:col-span-12">
          <SalesTrendChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;