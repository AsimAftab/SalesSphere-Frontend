import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../../assets/Image/logo.png';
import dashboardIcon from '../../../assets/Image/icons/dashboard-icon.svg';
import trackingIcon from '../../../assets/Image/icons/tracking-icon.svg';
import productsIcon from '../../../assets/Image/icons/products-icon.svg';
import ordersIcon from '../../../assets/Image/icons/orders-icon.svg';
import employeesIcon from '../../../assets/Image/icons/employees-icon.svg';
import attendanceIcon from '../../../assets/Image/icons/attendance-icon.svg';
import partiesIcon from '../../../assets/Image/icons/parties-icon.svg';
import prospectsIcon from '../../../assets/Image/icons/prospects-icon.svg';
import sitesIcon from '../../../assets/Image/icons/sites-icon.svg';
import analyticsIcon from '../../../assets/Image/icons/analytics-icon.svg';
import beatPlanIcon from '../../../assets/Image/icons/beat-plan-icon.svg';
import tourPlanIcon from '../../../assets/Image/icons/TourPlanIcon.svg';
import collectionIcon from '../../../assets/Image/icons/Rupee (INR).svg';
import expensesIcon from '../../../assets/Image/icons/expensesIcon.svg';
import OdometerIcon from '../../../assets/Image/icons/Odometer.svg';
import NotesIcon from '../../../assets/Image/icons/NotesIcon.svg';
import miscellaneousWorkIcon from '../../../assets/Image/icons/miscellaneousWorkIcon.svg';
import settingsIcon from '../../../assets/Image/icons/settings-icon.svg';
import logoutIcon from '../../../assets/Image/icons/logout-icon.svg';
import { useAuth } from '../../../api/authService';
import { fetchMyOrganization } from '../../../api/SuperAdmin/organizationService';
import { logout } from '../../../api/authService';
import { type Employee } from '../../../api/employeeService';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../../api/authService';
import ConfirmationModal from '../../modals/ConfirmationModal';

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

const classNames = (...classes: (string | boolean)[]) =>
  classes.filter(Boolean).join(' ');

const SidebarMenu: React.FC = () => {
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 1. Extract isLoading from the hook
  const { hasPermission, isFeatureEnabled, isSuperAdmin, isDeveloper, isAdmin, isLoading, user } = useAuth(); // Added hasPermission

  // DEBUG LOGS
  useEffect(() => {
    if (!isLoading && user) {
    }
  }, [isLoading, user, isFeatureEnabled, hasPermission]);

  // 2. Define Navigation Links with explicit permissions from Feature Registry
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
    { name: 'Order Lists', href: '/order-lists', icon: ordersIcon, module: 'orderLists', permission: 'viewList' }, // Virtual module
    { name: 'Employees', href: '/employees', icon: employeesIcon, module: 'employees', permission: 'viewList' },
    { name: 'Attendance', href: '/attendance', icon: attendanceIcon, module: 'attendance', permission: 'viewMyAttendance' }, // or viewTeamAttendance
    { name: 'Leaves', href: '/leaves', icon: attendanceIcon, module: 'leaves', permission: 'viewList' },
    { name: 'Parties', href: '/parties', icon: partiesIcon, module: 'parties', permission: 'viewList' },
    { name: 'Prospects', href: '/prospects', icon: prospectsIcon, module: 'prospects', permission: 'viewList' },
    { name: 'Sites', href: '/sites', icon: sitesIcon, module: 'sites', permission: 'viewList' },
    // 'rawMaterials' is NOT in featureRegistry.js. Using generic 'viewList' effectively disables it unless backend adds it.
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

  // 3. Centralized Permission Logic
  const isAllowed = (item: { module: string; permission?: string | string[] }) => {
    // A. System roles have full access
    if (isAdmin || isSuperAdmin || isDeveloper) return true;

    // B. Special handling for 'orderLists' (Virtual Module)
    if (item.module === 'orderLists') {
      const planHasInvoices = isFeatureEnabled('invoices');
      const planHasEstimates = isFeatureEnabled('estimates');

      // Use 'viewList' as defined in registry for these modules
      // Using hasPermission since can() only accepts specific keys
      const canViewInvoices = hasPermission('invoices', 'viewList');
      const canViewEstimates = hasPermission('estimates', 'viewList');

      return (planHasInvoices && canViewInvoices) || (planHasEstimates && canViewEstimates);
    }

    // C. Check Subscription Plan
    if (!isFeatureEnabled(item.module)) return false;

    // D. Check Role Permission
    const permKey = item.permission || 'view';

    if (Array.isArray(permKey)) {
      // If any of the permissions in the array are granted, show the link
      return permKey.some(key => hasPermission(item.module, key));
    }

    // Explicitly handle string case to satisfy TypeScript
    if (typeof permKey === 'string') {
      return hasPermission(item.module, permKey);
    }

    return false;
  };

  if (isLoading) {
    return (
      <div className="flex grow flex-col gap-y-5 bg-white px-6 pb-4 border-r border-gray-200 h-full">
        <div className="flex h-16 shrink-0 items-center -ml-12 animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded ml-16"></div>
        </div>
        <div className="space-y-4 mt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-md w-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200 h-full">
        {/* Logo Section */}
        <div className="flex h-16 shrink-0 items-center -ml-12">
          <img className="h-10 w-auto" src={logo} alt="SalesSphere" />
          <span className="-ml-12 text-xl font-bold">
            <span className="text-secondary">Sales</span>
            <span className="text-gray-800">Sphere</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              {/* Standard Organization Modules - HIDDEN for System Admins */}
              {!(isSuperAdmin || isDeveloper) && (
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationLinks.map((item) => {
                    // Use the centralized isAllowed function
                    if (!isAllowed(item)) return null;

                    const isActive =
                      location.pathname === item.href ||
                      location.pathname.startsWith(`${item.href}/`);

                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            isActive
                              ? 'bg-primary text-white'
                              : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <img
                            src={item.icon}
                            className={classNames(
                              'h-6 w-6 shrink-0',
                              isActive ? '[filter:brightness(0)_invert(1)]' : ''
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            <li className="mt-auto">
              <div className="mb-4 -mx-6 border-t border-gray-300" aria-hidden="true" />

              <Link
                to="/settings"
                className={classNames(
                  location.pathname === '/settings' ? 'bg-primary text-white' : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                  'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                )}
              >
                <img
                  src={settingsIcon}
                  className={classNames('h-6 w-6 shrink-0', location.pathname === '/settings' ? '[filter:brightness(0)_invert(1)]' : '')}
                  aria-hidden="true"
                />
                Settings
              </Link>


              {/* 4. DYNAMIC ADMIN PANEL ACCESS:
                  Only show if user is a Platform Owner or has 'settings' (admin) permission */}
              {/* Admin Panel Link - Ensure this logic matches AppRoutes.tsx */}
              {(isSuperAdmin || isDeveloper || isAdmin) && (
                <Link
                  to="/admin-panel"
                  className={classNames(
                    location.pathname === '/admin-panel' ? 'bg-primary text-white' : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                    'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 mb-1'
                  )}
                >
                  <img
                    src={settingsIcon}
                    className={classNames('h-6 w-6 shrink-0', location.pathname === '/admin-panel' ? '[filter:brightness(0)_invert(1)]' : '')}
                  />
                  Admin Panel
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-600 hover:bg-gray-100 hover:text-red-600"
              >
                <img src={logoutIcon} className="h-6 w-6 shrink-0" aria-hidden="true" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out of SalesSphere?"
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        confirmButtonText="Logout"
        confirmButtonVariant="danger"
      />
    </>
  );
};

// --- Internal Header Component ---
interface HeaderProps {
  onMenuClick: () => void;
  user: Employee | undefined;
  organizationName: string | undefined;
  subscriptionDaysLeft: number | undefined;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  user,
  organizationName,
  subscriptionDaysLeft,
}) => {
  const { isSuperAdmin, isDeveloper } = useAuth();
  const displayOrgName = (isSuperAdmin || isDeveloper) ? 'SalesSphere System' : (organizationName || 'My Organization');
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarFallback = `https://placehold.co/40x40/E2E8F0/4A5568?text=${initial}`;

  const getSubscriptionTag = () => {
    if (subscriptionDaysLeft === undefined) {
      return null;
    }

    const isExpiredOrEndingSoon = subscriptionDaysLeft <= 15;
    const isExpired = subscriptionDaysLeft === 0;

    const bgColor = isExpiredOrEndingSoon ? 'bg-red-100' : 'bg-green-100';
    const textColor = isExpiredOrEndingSoon ? 'text-red-700' : 'text-green-700';
    const text = isExpired ? 'Expired' : `${subscriptionDaysLeft} Days Left`;

    return (
      <span
        className={`ml-3 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${bgColor} ${textColor}`}
      >
        {text}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" />
      </button>
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end lg:justify-between">
        {/* Organization Info (hidden on mobile) */}
        <div className="hidden lg:flex items-center">
          <p className="text-xl font-bold text-gray-900">
            {displayOrgName}
          </p>
          {getSubscriptionTag()}
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Link
            to="/settings"
            className="flex items-center group transition-opacity hover:opacity-80"
          >
            <img
              className="h-10 w-10 rounded-full bg-gray-50"
              src={user?.avatarUrl || avatarFallback}
              alt={user ? `${user.name}'s avatar` : 'User avatar'}
            />
            <div className="ml-3 hidden lg:block">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || 'Loading...'}
              </p>
              <p className="text-xs text-gray-500">
                {(typeof user?.customRoleId === 'object' && user?.customRoleId?.name)
                  ? user.customRoleId.name
                  : (user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : '...')}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

// --- Main Layout Component ---
const SidebarLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
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
    // Assuming the data shape from your API service
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
            <SidebarMenu />
          </div>
        </div>
      </div>

      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarMenu />
      </aside>

      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
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