import React from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../api/authService';
import { type Employee } from '../../../api/employeeService';

export interface HeaderProps {
    onMenuClick: () => void;
    user: Employee | undefined;
    organizationName: string | undefined;
    subscriptionDaysLeft: number | undefined;
    profileLink?: string;
}

const Header: React.FC<HeaderProps> = ({
    onMenuClick,
    user,
    organizationName,
    subscriptionDaysLeft,
    profileLink = '/settings', // Default to main settings
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
                        to={profileLink}
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

export default Header;
