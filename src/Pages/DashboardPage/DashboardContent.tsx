import React from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../components/UI/EmptyState/EmptyState';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import DashboardHeader from './components/DashboardHeader';
import DashboardSkeleton from './components/DashboardSkeleton';

// Domain Logic and Types
import { type FullDashboardData } from '../../api/dashboardService';
import { type DashboardPermissions } from './components/useDashboardViewState';

// Components
import StatCard from '../../components/shared_cards/StatCard';
import TeamPerformanceCard from './components/TeamPerformanceCard';
import AttendanceSummaryCard from './components/AttendanceSummaryCard';
import SalesTrendChart from './components/SalesTrendChart';
import LiveActivitiesCard from './components/LiveActivitiesCard';
import PartyDistributionCard from './components/PartyDistributionCard';
import RecentCollectionsCard from './components/RecentCollectionsCard';
import { IndianRupee, ShoppingCart, Clock } from 'lucide-react';

import PartiesIcon from '../../components/icons/PartiesIcon';

interface DashboardContentProps {
  data: FullDashboardData | null;
  loading: boolean;
  error: string | null;
  userName: string;
  permissions: DashboardPermissions;
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

const DashboardContent: React.FC<DashboardContentProps> = ({
  data,
  loading,
  error,
  userName,
  permissions
}) => {
  if (loading) return <DashboardSkeleton />;

  if (error) return (
    <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg m-4">
      {error}
    </div>
  );

  if (!data) return (
    <EmptyState
      title="Dashboard Unavailable"
      description="We couldn't load the latest dashboard data. Please check your connection or try refreshing."
      icon={
        <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      }
      action={
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
        >
          Reload Dashboard
        </button>
      }
    />
  );

  const { stats, teamPerformance, attendanceSummary, salesTrend, liveActivities } = data;

  const statCardsData = useMemo(() => [
    {
      title: "Total No. of Parties",
      value: stats.totalParties, // Use the stats value
      icon: <PartiesIcon className="h-6 w-6 text-blue-600" />,
      iconBgColor: 'bg-blue-100',
      link: '/parties',
    },
    {
      title: "Today's Total Parties",
      value: stats.totalPartiesToday,
      icon: <PartiesIcon className="h-6 w-6 text-blue-600" />,
      iconBgColor: 'bg-blue-100',
      link: '/parties?filter=today',
    },
    {
      title: "Today's Total Orders",
      value: stats.totalOrdersToday,
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
      iconBgColor: 'bg-purple-100',
      link: '/order-lists?filter=today',
    },
    {
      title: 'Total Pending Orders',
      value: stats.pendingOrders,
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      iconBgColor: 'bg-orange-100',
      link: '/order-lists?status=pending',
    },
    {
      title: "Today's Total Order Value",
      value: `Rs ${Number(stats.totalSalesToday).toLocaleString('en-IN')}`,
      icon: <IndianRupee className="h-6 w-6 text-green-600" />,
      iconBgColor: 'bg-green-100',
    },], [stats]);

  return (
    <div className="p-1 md:p-0">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
        variants={gridContainerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="lg:col-span-12">
          <DashboardHeader userName={userName} />
        </div>
        {/* Row 1: Stat Cards - separate grid for 5 columns */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {permissions.canViewStats && statCardsData.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className="h-full"
            >
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* Row 2: Live Metrics & Teams */}
        {permissions.canViewTeam && (
          <motion.div className="lg:col-span-4 h-[23rem] rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
            <TeamPerformanceCard data={teamPerformance} />
          </motion.div>
        )}

        {permissions.canViewAttendance && (
          <motion.div className="lg:col-span-4 h-[23rem] rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
            <AttendanceSummaryCard data={attendanceSummary} />
          </motion.div>
        )}

        {permissions.canViewLive && (
          <motion.div className="lg:col-span-4 h-[23rem] rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
            <LiveActivitiesCard data={liveActivities} />
          </motion.div>
        )}

        {/* Row 3: Business Health Overview */}
        <motion.div className="lg:col-span-4 h-96 rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
          <PartyDistributionCard />
        </motion.div>

        <motion.div className="lg:col-span-8 h-96 rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
          <RecentCollectionsCard />
        </motion.div>

        {/* Row 4: Full Width Charts */}
        {permissions.canViewTrend && (
          <motion.div className="lg:col-span-12 min-h-[300px] rounded-lg hover:shadow-lg transition-shadow" variants={cardVariants}>
            <SalesTrendChart data={salesTrend} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardContent;