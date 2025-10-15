// src/components/layout/Sidebar/Sidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const navigationLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: dashboardIcon },
  { name: 'Live Tracking', href: '/live-tracking', icon: trackingIcon },
  { name: 'Products', href: '/products', icon: productsIcon },
  { name: 'Order Lists', href: '/orderlist', icon: ordersIcon },
  { name: 'Employees', href: '/employees', icon: employeesIcon },
  { name: 'Attendance', href: '/attendance', icon: attendanceIcon },
  { name: 'Parties', href: '/parties', icon: partiesIcon },
  { name: 'Prospects', href: '/prospects', icon: prospectsIcon },
  { name: 'Sites', href: '/sites', icon: sitesIcon },
  { name: 'Analytics', href: '/analytics', icon: analyticsIcon },
  { name: 'Beat Plan', href: '/beat-plan', icon: beatPlanIcon },
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col overflow-y-auto bg-white border-r border-gray-200">
      
      <div className="flex h-20 shrink-0 items-center -ml-8">
        <img className="h-10 w-auto" src={logo} alt="SalesSphere" />
        <span className="-ml-12 text-xl font-bold">
          <span className="text-secondary">Sales</span><span className="text-gray-800">Sphere</span>
        </span>
      </div>

      {/* Navigation Section */}
      <nav className="flex flex-1 flex-col justify-between px-2">
        <ul role="list" className="space-y-1">
          {navigationLinks.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={classNames(
                  location.pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                )}
              >
                <img src={item.icon} className="h-6 w-6 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Bottom Links: Settings & Logout */}
        <div className="pb-4">
          <Link to="/settings" className={classNames(
            location.pathname === '/settings'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
            'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
          )}>
            <img src={settingsIcon} className="h-6 w-6 shrink-0" aria-hidden="true" />
            Settings
          </Link>
          <Link to="/" className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
            <img src={logoutIcon} className="h-6 w-6 shrink-0" aria-hidden="true" />
            Logout
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;