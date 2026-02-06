import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/api/authService';
import Header from '../../layout/Header/Header';
import SidebarMenu from '../Sidebar/SidebarMenu';

// Import Icons
import dashboardIcon from '@/assets/images/icons/dashboard-icon.svg';
import employeesIcon from '@/assets/images/icons/employees-icon.svg';
import sitesIcon from '@/assets/images/icons/sites-icon.svg';
import beatPlanIcon from '@/assets/images/icons/beat-plan-icon.svg'; // Using as proxy for plans
import notesIcon from '@/assets/images/icons/notes-icon.svg'; // Using for newsletter


// TODO: Ideally use dedicated SVG files for these

import { X } from 'lucide-react';

const USER_PROFILE_QUERY_KEY = 'myProfile';

const superAdminNavigation = [
    {
        name: 'Dashboard',
        href: '/system-admin/dashboard',
        icon: dashboardIcon,
        module: 'superAdminDashboard', // Virtual module
    },
    {
        name: 'Organizations',
        href: '/system-admin/organizations',
        icon: sitesIcon,
        module: 'organizations',
    },
    {
        name: 'Subscription Plans',
        href: '/system-admin/plans',
        icon: beatPlanIcon,
        module: 'plans',
    },
    {
        name: 'System Users',
        href: '/system-admin/users',
        icon: employeesIcon,
        module: 'systemUsers',
    },

    {
        name: 'Newsletter',
        href: '/system-admin/newsletter',
        icon: notesIcon,
        module: 'newsletter',
    },

];

const SuperAdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetches the user's profile
    const userQuery = useQuery({
        queryKey: [USER_PROFILE_QUERY_KEY],
        queryFn: getCurrentUser,
    });
    const user = userQuery.data;

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
                    onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
                    role="button"
                    tabIndex={0}
                    aria-label="Close sidebar"
                />
                <div className="fixed inset-0 flex">
                    <div className="relative mr-16 flex w-full max-w-xs flex-1">
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>

                        <SidebarMenu
                            navigationLinks={superAdminNavigation}
                            settingsPath="/system-admin/settings"
                            showAdminPanel={false}
                            onNavigate={() => setSidebarOpen(false)}
                        />

                    </div>
                </div>
            </div>

            <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <SidebarMenu
                    navigationLinks={superAdminNavigation}
                    settingsPath="/system-admin/settings"
                    showAdminPanel={false}
                />
            </aside>

            <div className="lg:pl-64">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    user={user}
                    organizationName="Administration Console"
                    subscriptionDaysLeft={undefined} // Not applicable for SuperAdmin
                    profileLink="/system-admin/settings"
                />
                <main className="py-4 lg:py-6">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
