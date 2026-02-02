import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { SearchBar } from '@/components/ui';

interface TrackingPageHeaderProps {
    title: string;
    subtitle: string;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    searchPlaceholder?: string;
    isLoading?: boolean;
}

const TrackingPageHeader: React.FC<TrackingPageHeaderProps> = ({
    title,
    subtitle,
    searchQuery,
    setSearchQuery,
    searchPlaceholder,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <Skeleton width={200} height={32} className="mb-1" />
                    <Skeleton width={300} height={20} />
                </div>
                {setSearchQuery && (
                    <div className="w-full md:w-72">
                        <Skeleton height={42} borderRadius={8} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                    {title}
                </h1>
                <p className="text-lg text-gray-500">
                    {subtitle}
                </p>
            </div>

            {setSearchQuery && (
                <SearchBar
                    value={searchQuery || ''}
                    onChange={setSearchQuery}
                    placeholder={searchPlaceholder || 'Search...'}
                    className="w-full md:w-72"
                />
            )}
        </div>
    );
};

export default TrackingPageHeader;
