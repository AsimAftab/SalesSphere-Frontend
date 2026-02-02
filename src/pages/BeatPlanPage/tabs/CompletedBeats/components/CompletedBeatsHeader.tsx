import React from 'react';
import { SearchBar } from '@/components/ui';

interface CompletedBeatsHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const CompletedBeatsHeader: React.FC<CompletedBeatsHeaderProps> = ({
    searchQuery,
    setSearchQuery,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Left Side: Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                    Completed Assignments
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                    Review history of completed beat plans
                </p>
            </div>

            {/* Right Side: Search */}
            <div className="w-full sm:w-auto">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by Beat Plan Name or Completed By"
                    className="w-full sm:w-80"
                />
            </div>
        </div>
    );
};

export default CompletedBeatsHeader;
