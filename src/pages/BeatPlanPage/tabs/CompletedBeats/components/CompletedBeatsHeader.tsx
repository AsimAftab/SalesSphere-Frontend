import React from 'react';
import { SimplePageHeader, SearchBar } from '@/components/ui';

interface CompletedBeatsHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const CompletedBeatsHeader: React.FC<CompletedBeatsHeaderProps> = ({
    searchQuery,
    setSearchQuery,
}) => {
    return (
        <SimplePageHeader
            title="Completed Assignments"
            subtitle="Review history of completed beat plans"
        >
            <div className="w-full sm:w-auto">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by Beat Plan Name or Completed By"
                    className="w-full sm:w-80"
                />
            </div>
        </SimplePageHeader>
    );
};

export default CompletedBeatsHeader;
