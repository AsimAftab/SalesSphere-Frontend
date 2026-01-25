import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProspectStats } from '../../../api/prospectDashboardService';
import StatCard from '../../../components/shared_cards/StatCard';
import { UserSearch, Shapes, Tag } from 'lucide-react';
import DashboardSkeleton from '../../DashboardPage/components/DashboardSkeleton';
import CategoryBrandsCard from './components/CategoryBrandsCard';
import Pagination from '../../../components/UI/Page/Pagination';

const MOCK_CATEGORY_DATA = [
    {
        categoryName: "Hardware",
        brands: [
            { name: "Hettich", count: 120 },
            { name: "Godrej", count: 85 },
            { name: "Dorset", count: 45 },
            { name: "Hafele", count: 40 },
            { name: "Ebco", count: 35 },
            { name: "Ozone", count: 25 },
            { name: "Dorma", count: 20 },
        ]
    },
    {
        categoryName: "Plywood",
        brands: [
            { name: "CenturyPly", count: 95 },
            { name: "GreenPly", count: 70 },
            { name: "Kitply", count: 35 },
            { name: "Sylvan", count: 25 },
            { name: "Austin", count: 20 },
            { name: "Archidply", count: 15 },
        ]
    },
    {
        categoryName: "Laminates",
        brands: [
            { name: "Merino", count: 60 },
            { name: "Greenlam", count: 55 },
            { name: "Royale Touche", count: 40 },
            { name: "Virgo", count: 30 },
            { name: "Signature", count: 25 },
            { name: "Advance", count: 20 },
        ]
    },
    {
        categoryName: "Adhesives",
        brands: [
            { name: "Fevicol", count: 200 },
            { name: "Mahacol", count: 80 },
            { name: "Jivanjor", count: 60 },
            { name: "Araldite", count: 50 },
            { name: "Loctite", count: 40 },
            { name: "Fevikwik", count: 30 },
        ]
    },
    // Adding dummy data to demonstrate pagination if needed (conceptually)
    // For now with 4 items, pagination won't trigger unless we duplicate or lower itemsPerPage.
    // User asked "only 9 cards should show in a page".
];

// Helper to generate more mock data for pagination demo
const GENERATED_MOCK_DATA = [...MOCK_CATEGORY_DATA, ...MOCK_CATEGORY_DATA, ...MOCK_CATEGORY_DATA];

const ProspectsAnalytics: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['prospectStats'],
        queryFn: getProspectStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const statCardsData = useMemo(() => {
        if (!stats) return [];
        return [
            {
                title: "Total No. of Prospects",
                value: stats.totalProspects,
                icon: <UserSearch className="h-6 w-6 text-blue-600" />,
                iconBgColor: 'bg-blue-100',
                link: '/prospects',
            },
            {
                title: "Today's Total Prospects",
                value: stats.totalProspectsToday,
                icon: <UserSearch className="h-6 w-6 text-blue-600" />,
                iconBgColor: 'bg-blue-100',
                link: '/prospects?filter=today',
            },
            {
                title: "Total No. of Categories",
                value: stats.totalCategories,
                icon: <Shapes className="h-6 w-6 text-purple-600" />,
                iconBgColor: 'bg-purple-100',
                link: '/prospects',
            },
            {
                title: "Total No. of Brands",
                value: stats.totalBrands,
                icon: <Tag className="h-6 w-6 text-orange-600" />,
                iconBgColor: 'bg-orange-100',
                link: '/prospects',
            },
        ];
    }, [stats]);

    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return GENERATED_MOCK_DATA.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-50 rounded-lg">
                <p>Failed to load prospect statistics. Please try refreshing.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            {currentPage === 1 && (
                <>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Prospects Analytics</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Track prospect acquisition metrics and distribution.
                        </p>
                    </div>

                    {/* Stat Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCardsData.map((card) => (
                            <StatCard key={card.title} {...card} />
                        ))}
                    </div>
                </>
            )}

            {/* Dynamic Category Cards Grid */}
            {/* Reduced height to h-[22rem] to show approx 5 rows before scrolling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {paginatedCategories.map((category, index) => (
                    <div key={`${category.categoryName}-${index}`} className="h-[22rem]">
                        <CategoryBrandsCard
                            categoryName={category.categoryName}
                            brands={category.brands}
                        />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={GENERATED_MOCK_DATA.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ProspectsAnalytics;

