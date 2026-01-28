import React from 'react';
import SearchBar from '../../../../../components/UI/SearchBar/SearchBar';

interface EmployeeTrackingHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const EmployeeTrackingHeader: React.FC<EmployeeTrackingHeaderProps> = ({
    searchQuery,
    setSearchQuery
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#202224]">
                    Employee Tracking
                </h1>
                <p className="text-lg text-gray-500">
                    Monitor active employee locations
                </p>
            </div>

            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by Employee Name"
                className="w-full sm:w-72"
            />
        </div>
    );
};

export default EmployeeTrackingHeader;
