import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import SearchBar from '../../../../../components/ui/SearchBar/SearchBar';

interface ActiveBeatsHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (visible: boolean) => void;
}

const ActiveBeatsHeader: React.FC<ActiveBeatsHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    isFilterVisible,
    setIsFilterVisible,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Left Side: Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                    Active Assignments
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                    Monitor active and pending beat plans
                </p>
            </div>

            {/* Right Side: Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by Beat Plan Name or Assigned To"
                    className="w-full sm:w-72"
                />

                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={`p-2.5 rounded-lg border transition-colors w-fit ${isFilterVisible
                        ? 'bg-secondary text-white border-secondary shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    title="Toggle Filters"
                >
                    <FunnelIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default ActiveBeatsHeader;
