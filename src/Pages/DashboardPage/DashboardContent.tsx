import React from 'react';
import { type FullDashboardData } from './DashboardPage';

// --- MODIFIED: Import your individual card components ---
import StatCard from '../../components/cards/Dashboard_cards/StatCard';
import TeamPerformanceCard from '../../components/cards/Dashboard_cards/TeamPerformanceCard';
import AttendanceSummaryCard from '../../components/cards/Dashboard_cards/AttendanceSummaryCard';
//import LiveActivitiesCard from './cards/LiveActivitiesCard';
import SalesTrendChart from '../../components/cards/Dashboard_cards/SalesTrendChart';

// --- Icon Imports for Stat Cards ---
import usersGroupIcon from '../../assets/Image/icons/users-group-icon.svg';
import dollarIcon from '../../assets/Image/icons/dollar-icon.svg';
import cartIcon from '../../assets/Image/icons/cart-icon.svg';
import clockIcon from '../../assets/Image/icons/clock-icon.svg';

// Define the props this component expects to receive from DashboardPage
interface DashboardContentProps {
  data: FullDashboardData | null;
  loading: boolean;
  error: string | null;
  userName: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ data, loading, error ,userName}) => {
  
  // 1. Handle the loading state
  if (loading) {
    return <div className="text-center p-10 text-gray-500">Loading Dashboard...</div>;
  }

  // 2. Handle the error state
  if (error) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  // 3. If data is null after loading, show a message
  if (!data) {
    return <div className="text-center p-10 text-gray-500">No dashboard data available.</div>;
  }

  // Destructure the data for easier use
  const { stats, teamPerformance, attendanceSummary,salesTrend } = data;

  // Prepare data specifically for the StatCards
  const statCardsData = [
    { title: "Today's Total Parties", value: stats.totalParties, icon: usersGroupIcon, iconBgColor: 'bg-blue-100' },
    { title: "Today's Total Sales", value: stats.totalSales, icon: dollarIcon, iconBgColor: 'bg-green-100' },
    { title: "Today's Total Orders", value: stats.totalOrders, icon: cartIcon, iconBgColor: 'bg-indigo-100' },
    { title: "Pending Orders", value: stats.pendingOrders, icon: clockIcon, iconBgColor: 'bg-orange-100' },
  ];

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  const firstName = userName ? userName.split(' ')[0] : 'Admin';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
            {getGreeting()}, <span className="text-secondary">{firstName}!</span>
        </h1>
        <p className="text-md text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      
      {/* --- MODIFIED: Using your separate card components and passing data --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {statCardsData.map(card => (
          <div key={card.title} className="lg:col-span-3">
            <StatCard {...card} />
          </div>
        ))}
        <div className="lg:col-span-4 h-96">
          <TeamPerformanceCard data={teamPerformance} />
        </div>
        <div className="lg:col-span-4 h-96">
          <AttendanceSummaryCard data={attendanceSummary} />
        </div>
        <div className="lg:col-span-12 h-96"> {/* <-- ADDED h-96 */}
          <SalesTrendChart data={salesTrend} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;