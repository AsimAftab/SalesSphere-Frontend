import React from 'react';
import {
    Building2,
    CheckCircle,
    ShieldCheck,
    User,
    Users,
} from 'lucide-react';
import type { DashboardStats } from '../types';
import { StatCard } from '@/components/ui';


interface DashboardStatsProps {
    stats: DashboardStats;
}

const DashboardStatsGrid: React.FC<DashboardStatsProps> = ({ stats }) => {
    return (
        <div className="space-y-6">
            {/* Top Row: Organization Stats + Admins */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="ALL ORGANIZATIONS"
                    value={stats.organizations.total}
                    icon={<Building2 className="w-6 h-6 text-blue-600" />}
                    iconBgColor="bg-blue-100"
                />
                <StatCard
                    title={"ACTIVE ORGANIZATIONS\n(Currently Enabled)"}
                    value={stats.organizations.active}
                    icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                    iconBgColor="bg-green-100"
                />
                <StatCard
                    title={"NEW ORGANIZATIONS\n(Last 30 Days)"}
                    value={stats.organizations.recent}
                    icon={<Building2 className="w-6 h-6 text-indigo-600" />}
                    iconBgColor="bg-indigo-100"
                />
                <StatCard
                    title={"ORG ADMINS\n(Organization-Level)"}
                    value={stats.users.admins}
                    icon={<ShieldCheck className="w-6 h-6 text-rose-600" />}
                    iconBgColor="bg-rose-100"
                />
            </div>

            {/* Bottom Row: User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title={"ALL USERS\n(Across All Orgs)"}
                    value={stats.users.total}
                    icon={<Users className="w-6 h-6 text-purple-600" />}
                    iconBgColor="bg-purple-100"
                />
                <StatCard
                    title={"ACTIVE USERS\n(Currently Online)"}
                    value={stats.users.active}
                    icon={<User className="w-6 h-6 text-orange-600" />}
                    iconBgColor="bg-orange-100"
                />
                <StatCard
                    title={"SYSTEM USERS\n(Superadmins & Devs)"}
                    value={stats.users.systemUsers}
                    icon={<User className="w-6 h-6 text-teal-600" />}
                    iconBgColor="bg-teal-100"
                />
            </div>
        </div>
    );
};

export default DashboardStatsGrid;
