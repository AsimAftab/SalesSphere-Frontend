import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// --- (icon imports remain the same) ---
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

import { logout } from '../../../api/authService';
import { type Employee, getMyProfile } from '../../../api/employeeService'; 
import { useQuery } from '@tanstack/react-query'; 

const USER_PROFILE_QUERY_KEY = 'myProfile';

const classNames = (...classes: (string | boolean)[]) => classes.filter(Boolean).join(' ');

// --- Internal Sidebar Menu Component (No change) ---
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
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, user }) => {
    
    const initial = user?.name ? user.name.charAt(0).toUpperCase():0;
    const avatarFallback = `https://placehold.co/40x40/E2E8F0/4A5568?text=${initial}`;
    
    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={onMenuClick}>
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>
            
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    
                    {/* --- FIX: WRAP PROFILE IN LINK TO /settings --- */}
                    <Link 
                        to="/settings" 
                        className="flex items-center group transition-opacity hover:opacity-80"
                    >
                        <img 
                            // --- FIX: INCREASED AVATAR SIZE ---
                            className="h-10 w-10 rounded-full bg-gray-50" // <-- Was h-8 w-8
                            src={user?.avatarUrl || avatarFallback} 
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
    

    const userQuery = useQuery({
        queryKey: [USER_PROFILE_QUERY_KEY], 
        queryFn: getMyProfile,
    });
    
  const user = userQuery.data;

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

            {/* Static Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <SidebarMenu />
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64">
                <Header onMenuClick={() => setSidebarOpen(true)} user={user} />
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
