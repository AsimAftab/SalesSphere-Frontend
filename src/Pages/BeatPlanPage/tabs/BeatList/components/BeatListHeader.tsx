import React from 'react';
import Button from '../../../../../components/UI/Button/Button';
import SearchBar from '../../../../../components/UI/SearchBar/SearchBar';

interface BeatListHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onCreate: () => void;
}

const BeatListHeader: React.FC<BeatListHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    onCreate
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Left Side: Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#202224] ">
                    Beat Plan List
                </h1>
                <p className="text-lg text-gray-500 ">
                    Manage your beat plans
                </p>
            </div>

            {/* Right Side: Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by Beat Plan Name"
                    className="w-full sm:w-72"
                />

                <Button onClick={onCreate} className="w-full sm:w-auto justify-center whitespace-nowrap">
                    Create Beat Plan
                </Button>
            </div>
        </div>
    );
};

export default BeatListHeader;
