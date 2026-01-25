import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Shapes, Tag, Hammer } from 'lucide-react';
import StatCard from '../../../components/UI/shared_cards/StatCard';
import SubOrganizationSitesCard from './components/SubOrganizationSitesCard';
import CategorySitesCard from './components/CategorySitesCard';
import Pagination from '../../../components/UI/Page/Pagination';
import { useSitesViewState } from './components/useSitesViewState';
import type { IconType } from './components/useSitesViewState';

const iconMap: Record<IconType, React.ReactNode> = {
    sites: <Building2 className="h-6 w-6 text-blue-600" />,
    today: <Building2 className="h-6 w-6 text-blue-600" />,
    categories: <Shapes className="h-6 w-6 text-purple-600" />,
    brands: <Tag className="h-6 w-6 text-orange-600" />,
    workers: <Hammer className="h-6 w-6 text-red-600" />,
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface SitesContentProps {
    enabled?: boolean;
}

const SitesContent: React.FC<SitesContentProps> = ({ enabled = true }) => {
    const {
        statCardsData,
        isLoading,
        error,
        data,
        paginatedCategories,
        currentPage,
        itemsPerPage,
        totalCategoryItems,
        setCurrentPage
    } = useSitesViewState(enabled);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-50 rounded-lg">
                Error loading sites analytics: {error.message}
            </div>
        );
    }

    if (statCardsData.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No data available for sites analytics.
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCardsData.map((card) => (
                    <motion.div key={card.title} variants={itemVariants}>
                        <StatCard
                            {...card}
                            icon={iconMap[card.iconType]}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Sub-Organization Sites Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <motion.div variants={itemVariants} className="h-96 lg:col-span-2">
                    <SubOrganizationSitesCard data={data?.subOrgSites} />
                </motion.div>
            </div>

            {/* Dynamic Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCategories.map((category, index) => (
                    <motion.div
                        key={`${category.categoryName}-${index}`}
                        className="h-96"
                        variants={itemVariants}
                    >
                        <CategorySitesCard
                            categoryName={category.categoryName}
                            brands={category.brands}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalCategoryItems > itemsPerPage && (
                <motion.div variants={itemVariants}>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalCategoryItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </motion.div>
            )}
        </motion.div>
    );
};

export default SitesContent;
