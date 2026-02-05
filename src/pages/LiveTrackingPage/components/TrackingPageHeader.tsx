import React from 'react';
import { SimplePageHeader, SearchBar, HeaderTitleSkeleton, SearchSkeleton } from '@/components/ui';

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
                <HeaderTitleSkeleton titleWidth={200} subtitleWidth={300} />
                {setSearchQuery && (
                    <SearchSkeleton width="100%" className="w-full md:w-72" />
                )}
            </div>
        );
    }

    return (
        <SimplePageHeader title={title} subtitle={subtitle} className="mb-2 px-0">
            {setSearchQuery && (
                <SearchBar
                    value={searchQuery || ''}
                    onChange={setSearchQuery}
                    placeholder={searchPlaceholder || 'Search...'}
                    className="w-full md:w-72"
                />
            )}
        </SimplePageHeader>
    );
};

export default TrackingPageHeader;
