import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/logo.webp';
import settingsIcon from '../../../assets/images/icons/settings-icon.svg';
import adminPanelIcon from '../../../assets/images/icons/admin-panel-icon.svg';
import logoutIcon from '../../../assets/images/icons/logout-icon.svg';
import { useAuth } from '../../../api/authService';
import { logout } from '../../../api/authService';
import ConfirmationModal from '../../modals/CommonModals/ConfirmationModal';

export interface MenuItem {
    name: string;
    href: string;
    icon: string;
    module?: string;
    permission?: string | string[];
}

interface SidebarMenuProps {
    navigationLinks: MenuItem[];
    settingsPath?: string;
    showAdminPanel?: boolean;
}

const classNames = (...classes: (string | boolean)[]) =>
    classes.filter(Boolean).join(' ');

const SidebarMenu: React.FC<SidebarMenuProps> = ({
    navigationLinks,
    settingsPath = '/settings',
    showAdminPanel = true
}) => {
    const location = useLocation();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Extract isLoading from the hook
    const { hasPermission, isFeatureEnabled, isSuperAdmin, isDeveloper, isAdmin, isLoading } = useAuth();

    // DEBUG LOGS (no-op, kept for future use)
    // useEffect(() => {
    //     if (!isLoading && user) {}
    // }, [isLoading, user, isFeatureEnabled, hasPermission]);

    // Centralized Permission Logic
    const isAllowed = (item: MenuItem) => {
        // A. System roles have full access if no module specified (e.g., custom links)
        // If it's a super admin layout, we might pass pre-filtered links, but we keep this check for safety
        if (isSuperAdmin || isDeveloper) return true;

        // If no module is defined, assume it's public/shared
        if (!item.module) return true;

        // B. Special handling for 'orderLists' (Virtual Module)
        if (item.module === 'orderLists') {
            const planHasInvoices = isFeatureEnabled('invoices');
            const planHasEstimates = isFeatureEnabled('estimates');

            // Use 'viewList' as defined in registry for these modules
            const canViewInvoices = hasPermission('invoices', 'viewList');
            const canViewEstimates = hasPermission('estimates', 'viewList');

            return (planHasInvoices && canViewInvoices) || (planHasEstimates && canViewEstimates);
        }

        // B2. Special handling for 'analytics' (Composite Module)
        // Show if user has access to sales analytics, prospect dashboard, or sites dashboard
        if (item.module === 'analytics') {
            const canSales = isFeatureEnabled('analytics') && hasPermission('analytics', 'viewMonthlyOverview');
            const canProspects = isFeatureEnabled('prospects') && hasPermission('prospectDashboard', 'viewProspectDashStats');
            const canSites = isFeatureEnabled('sites') && hasPermission('sitesDashboard', 'viewSitesDashStats');
            return canSales || canProspects || canSites;
        }

        // C. Check Subscription Plan
        if (!isFeatureEnabled(item.module)) return false;

        // D. Check Role Permission
        const permKey = item.permission || 'view';

        if (Array.isArray(permKey)) {
            // If any of the permissions in the array are granted, show the link
            return permKey.some(key => hasPermission(item.module!, key));
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
                        </li>

                        <li className="mt-auto">
                            <div className="mb-4 -mx-6 border-t border-gray-300" aria-hidden="true" />

                            <Link
                                to={settingsPath}
                                className={classNames(
                                    location.pathname === settingsPath ? 'bg-primary text-white' : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                                    'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                )}
                            >
                                <img
                                    src={settingsIcon}
                                    className={classNames('h-6 w-6 shrink-0', location.pathname === settingsPath ? '[filter:brightness(0)_invert(1)]' : '')}
                                    aria-hidden="true"
                                />
                                Settings
                            </Link>


                            {/* 4. DYNAMIC ADMIN PANEL ACCESS:
                  Only show if user is a Platform Owner or has 'settings' (admin) permission */}
                            {/* Admin Panel Link - Ensure this logic matches AppRoutes.tsx */}
                            {showAdminPanel && (isSuperAdmin || isDeveloper || isAdmin) && (
                                <Link
                                    to="/admin-panel"
                                    className={classNames(
                                        location.pathname === '/admin-panel' ? 'bg-primary text-white' : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                                        'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 mb-1'
                                    )}
                                >
                                    <img
                                        src={adminPanelIcon}
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

export default SidebarMenu;
