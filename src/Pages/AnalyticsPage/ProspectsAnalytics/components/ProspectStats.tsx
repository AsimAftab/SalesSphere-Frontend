import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Layers, Tag } from 'lucide-react';
import StatCard from '../../../../components/shared_cards/StatCard';
import { useProspects } from '../../../Entities/ProspectPage/useProspects';
import { type Prospect, type ProspectCategoryData } from '../../../../api/prospectService';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const ProspectStats: React.FC = () => {
    const { prospects, categories, isLoading } = useProspects();

    const stats = useMemo(() => {
        if (!prospects || !categories) return null;

        const totalProspects = prospects.length;

        // Calculate Today's Prospects
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const todaysProspects = prospects.filter((p: Prospect) => {
            if (!p.dateJoined) return false;
            const joinDate = new Date(p.dateJoined);
            // reset time part for comparison
            const dateOnly = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate());
            return dateOnly.getTime() === startOfToday.getTime();
        }).length;

        const totalCategories = categories.length;

        // Calculate Unique Brands
        const allBrands = new Set(categories.flatMap((c: ProspectCategoryData) => c.brands || []));
        const totalBrands = allBrands.size;

        return {
            totalProspects,
            todaysProspects,
            totalCategories,
            totalBrands
        };
    }, [prospects, categories]);

    if (isLoading) {
        return <div className="p-6">Loading stats...</div>; // Or a skeleton
    }

    if (!stats) return null;

    const statCards = [
        {
            title: "Total No. of Prospects",
            value: stats.totalProspects,
            icon: <Users className="h-6 w-6 text-purple-600" />,
            iconBgColor: 'bg-purple-100'
        },
        {
            title: "Today's Total Prospects",
            value: stats.todaysProspects,
            icon: <UserPlus className="h-6 w-6 text-blue-600" />,
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

export default ProspectStats;
