import React from 'react';
import StatCard from '../../../../components/UI/shared_cards/StatCard';
import {
    UsersIcon,
    CheckCircleIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { Building2 } from 'lucide-react';
import type { DashboardStats } from '../types';


interface DashboardStatsProps {
    stats: DashboardStats;
}

const DashboardStatsGrid: React.FC<DashboardStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Organization Stats */}
            <StatCard
                title="TOTAL ORGANIZATIONS"
                value={stats.organizations.total}
                icon={<Building2 className="w-6 h-6 text-blue-600" />}
                iconBgColor="bg-blue-100"
            />
            <StatCard
                title="ACTIVE ORGANIZATIONS"
                value={stats.organizations.active}
                icon={<CheckCircleIcon className="w-6 h-6 text-green-600" />}
                iconBgColor="bg-green-100"
            />
            <StatCard
                title="RECENT ORGANIZATIONS"
                value={stats.organizations.recent}
                icon={<Building2 className="w-6 h-6 text-indigo-600" />}
                iconBgColor="bg-indigo-100"
            />

            {/* User Stats */}
            <StatCard
                title="TOTAL USERS"
                value={stats.users.total}
                icon={<UsersIcon className="w-6 h-6 text-purple-600" />}
                iconBgColor="bg-purple-100"
            />
            <StatCard
                title="ACTIVE USERS"
                value={stats.users.active}
                icon={<UserIcon className="w-6 h-6 text-orange-600" />}
                iconBgColor="bg-orange-100"
            />
            <StatCard
                title="SYSTEM USERS"
                value={stats.users.systemUsers}
                icon={<UserIcon className="w-6 h-6 text-teal-600" />}
                iconBgColor="bg-teal-100"
            />
        </div>
    );
};

export default DashboardStatsGrid;
