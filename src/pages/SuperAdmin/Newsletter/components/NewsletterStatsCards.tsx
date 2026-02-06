import React from 'react';
import {
    CheckCircle,
    Users,
    XCircle,
} from 'lucide-react';
import { StatCard } from '@/components/ui';
import type { SubscriberStats } from '../types';

interface NewsletterStatsCardsProps {
    stats: SubscriberStats | null;
}

const NewsletterStatsCards: React.FC<NewsletterStatsCardsProps> = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
                title="Total Subscribers"
                value={stats.total}
                icon={<Users className="h-6 w-6 text-blue-600" />}
                iconBgColor="bg-blue-50"
            />
            <StatCard
                title="Active Subscribers"
                value={stats.active}
                icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                iconBgColor="bg-green-50"
            />
            <StatCard
                title="Unsubscribed"
                value={stats.unsubscribed}
                icon={<XCircle className="h-6 w-6 text-gray-500" />}
                iconBgColor="bg-gray-100"
            />
        </div>
    );
};

export default NewsletterStatsCards;
