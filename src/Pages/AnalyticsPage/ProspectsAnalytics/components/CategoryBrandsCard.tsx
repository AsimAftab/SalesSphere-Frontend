import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import InfoCard from '../../../../components/ui/SharedCards/InfoCard';
import { ChevronRight, Tag } from 'lucide-react';
import { EmptyState } from '../../../../components/ui/EmptyState/EmptyState';

interface BrandData {
    name: string;
    count: number;
}

interface CategoryBrandsCardProps {
    categoryName: string;
    brands: BrandData[];
}

const CategoryBrandsCard: React.FC<CategoryBrandsCardProps> = ({ categoryName, brands }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const titleContent = (
        <span className="flex items-center">
            {categoryName}
            <span className="text-sm font-normal text-gray-500 ml-2">({brands.length} Brands)</span>
        </span>
    );

    return (
        <InfoCard
            title={titleContent}
            scrollableRef={scrollRef}
            showScrollIndicator={brands.length > 5}
        >
            <div className="h-full flex flex-col relative">
                {/* Header Row */}
                <div className="flex justify-between items-center py-3 px-3 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand Name</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Prospect Count</span>
                </div>

                {/* List content */}
                <div
                    ref={scrollRef}
                    className="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-4"
                >
                    {brands.length === 0 ? (
                        <EmptyState
                            title="No Brands"
                            description="No brands found in this category."
                            icon={<Tag className="w-8 h-8 text-gray-300" />}
                        />
                    ) : (
                        brands.map((brand, index) => (
                            <Link
                                key={brand.name}
                                to={`/prospects?brand=${encodeURIComponent(brand.name)}`}
                                className="flex justify-between items-center py-3 px-3 rounded-lg hover:bg-blue-50 transition-all duration-300 group border-b border-gray-100 last:border-0 hover:shadow-sm hover:pl-4 cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${index % 2 === 0 ? 'bg-blue-400 group-hover:bg-blue-600' : 'bg-indigo-400 group-hover:bg-indigo-600'}`}></div>
                                    <span className="font-medium text-gray-700 text-sm capitalize group-hover:text-blue-800 transition-colors">{brand.name}</span>
                                </div>

                                <div className="flex items-center gap-2 relative z-10">
                                    <span className="font-bold text-gray-900 text-sm bg-gray-100 px-2.5 py-0.5 rounded-full group-hover:bg-white group-hover:text-blue-700 transition-colors shadow-sm border border-transparent group-hover:border-blue-100">{brand.count}</span>
                                    <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </InfoCard>
    );
};

export default CategoryBrandsCard;
