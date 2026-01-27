import React from 'react';
import Button from '../../../../../components/UI/Button/Button';
import SearchBar from '../../../../../components/UI/SearchBar/SearchBar';

interface BeatListHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onCreate: () => void;
    isFilterVisible: boolean;
    setIsFilterVisible: (visible: boolean) => void;
}

const BeatListHeader: React.FC<BeatListHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    onCreate,
    isFilterVisible,
    setIsFilterVisible
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

                <button
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={`p-2.5 rounded-lg border transition-colors w-fit flex items-center justify-center ${isFilterVisible
                        ? 'bg-secondary text-white border-secondary shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    title="Toggle Filters"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                    </svg>
                </button>

                <Button onClick={onCreate} className="w-full sm:w-auto justify-center whitespace-nowrap">
                    Create Beat Plan
                </Button>
            </div>
        </div>
    );
};

export default BeatListHeader;
