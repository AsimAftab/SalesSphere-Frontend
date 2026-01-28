import { useState, useEffect } from 'react';
import {
    BuildingOfficeIcon,
    UsersIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../api/authService';
import { getSystemOverview } from '../../../api/SuperAdmin/systemOverviewService';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/SuperadminComponents/card';
import { Loader2 } from 'lucide-react';

export default function SuperAdminDashboard() {
    const { user: currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalOrgs: 0,
        activeOrgs: 0,
        expiredOrgs: 0,
        totalUsers: 0,
        activeUsers: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await getSystemOverview();

            // Calculate stats from the overview data
            // Fix: Access .list property from the response objects
            const organizations = data.organizations?.list || [];
            const systemUsers = data.systemUsers?.list || [];

            setStats({
                totalOrgs: data.organizations?.count || 0,
                activeOrgs: organizations.filter(o => o.isActive).length,
                expiredOrgs: organizations.filter(o => !o.isActive && !o.isSubscriptionActive).length,
                totalUsers: data.systemUsers?.count || 0,
                activeUsers: systemUsers.filter(u => u.isActive).length
            });

        } catch (err: any) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Welcome back, {currentUser?.name}. Here's what's happening in your system today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                        <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrgs}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeOrgs} active across the platform
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeOrgs}</div>
                        <p className="text-xs text-muted-foreground">
                            Organizations with active plans
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expired / Inactive</CardTitle>
                        <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.expiredOrgs}</div>
                        <p className="text-xs text-muted-foreground">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Users</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeUsers} active admins/developers
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
