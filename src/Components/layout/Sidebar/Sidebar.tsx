import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/Image/logo.png'; 
import dashboardIcon from '../../../assets/Image/icons/dashboard-icon.png';
import trackingIcon from '../../../assets/Image/icons/tracking-icon.png';
import productsIcon from '../../../assets/Image/icons/products-icon.png';
import ordersIcon from '../../../assets/Image/icons/orders-icon.png';
import employeesIcon from '../../../assets/Image/icons/employees-icon.png';
import attendanceIcon from '../../../assets/Image/icons/attendance-icon.png';
import partiesIcon from '../../../assets/Image/icons/parties-icon.png';
import prospectsIcon from '../../../assets/Image/icons/prospects-icon.png';
import sitesIcon from '../../../assets/Image/icons/sites-icon.png';
import analyticsIcon from '../../../assets/Image/icons/analytics-icon.png';
import beatPlanIcon from '../../../assets/Image/icons/beat-plan-icon.png';
import settingsIcon from '../../../assets/Image/icons/settings-icon.png';
import logoutIcon from '../../../assets/Image/icons/logout-icon.png';

const navigationLinks = [
  { name: 'Dashboard', href: '#', icon: dashboardIcon, current: true },
  { name: 'Live Tracking', href: '#', icon: trackingIcon, current: false },
  { name: 'Products', href: '#', icon: productsIcon, current: false },
  { name: 'Order Lists', href: '#', icon: ordersIcon, current: false },
  { name: 'Employees', href: '#', icon: employeesIcon, current: false },
  { name: 'Attendance', href: '#', icon: attendanceIcon, current: false },
  { name: 'Parties', href: '#', icon: partiesIcon, current: false },
  { name: 'Prospects', href: '#', icon: prospectsIcon, current: false },
  { name: 'Sites', href: '#', icon: sitesIcon, current: false },
  { name: 'Analytics', href: '#', icon: analyticsIcon, current: false },
  { name: 'Beat Plan', href: '#', icon: beatPlanIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar: React.FC = () => {
  return (
    <aside className="flex h-screen w-64 flex-col overflow-y-auto bg-white border-r border-gray-200">
      {/* --- FIX: Aligned logo to the left with padding for a stable layout --- */}
      <div className="flex h-20 shrink-0 items-center justify-start gap-x-200 -px-80">
        <img className="h-10 w-auto" src={logo} alt="SalesSphere" />
        <span className="text-gray-800 text-2xl font-bold">SalesSphere</span>
      </div>

      {/* Navigation Section */}
      <nav className="flex flex-1 flex-col justify-between px-2">
        <ul role="list" className="space-y-1">
          {navigationLinks.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                )}
              >
                <img src={item.icon} className="h-6 w-6 shrink-0" aria-hidden="true" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        
        {/* Bottom Links: Settings & Logout */}
        <div className="pb-4">
          <a href="#" className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
            <img src={settingsIcon} className="h-6 w-6 shrink-0" aria-hidden="true" />
            Settings
          </a>
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
