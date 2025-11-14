import React from 'react';
import { motion } from 'framer-motion';
import { type FullDashboardData } from './DashboardPage';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 
import StatCard from '../../components/cards/Dashboard_cards/StatCard';
import TeamPerformanceCard from '../../components/cards/Dashboard_cards/TeamPerformanceCard';
import AttendanceSummaryCard from '../../components/cards/Dashboard_cards/AttendanceSummaryCard';
import SalesTrendChart from '../../components/cards/Dashboard_cards/SalesTrendChart';
import usersGroupIcon from '../../assets/Image/icons/users-group-icon.svg';
import dollarIcon from '../../assets/Image/icons/dollar-icon.svg';
import cartIcon from '../../assets/Image/icons/cart-icon.svg';
import clockIcon from '../../assets/Image/icons/clock-icon.svg';
import { Link } from 'react-router-dom';

// Define the props
interface DashboardContentProps {
  data: FullDashboardData | null;
  loading: boolean;
  error: string | null;
  userName: string;
}

// Animation variants 
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};


// --- THIS COMPONENT USES THE 'Skeleton' IMPORT ---
const DashboardSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div>
        {/* 1. Skeleton for Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            <Skeleton width={300} />
          </h1>
          <p className="text-md text-gray-500">
            <Skeleton width={250} />
          </p>
        </div>
        
        {/* 2. Skeleton for the Grid (matches your real grid classes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Row 1: 4 Stat Cards (lg:col-span-3 each) */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="lg:col-span-3">
              {/* A typical stat card height, with rounded corners */}
              <Skeleton height={120} borderRadius={12} /> 
            </div>
          ))}
          
          {/* Row 2: Team & Attendance Cards (lg:col-span-4 each, h-96) */}
          <div className="lg:col-span-4 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
          <div className="lg:col-span-4 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
          
          {/* Row 3: Sales Trend Chart (lg:col-span-12, h-96) */}
          <div className="lg:col-span-12 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};


// --- Your main component ---
const DashboardContent: React.FC<DashboardContentProps> = ({ data, loading, error ,userName}) => {
  
  // --- THIS 'if' BLOCK USES 'DashboardSkeleton' ---
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Handle the error state
  if (error) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  // If data is null after loading, show a message
  if (!data) {
    return <div className="text-center p-10 text-gray-500">No dashboard data available.</div>;
  }

  // Destructure the data for easier use 
  const { stats, teamPerformance, attendanceSummary,salesTrend } = data;

  // Prepare data specifically for the StatCards (This is correct)
  const statCardsData = [
    { 
      title: "Today's Total Parties", 
      value: stats.totalPartiesToday, 
      icon: usersGroupIcon, 
      iconBgColor: 'bg-blue-100',
      link: '/parties?filter=today' 
    },
    { 
      title: "Today's Total Orders", 
      value: stats.totalOrdersToday, 
      icon: cartIcon, 
      iconBgColor: 'bg-indigo-100',
      link: '/order-lists?filter=today'
    },
    { 
      title: "Total Pending Orders", 
      value: stats.pendingOrders, 
      icon: clockIcon, 
      iconBgColor: 'bg-orange-100',
      link: '/order-lists?status=pending' 
    },
    { 
      title: "Today's Total Order Value", 
      value: stats.totalSalesToday, 
      icon: dollarIcon, 
      iconBgColor: 'bg-green-100' 
    },
  ];

  // --- THIS FUNCTION IS DEFINED ---
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
  // --- THIS VARIABLE IS DEFINED ---
  const firstName = userName ? userName.split(' ')[0] : '';

 
   return (
    <div>
      {/* --- 'getGreeting' and 'firstName' ARE USED HERE --- */}
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
      
      {/* --- Framer Motion wrapper --- */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
       variants={gridContainerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Stat Cards with hover effect */}
        {statCardsData.map(card => (
          <motion.div 
            key={card.title} 
            variants={cardVariants}
            className={`lg:col-span-3 rounded-lg transition-all duration-300 ease-in-out border-2 border-transparent ${
              card.link 
                ? 'cursor-pointer hover:shadow-xl hover:scale-[1.03] hover:border-secondary' 
                : 'hover:shadow-lg' 
            }`}
          >
            {card.link ? (
              <Link to={card.link} className="block h-full">
                <StatCard {...card} />
             </Link>
            ) : (
              <StatCard {...card} />
            )}
          </motion.div>
        ))}
        
        {/* Other Cards with hover effect */}
        <motion.div 
          className="lg:col-span-4 h-96 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg" 
          variants={cardVariants}
        >
          <TeamPerformanceCard data={teamPerformance} />
       </motion.div>
        
        <motion.div 
          className="lg:col-span-4 h-96 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg" 
          variants={cardVariants}
        >
          <AttendanceSummaryCard data={attendanceSummary} />
        </motion.div>
        
        <motion.div 
          className="lg:col-span-12 h-96 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg" 
          variants={cardVariants}
        >
          <SalesTrendChart data={salesTrend} />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default DashboardContent;