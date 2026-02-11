import React from 'react';
import { SimplePageHeader } from '@/components/ui';
import { SearchBar } from '@/components/ui';
import { Filter } from 'lucide-react';

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
        <SimplePageHeader
            title="Active Assignments"
            subtitle="Monitor active and pending beat plans"
        >
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
                    <Filter className="h-5 w-5" />
                </button>
            </div>
        </SimplePageHeader>
    );
};

export default ActiveBeatsHeader;
