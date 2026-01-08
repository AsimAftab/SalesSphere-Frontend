import React from 'react';
import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';

// Import Types from service to ensure consistency
import type { FullDashboardData } from '../../api/dashboardService';

import StatCard from '../../components/cards/Dashboard_cards/StatCard';
import TeamPerformanceCard from '../../components/cards/Dashboard_cards/TeamPerformanceCard';
import AttendanceSummaryCard from '../../components/cards/Dashboard_cards/AttendanceSummaryCard';
import SalesTrendChart from '../../components/cards/Dashboard_cards/SalesTrendChart';
import LiveActivitiesCard from '../../components/cards/Dashboard_cards/LiveActivitiesCard';

import usersGroupIcon from '../../assets/Image/icons/users-group-icon.svg';
import dollarIcon from '../../assets/Image/icons/dollar-icon.svg';
import cartIcon from '../../assets/Image/icons/cart-icon.svg';
import clockIcon from '../../assets/Image/icons/clock-icon.svg';

interface DashboardContentProps {
  data: FullDashboardData | null;
  loading: boolean;
  error: string | null;
  userName: string;
  hasPermission: (module: string, feature: string) => boolean;
}

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

const DashboardSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div>
        {/* Greeting Skeleton */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <Skeleton width={300} />
          </h1>
          <p className="text-md text-gray-500">
            <Skeleton width={250} />
          </p>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Row 1: 4 Stat Cards */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="lg:col-span-3">
              <Skeleton height={120} borderRadius={12} />
            </div>
          ))}

          {/* Row 2: Team, Attendance, Live */}
          <div className="lg:col-span-4 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
          <div className="lg:col-span-4 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
          <div className="lg:col-span-4 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>

          {/* Row 3: Sales Trend Chart */}
          <div className="lg:col-span-12 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

const DashboardContent: React.FC<DashboardContentProps> = ({
  data,
  loading,
  error,
  userName,
  hasPermission
}) => {
  if (loading) {
    return <DashboardSkeleton />;
  }
  if (error) {
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="text-center p-10 text-gray-500">
        No dashboard data available.
      </div>
    );
  }

  const { stats, teamPerformance, attendanceSummary, salesTrend, liveActivities } = data;

  const statCardsData = [
    {
      title: "Today's Total Parties",
      value: stats.totalPartiesToday,
      icon: usersGroupIcon,
      iconBgColor: 'bg-blue-100',
      link: '/parties?filter=today',
    },
    {
      title: "Today's Total Orders",
      value: stats.totalOrdersToday,
      icon: cartIcon,
      iconBgColor: 'bg-indigo-100',
      link: '/order-lists?filter=today',
    },
    {
      title: 'Total Pending Orders',
      value: stats.pendingOrders,
      icon: clockIcon,
      iconBgColor: 'bg-orange-100',
      link: '/order-lists?status=pending',
    },
    {
      title: "Today's Total Order Value",
      value: stats.totalSalesToday,
      icon: dollarIcon,
      iconBgColor: 'bg-green-100',
    },
  ];

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  const firstName = userName ? userName.split(' ')[0] : '';

  // Permission Checks
  const canViewStats = hasPermission('dashboard', 'viewStats');
  const canViewTeamPerformance = hasPermission('dashboard', 'viewTeamPerformance');
  const canViewAttendanceSummary = hasPermission('dashboard', 'viewAttendanceSummary');
  const canViewLiveTracking = hasPermission('liveTracking', 'viewLiveTracking');
  const canViewSalesTrend = hasPermission('dashboard', 'viewSalesTrend');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {getGreeting()}, <span className="text-secondary">{firstName}!</span>
        </h1>
        <p className="text-md text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
        variants={gridContainerVariants}
        initial="hidden"
        animate="show"
      >
        {/* STATS CARDS (Only show if viewStats is allowed) */}
        {canViewStats && statCardsData.map((card) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            className={`lg:col-span-3 rounded-lg transition-all duration-300 ease-in-out border-2 border-transparent ${card.link
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

        {/* TEAM PERFORMANCE */}
        {canViewTeamPerformance && (
          <motion.div
            className="lg:col-span-4 h-96 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg"
            variants={cardVariants}
          >
            <TeamPerformanceCard data={teamPerformance} />
          </motion.div>
        )}

        {/* ATTENDANCE SUMMARY */}
        {canViewAttendanceSummary && (
          <motion.div
            className="lg:col-span-4 h-96 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg"
            variants={cardVariants}
          >
            <AttendanceSummaryCard data={attendanceSummary} />
          </motion.div>
        )}

        {/* LIVE TRACKING ACTIVITY */}
        {canViewLiveTracking && (
          <motion.div
            className="lg:col-span-4 h-96 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg"
            variants={cardVariants}
          >
            <LiveActivitiesCard data={liveActivities} />
          </motion.div>
        )}

        {/* SALES TREND CHART */}
        {canViewSalesTrend && (
          <motion.div
            className="lg:col-span-12 h-96 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg"
            variants={cardVariants}
          >
            <SalesTrendChart data={salesTrend} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardContent;