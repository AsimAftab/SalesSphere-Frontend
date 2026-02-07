import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Shapes,
  Tag,
  UserRound,
} from 'lucide-react';
import SubOrganizationSitesCard from './components/SubOrganizationSitesCard';
import CategorySitesCard from './components/CategorySitesCard';
import SitesSkeleton from './components/SitesSkeleton';
import { useSitesViewState } from './hooks/useSitesViewState';
import type { IconType } from './hooks/useSitesViewState';
import { StatCard, Pagination, EmptyState } from '@/components/ui';

const iconMap: Record<IconType, React.ReactNode> = {
    sites: <Building2 className="h-6 w-6 text-blue-600" />,
    today: <Building2 className="h-6 w-6 text-blue-600" />,
    categories: <Shapes className="h-6 w-6 text-purple-600" />,
    brands: <Tag className="h-6 w-6 text-orange-600" />,
    workers: <UserRound className="h-6 w-6 text-red-600" />,
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
        paginatedCategories,
        currentPage,
        itemsPerPage,
        totalCategoryItems,
        subOrgSites,
        setCurrentPage
    } = useSitesViewState(enabled);

    if (isLoading) {
        return <SitesSkeleton />;
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
            <EmptyState
                title="No Sites Data Found"
                description="We couldn't find any sites data to display at this time."
                icon={<Building2 className="w-10 h-10 text-blue-200" />}
            />
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 pb-6"
        >
            {currentPage === 1 && (
                <>
                    {/* Page Header */}
                    <div className="mb-6 flex-shrink-0">
                        <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                            Sites Analytics
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Monitor site registrations, category breakdown, and brand distribution.
                        </p>
                    </div>

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
                </>
            )}

            {/* Main Content Grid: Sub-Organizations + Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sub-Organization Sites Card */}
                <motion.div variants={itemVariants} className="h-96">
                    <SubOrganizationSitesCard data={subOrgSites} />
                </motion.div>

                {/* Dynamic Category Cards */}
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
                <motion.div variants={itemVariants} className="mt-4">
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
