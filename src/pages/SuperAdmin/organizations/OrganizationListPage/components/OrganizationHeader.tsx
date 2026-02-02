import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Button, SearchBar } from '@/components/ui';

interface OrganizationHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (visible: boolean) => void;
    onCreateClick: () => void;
    totalCount: number;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    isFilterVisible,
    setIsFilterVisible,
    onCreateClick,
}) => {
    return (
        <div className="w-full flex flex-col gap-0 mb-8 px-1">
            {/* ROW 1: Title and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="text-left shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                        Organizations
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">Efficiently manage organizations, subscriptions, and status.</p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto lg:flex-1 lg:justify-end">
                    <SearchBar
                        value={searchQuery}
                        onChange={(val) => setSearchQuery(val)}
                        placeholder="Search by organization or owner name"
                        className="w-full lg:w-72 xl:w-80"
                    />

                    <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFilterVisible(!isFilterVisible)}
                                className={`p-2.5 rounded-lg border transition-all ${isFilterVisible
                                    ? 'bg-secondary text-white shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <FunnelIcon className="h-5 w-5" />
                            </button>

                            <Button
                                className="w-full sm:w-auto whitespace-nowrap text-sm px-4 h-10 flex-shrink-0"
                                onClick={onCreateClick}
                            >
                                Add Organization
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationHeader;
