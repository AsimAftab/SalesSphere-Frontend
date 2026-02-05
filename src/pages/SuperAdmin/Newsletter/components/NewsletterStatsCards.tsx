import React from 'react';
import {
  CheckCircle,
  Users,
  XCircle,
} from 'lucide-react';
import type { SubscriberStats } from '../types';

interface NewsletterStatsCardsProps {
    stats: SubscriberStats | null;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
    iconBgColor: string;
    textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor, iconBgColor, textColor }) => (
    <div className={`${bgColor} rounded-xl p-5 border border-gray-100 shadow-sm`}>
        <div className="flex items-center gap-4">
            <div className={`${iconBgColor} p-3 rounded-xl`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className={`text-2xl font-bold ${textColor}`}>{value.toLocaleString()}</p>
            </div>
        </div>
    </div>
);

const NewsletterStatsCards: React.FC<NewsletterStatsCardsProps> = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
                title="Total Subscribers"
                value={stats.total}
                icon={<Users className="h-6 w-6 text-blue-600" />}
                bgColor="bg-white"
                iconBgColor="bg-blue-50"
                textColor="text-blue-700"
            />
            <StatCard
                title="Active Subscribers"
                value={stats.active}
                icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                bgColor="bg-white"
                iconBgColor="bg-green-50"
                textColor="text-green-700"
            />
            <StatCard
                title="Unsubscribed"
                value={stats.unsubscribed}
                icon={<XCircle className="h-6 w-6 text-gray-500" />}
                bgColor="bg-white"
                iconBgColor="bg-gray-100"
                textColor="text-gray-600"
            />
        </div>
    );
};

export default NewsletterStatsCards;
