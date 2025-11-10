import React, { useState,useMemo } from 'react';
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
import settingsIcon from '../../../assets/Image/icons/settings-icon.svg';
import logoutIcon from '../../../assets/Image/icons/logout-icon.svg';
import { fetchMyOrganization } from '../../../api/services/superadmin/organizationService';
import { logout } from '../../../api/authService';
import { type Employee, getMyProfile } from '../../../api/employeeService'; 
import { useQuery } from '@tanstack/react-query'; 

const USER_PROFILE_QUERY_KEY = 'myProfile';
const ORG_QUERY_KEY = 'myOrganization'; 

const calculateDaysLeft = (endDateString: string | undefined): number | undefined => {
  if (!endDateString) {
    return undefined;
  }

  try {
    const endDate = new Date(endDateString);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();

    if (diffTime < 0) {
      return 0;
    }

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;

  } catch (error) {
    console.error("Error parsing end date:", error);
    return undefined;
  }
};

const classNames = (...classes: (string | boolean)[]) => classes.filter(Boolean).join(' ');

const SidebarMenu: React.FC = () => {
    const location = useLocation();
    const navigationLinks = [
      { name: 'Dashboard', href: '/dashboard', icon: dashboardIcon },
      { name: 'Live Tracking', href: '/live-tracking', icon: trackingIcon },
      { name: 'Products', href: '/products', icon: productsIcon },
      { name: 'Order Lists', href: '/order-lists', icon: ordersIcon },
      { name: 'Employees', href: '/employees', icon: employeesIcon },
      { name: 'Attendance', href: '/attendance', icon: attendanceIcon },
      { name: 'Parties', href: '/parties', icon: partiesIcon },
      { name: 'Prospects', href: '/prospects', icon: prospectsIcon },
      { name: 'Sites', href: '/sites', icon: sitesIcon },
      { name: 'Analytics', href: '/analytics', icon: analyticsIcon },
      { name: 'Beat Plan', href: '/beat-plan', icon: beatPlanIcon },
    ];

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200 h-full">
            <div className="flex h-16 shrink-0 items-center -ml-12">
                <img className="h-10 w-auto" src={logo} alt="SalesSphere" />
                <span className="-ml-12 text-xl font-bold">
                    <span className="text-secondary">Sales</span><span className="text-gray-800">Sphere</span>
                </span>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigationLinks.map((item) => {
                                const isActive = location.pathname === item.href;
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
                    </li>
                    <li className="mt-auto">
                        <Link
                            to="/settings"
                            className={classNames(
                                location.pathname === '/settings'
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                                'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            )}
                        >
                            <img
                                src={settingsIcon}
                                className={classNames(
                                    'h-6 w-6 shrink-0',
                                    location.pathname === '/settings' ? '[filter:brightness(0)_invert(1)]' : ''
                                )}
                                aria-hidden="true"
                            />
                           Settings
                        </Link>
                        
                        <button
                            type="button"
                            onClick={logout}  
                            className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-600 hover:bg-gray-100 hover:text-red-600"
                        >
                            <img src={logoutIcon} className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Logout
                        </button>
                   </li>
                </ul>
            </nav>
        </div>
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
  subscriptionDaysLeft 
}) => {
    
 
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const avatarFallback = `https://placehold.co/40x40/E2E8F0/4A5568?text=${initial}`;

  const getSubscriptionTag = () => {
    if (subscriptionDaysLeft === undefined) {
      return null;
    }
    
    const isEndingSoon = subscriptionDaysLeft <= 15;
    const isExpired = subscriptionDaysLeft === 0;

    const bgColor = isExpired ? 'bg-red-100' : isEndingSoon ? 'bg-yellow-100' : 'bg-green-100';
    const textColor = isExpired ? 'text-red-700' : isEndingSoon ? 'text-yellow-700' : 'text-green-700';
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
      <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={onMenuClick}>
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" />
      </button>
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>
      
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        
        {/* Organization Info (hidden on mobile) */}
        <div className="hidden lg:flex items-center">
          <p className="text-xl font-bold text-gray-900">
            {organizationName || 'Loading Org...'}
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
              src={user?.avatarUrl || avatarFallback} // Assuming user type has avatarUrl
              alt={user ? `${user.name}'s avatar` : "User avatar"} 
            />
            <div className="ml-3 hidden lg:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name || 'Loading...'}</p>
              <p className="text-xs text-gray-500">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '...'}</p>
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
        queryFn: getMyProfile,
    });
    const user = userQuery.data;

    // --- ADDED: Fetch organization data ---
    const orgQuery = useQuery({
      queryKey: [ORG_QUERY_KEY],
      queryFn: fetchMyOrganization,
      staleTime: 1000 * 60 * 60, // Cache for 1 hour
    });

    // --- ADDED: Calculate subscription days ---
    const subscriptionDaysLeft = useMemo(() => {
      // Assuming the data shape from your API service
      return calculateDaysLeft(orgQuery.data?.data?.subscriptionEndDate); 
    }, [orgQuery.data]);
    // --- END OF ADDITIONS ---

    return (
        <div className="min-h-screen bg-gray-100">
           {/* Mobile Sidebar */}
           <div className={`relative z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-0 flex">
                 <div className="relative mr-16 flex w-full max-w-xs flex-1">
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
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