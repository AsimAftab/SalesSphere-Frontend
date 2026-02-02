import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { useAuth, getCurrentUser } from '../../../api/authService';
import { fetchMyOrganization } from '../../../api/superAdmin/organizationService';

import Header from '../../layout/Header/Header';
import SidebarMenu from './SidebarMenu';

// Import Icons
import dashboardIcon from '../../../assets/images/icons/dashboard-icon.svg';
import trackingIcon from '../../../assets/images/icons/tracking-icon.svg';
import productsIcon from '../../../assets/images/icons/products-icon.svg';
import ordersIcon from '../../../assets/images/icons/orders-icon.svg';
import employeesIcon from '../../../assets/images/icons/employees-icon.svg';
import attendanceIcon from '../../../assets/images/icons/attendance-icon.svg';
import leavesIcon from '../../../assets/images/icons/leaves-icon.svg';
import partiesIcon from '../../../assets/images/icons/parties-icon.svg';
import prospectsIcon from '../../../assets/images/icons/prospects-icon.svg';
import sitesIcon from '../../../assets/images/icons/sites-icon.svg';
import analyticsIcon from '../../../assets/images/icons/analytics-icon.svg';
import beatPlanIcon from '../../../assets/images/icons/beat-plan-icon.svg';
import tourPlanIcon from '../../../assets/images/icons/tour-plan-icon.svg';
import collectionIcon from '../../../assets/images/icons/collection.svg';
import expensesIcon from '../../../assets/images/icons/expenses-icon.svg';
import OdometerIcon from '../../../assets/images/icons/odometer.svg';
import NotesIcon from '../../../assets/images/icons/notes-icon.svg';
import miscellaneousWorkIcon from '../../../assets/images/icons/miscellaneous-work-icon.svg';

const USER_PROFILE_QUERY_KEY = 'myProfile';
const ORG_QUERY_KEY = 'myOrganization';

const calculateDaysLeft = (
  endDateString: string | undefined
): number | undefined => {
  if (!endDateString) {
    return undefined;
  }

  try {
    const endDate = new Date(endDateString);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate.getTime() - today.getTime();

    if (diffTime < 0) {
      return 0;
    }

    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error('Error parsing end date:', error);
    return undefined;
  }
};

const navigationLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: dashboardIcon,
    module: 'dashboard',
    permission: ['viewStats', 'viewTeamPerformance', 'viewAttendanceSummary', 'viewSalesTrend']
  },
  { name: 'Live Tracking', href: '/live-tracking', icon: trackingIcon, module: 'liveTracking', permission: 'viewLiveTracking' },
  { name: 'Products', href: '/products', icon: productsIcon, module: 'products', permission: 'viewList' },
  { name: 'Order Lists', href: '/order-lists', icon: ordersIcon, module: 'orderLists', permission: 'viewList' },
  { name: 'Employees', href: '/employees', icon: employeesIcon, module: 'employees', permission: 'viewList' },
  { name: 'Attendance', href: '/attendance', icon: attendanceIcon, module: 'attendance', permission: 'viewMyAttendance' },
  { name: 'Leaves', href: '/leaves', icon: leavesIcon, module: 'leaves', permission: 'viewList' },
  { name: 'Parties', href: '/parties', icon: partiesIcon, module: 'parties', permission: 'viewList' },
  { name: 'Prospects', href: '/prospects', icon: prospectsIcon, module: 'prospects', permission: 'viewList' },
  { name: 'Sites', href: '/sites', icon: sitesIcon, module: 'sites', permission: 'viewList' },
  { name: 'Raw Materials', href: '/raw-material', icon: sitesIcon, module: 'rawMaterials', permission: 'viewList' },
  { name: 'Analytics', href: '/analytics', icon: analyticsIcon, module: 'analytics', permission: 'viewMonthlyOverview' },
  { name: 'Beat Plan', href: '/beat-plan', icon: beatPlanIcon, module: 'beatPlan', permission: 'viewList' },
  { name: 'Tour Plan', href: '/tour-plan', icon: tourPlanIcon, module: 'tourPlan', permission: 'viewList' },
  { name: 'Collections', href: '/collection', icon: collectionIcon, module: 'collections', permission: 'view' },
  { name: 'Expenses', href: '/expenses', icon: expensesIcon, module: 'expenses', permission: 'viewList' },
  { name: 'Odometer', href: '/odometer', icon: OdometerIcon, module: 'odometer', permission: 'view' },
  { name: 'Notes', href: '/notes', icon: NotesIcon, module: 'notes', permission: 'viewList' },
  { name: 'Miscellaneous Work', href: '/miscellaneous-work', icon: miscellaneousWorkIcon, module: 'miscellaneousWork', permission: 'viewList' },
];

const SidebarLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetches the user's profile
  const userQuery = useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY],
    queryFn: getCurrentUser,
  });
  const user = userQuery.data;

  // --- Fetch organization data ---
  const { isSuperAdmin, isDeveloper } = useAuth();
  const orgQuery = useQuery({
    queryKey: [ORG_QUERY_KEY],
    queryFn: fetchMyOrganization,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    enabled: !isSuperAdmin && !isDeveloper, // Skip for system users
  });

  // --- Calculate subscription days ---
  const subscriptionDaysLeft = useMemo(() => {
    return calculateDaysLeft(orgQuery.data?.data?.subscriptionEndDate);
  }, [orgQuery.data]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar */}
      <div
        className={`relative z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-900/80"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>

            <SidebarMenu navigationLinks={navigationLinks} />

          </div>
        </div>
      </div>

      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarMenu navigationLinks={navigationLinks} />
      </aside>

      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user ?? null}
          organizationName={orgQuery.data?.data?.name}
          subscriptionDaysLeft={subscriptionDaysLeft}
        />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
