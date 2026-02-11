import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/images/logo-c.svg';
import settingsIcon from '@/assets/images/icons/settings-icon.svg';
import adminPanelIcon from '@/assets/images/icons/admin-panel-icon.svg';
import logoutIcon from '@/assets/images/icons/logout-icon.svg';
import { useAuth } from '@/api/authService';
import { logout } from '@/api/authService';
import ConfirmationModal from '../../modals/CommonModals/ConfirmationModal';

export interface MenuItem {
    name: string;
    href: string;
    icon: string;
    module?: string;
    permission?: string | string[];
    activePaths?: string[];
}

interface SidebarMenuProps {
    navigationLinks: MenuItem[];
    settingsPath?: string;
    showAdminPanel?: boolean;
    onNavigate?: () => void;
}

const classNames = (...classes: (string | boolean)[]) =>
    classes.filter(Boolean).join(' ');

const SidebarMenu: React.FC<SidebarMenuProps> = ({
    navigationLinks,
    settingsPath = '/settings',
    showAdminPanel = true,
    onNavigate
}) => {
    const location = useLocation();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const activeItemRef = useRef<HTMLAnchorElement>(null);

    // Extract isLoading from the hook
    const { hasPermission, isFeatureEnabled, isSuperAdmin, isDeveloper, isAdmin, isLoading } = useAuth();

    // Scroll active menu item into view
    useEffect(() => {
        if (activeItemRef.current && navRef.current) {
            const navRect = navRef.current.getBoundingClientRect();
            const itemRect = activeItemRef.current.getBoundingClientRect();

            // Check if the active item is outside the visible area
            if (itemRect.top < navRect.top || itemRect.bottom > navRect.bottom) {
                activeItemRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }, [location.pathname]);

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
            <div className="flex grow flex-col bg-white border-r border-gray-200 h-full">
                {/* Logo Section - Fixed, matches header h-16 */}
                <div className="flex h-16 shrink-0 items-center gap-2.5 px-6 border-b border-gray-100">
                    <img className="h-9 w-9" src={logo} alt="SalesSphere" />
                    <span className="text-[22px] font-bold tracking-tight">
                        <span className="text-secondary">Sales</span>
                        <span className="text-gray-800">Sphere</span>
                    </span>
                </div>

                {/* Scrollable Navigation */}
                <nav ref={navRef} className="flex-1 overflow-y-auto px-6 pt-5 pb-4">
                    <ul className="-mx-2 space-y-1">
                        {navigationLinks.map((item) => {
                            if (!isAllowed(item)) return null;

                            const matchesPath = (path: string) =>
                                path === location.pathname || location.pathname.startsWith(`${path}/`);

                            const isActive =
                                matchesPath(item.href) ||
                                (item.activePaths?.some((path) => matchesPath(path)) ?? false);

                            return (
                                <li key={item.name}>
                                    <Link
                                        ref={isActive ? activeItemRef : null}
                                        to={item.href}
                                        onClick={onNavigate}
                                        className={classNames(
                                            isActive
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                        )}
                                    >
                                        <img
                                            src={item.icon}
                                            alt=""
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
                </nav>

                {/* Fixed Footer */}
                <div className="shrink-0 border-t border-gray-200 px-6 py-3 space-y-1">
                    <Link
                        to={settingsPath}
                        onClick={onNavigate}
                        className={classNames(
                            location.pathname === settingsPath ? 'bg-primary text-white' : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                            'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                        )}
                    >
                        <img
                            src={settingsIcon}
                            alt=""
                            className={classNames('h-6 w-6 shrink-0', location.pathname === settingsPath ? '[filter:brightness(0)_invert(1)]' : '')}
                            aria-hidden="true"
                        />
                        Settings
                    </Link>

                    {showAdminPanel && (isSuperAdmin || isDeveloper || isAdmin) && (
                        <Link
                            to="/admin-panel"
                            onClick={onNavigate}
                            className={classNames(
                                location.pathname === '/admin-panel' ? 'bg-primary text-white' : 'text-gray-600 hover:text-secondary hover:bg-gray-100',
                                'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            )}
                        >
                            <img
                                src={adminPanelIcon}
                                alt=""
                                className={classNames('h-6 w-6 shrink-0', location.pathname === '/admin-panel' ? '[filter:brightness(0)_invert(1)]' : '')}
                                aria-hidden="true"
                            />
                            Admin Panel
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-600 hover:bg-gray-100 hover:text-red-600"
                    >
                        <img src={logoutIcon} alt="" className="h-6 w-6 shrink-0" aria-hidden="true" />
                        Logout
                    </button>
                </div>
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
