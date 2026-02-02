import React from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/api/authService';

export interface HeaderProps {
    onMenuClick: () => void;
    user: {
        name?: string;
        avatarUrl?: string;
        role?: string;
        customRoleId?: { name: string } | string;
    } | null | undefined;
    organizationName: string | undefined;
    subscriptionDaysLeft: number | undefined;
    profileLink?: string;
}

const Header: React.FC<HeaderProps> = ({
    onMenuClick,
    user,
    organizationName,
    subscriptionDaysLeft,
    profileLink = '/settings',
}) => {
    const { isSuperAdmin, isDeveloper } = useAuth();
    const isAdmin = isSuperAdmin || isDeveloper;
    const displayOrgName = isAdmin ? 'Administration Console' : (organizationName || 'My Organization');
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
    const avatarFallback = `https://placehold.co/40x40/197ADC/ffffff?text=${initial}`;

    const roleName = (typeof user?.customRoleId === 'object' && user?.customRoleId?.name)
        ? user.customRoleId.name
        : (user?.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : '...');

    const renderSubscriptionBadge = () => {
        if (subscriptionDaysLeft === undefined || isAdmin) return null;

        const isExpired = subscriptionDaysLeft === 0;
        const isWarning = subscriptionDaysLeft > 0 && subscriptionDaysLeft <= 15;

        if (isExpired) {
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-xs font-semibold text-red-600">Subscription Expired</span>
                </div>
            );
        }

        if (isWarning) {
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
                    <CalendarClock className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600">
                        Expires in <span className="font-bold">{subscriptionDaysLeft}</span> {subscriptionDaysLeft === 1 ? 'day' : 'days'}
                    </span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600">
                    <span className="font-bold">{subscriptionDaysLeft}</span> {subscriptionDaysLeft === 1 ? 'day' : 'days'} remaining
                </span>
            </div>
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
                {/* Left: Organization / Console Info */}
                <div className="hidden lg:flex items-center gap-4">
                    {!isAdmin && (
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
                            <BuildingOffice2Icon className="h-5 w-5 text-white" />
                        </div>
                    )}
                    <h1 className="text-base font-bold text-gray-900">
                        {displayOrgName}
                    </h1>

                    {subscriptionDaysLeft !== undefined && !isAdmin && (
                        <div className="h-6 w-px bg-gray-200 mx-1" />
                    )}

                    {renderSubscriptionBadge()}
                </div>

                {/* Right: Profile */}
                <div className="flex items-center">
                    <Link
                        to={profileLink}
                        className="flex items-center gap-3 group"
                    >
                        <img
                            className="h-10 w-10 rounded-full bg-gray-50 ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all"
                            src={user?.avatarUrl || avatarFallback}
                            alt={user ? `${user.name}'s avatar` : 'User avatar'}
                        />
                        <div className="hidden lg:block">
                            <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                                {user?.name || 'Loading...'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {roleName}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
