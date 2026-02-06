import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Shapes, Tag, UserSearch } from 'lucide-react';
import CategoryBrandsCard from './components/CategoryBrandsCard';
import ProspectsSkeleton from './components/ProspectsSkeleton';
import type { StatCardData, CategoryData, IconType } from './components/useProspectViewState';
import { StatCard, Pagination, EmptyState } from '@/components/ui';

interface ProspectsContentProps {
    state: {
        isLoading: boolean;
        error: string | null;
        statCardsData: StatCardData[];
        paginatedCategories: CategoryData[];
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
    };
    actions: {
        setCurrentPage: (page: number) => void;
    };
}

const iconMap: Record<IconType, React.ReactNode> = {
    prospects: <UserSearch className="h-6 w-6 text-blue-600" />,
    categories: <Shapes className="h-6 w-6 text-purple-600" />,
    brands: <Tag className="h-6 w-6 text-orange-600" />,
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};


const ProspectsContent: React.FC<ProspectsContentProps> = ({ state, actions }) => {
    const {
        isLoading,
        error,
        statCardsData,
        paginatedCategories,
        currentPage,
        itemsPerPage,
        totalItems,
    } = state;

    if (isLoading) {
        return <ProspectsSkeleton />;
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-50 rounded-lg">
                <p>Failed to load prospect statistics. {error}</p>
            </div>
        );
    }

    if (totalItems === 0) {
        return (
            <EmptyState
                title="No Prospects Data Found"
                description="We couldn't find any prospect categories or brands to display at this time."
                icon={<FileSearch className="w-10 h-10 text-gray-300" />}
            />
        );
    }

    return (
        <motion.div
            className="h-full w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {currentPage === 1 && (
                <>
                    <motion.div className="mb-6 text-left" variants={itemVariants}>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                            Prospects Analytics
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Track prospect metrics and distribution.
                        </p>    
                    </motion.div>

                    {/* Stat Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            {/* Dynamic Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {paginatedCategories.map((category, index) => (
                    <motion.div
                        key={`${category.categoryName}-${index}`}
                        className="h-96"
                        variants={itemVariants}
                    >
                        <CategoryBrandsCard
                            categoryName={category.categoryName}
                            brands={category.brands}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            <motion.div variants={itemVariants} className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={actions.setCurrentPage}
                />
            </motion.div>
        </motion.div>
    );
};

export default ProspectsContent;
