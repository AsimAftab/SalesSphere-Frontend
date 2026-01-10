import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../components/UI/EmptyState';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';

// Domain Logic and Types
import { type FullDashboardData, DashboardMapper } from '../../api/dashboardService';
import { type DashboardPermissions } from './useDashboard'; // Ensure this is exported from your hook file

// Components
import StatCard from '../../components/cards/Dashboard_cards/StatCard';
import TeamPerformanceCard from '../../components/cards/Dashboard_cards/TeamPerformanceCard';
import AttendanceSummaryCard from '../../components/cards/Dashboard_cards/AttendanceSummaryCard';
import SalesTrendChart from '../../components/cards/Dashboard_cards/SalesTrendChart';
import LiveActivitiesCard from '../../components/cards/Dashboard_cards/LiveActivitiesCard';

// Assets
import usersGroupIcon from '../../assets/Image/icons/users-group-icon.svg';
import dollarIcon from '../../assets/Image/icons/dollar-icon.svg';
import cartIcon from '../../assets/Image/icons/cart-icon.svg';
import clockIcon from '../../assets/Image/icons/clock-icon.svg';

interface DashboardContentProps {
  data: FullDashboardData | null;
  loading: boolean;
  error: string | null;
  userName: string;
  permissions: DashboardPermissions; // Updated to use the pre-derived object
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <Skeleton width={300} />
          </h1>
          <p className="text-md text-gray-500">
            <Skeleton width={250} />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="lg:col-span-3">
              <Skeleton height={120} borderRadius={12} />
            </div>
          ))}
          <div className="lg:col-span-4 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
          <div className="lg:col-span-4 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
          <div className="lg:col-span-4 h-96">
            <Skeleton height="100%" borderRadius={12} />
          </div>
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
  permissions // Corrected destructuring to match prop name
}) => {
  if (loading) return <DashboardSkeleton />;

  if (error) return (
    <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg m-4">
      {error}
    </div>
  );

  if (!data) return (
    <EmptyState
      title="No Dashboard Data"
      description="We couldn't load the dashboard data at this time. Please try refreshing."
      icon={
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  );

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
      value: DashboardMapper.formatCurrency(stats.totalSalesToday),
      icon: dollarIcon,
      iconBgColor: 'bg-green-100',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = userName ? userName.split(' ')[0] : '';

  return (
    <div className="p-1 md:p-0">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {getGreeting()}, <span className="text-secondary">{firstName}!</span>
        </h1>
        <p className="text-sm md:text-md text-gray-500 mt-1">
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
        {/* Row 1: Stat Cards */}
        {permissions.canViewStats && statCardsData.map((card) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            className={`lg:col-span-3 rounded-lg transition-all duration-300 ease-in-out border-2 border-transparent ${card.link
              ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:border-secondary/20'
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

        {/* Row 2: Detailed Insight Cards */}
        {permissions.canViewTeam && (
          <motion.div className="lg:col-span-4 h-96 rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
            <TeamPerformanceCard data={teamPerformance} />
          </motion.div>
        )}

        {permissions.canViewAttendance && (
          <motion.div className="lg:col-span-4 h-96 rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
            <AttendanceSummaryCard data={attendanceSummary} />
          </motion.div>
        )}

        {permissions.canViewLive && (
          <motion.div className="lg:col-span-4 h-96 rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
            <LiveActivitiesCard data={liveActivities} />
          </motion.div>
        )}

        {/* Row 3: Full Width Charts */}
        {permissions.canViewTrend && (
          <motion.div className="lg:col-span-12 min-h-[400px] rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
            <SalesTrendChart data={salesTrend} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardContent;