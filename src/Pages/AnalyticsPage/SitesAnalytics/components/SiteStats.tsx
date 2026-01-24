import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Store, CalendarDays, Layers, Tag } from 'lucide-react';
import StatCard from '../../../../components/shared_cards/StatCard';
import { type Site } from '../../../../api/siteService';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const SiteStats: React.FC = () => {
    const { sites, categories, isLoading } = useSites();

    const stats = useMemo(() => {
        if (!sites || !categories) return null;

        const totalSites = sites.length;

        // Calculate Today's Sites
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const todaysSites = sites.filter((s: Site) => {
            if (!s.dateJoined) return false;
            const joinDate = new Date(s.dateJoined);
            const dateOnly = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate());
            return dateOnly.getTime() === startOfToday.getTime();
        }).length;

        const totalCategories = categories.length;

        // Calculate Unique Brands
        // Note: Assuming same structure as prospects - need to verify if categories have brands
        const allBrands = new Set(categories.flatMap((c: any) => c.brands || []));
        const totalBrands = allBrands.size;

        return {
            totalSites,
            todaysSites,
            totalCategories,
            totalBrands
        };
    }, [sites, categories]);

    if (isLoading) {
        return <div className="p-6">Loading stats...</div>;
    }

    if (!stats) return null;

    const statCards = [
        {
            title: "Total No. of Sites",
            value: stats.totalSites,
            icon: <Store className="h-6 w-6 text-purple-600" />,
            iconBgColor: 'bg-purple-100'
        },
        {
            title: "Today's Total Sites",
            value: stats.todaysSites,
            icon: <CalendarDays className="h-6 w-6 text-blue-600" />,
            iconBgColor: 'bg-blue-100'
        },
        {
            title: "Total No. of Category",
            value: stats.totalCategories,
            icon: <Layers className="h-6 w-6 text-indigo-600" />,
            iconBgColor: 'bg-indigo-100'
        },
        {
            title: "Total No. of Brands",
            value: stats.totalBrands,
            icon: <Tag className="h-6 w-6 text-orange-600" />,
            iconBgColor: 'bg-orange-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCards.map((card, index) => (
                <motion.div
                    key={card.title}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: index * 0.1 }}
                >
                    <StatCard {...card} />
                </motion.div>
            ))}
        </div>
    );
};

export default SiteStats;
