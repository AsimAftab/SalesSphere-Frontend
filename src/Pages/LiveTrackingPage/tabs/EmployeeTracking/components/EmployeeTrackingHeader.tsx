import React from 'react';
import SearchBar from '../../../../../components/UI/SearchBar/SearchBar';
import EmployeeTrackingHeaderSkeleton from './EmployeeTrackingHeaderSkeleton';

interface EmployeeTrackingHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isLoading?: boolean;
}

const EmployeeTrackingHeader: React.FC<EmployeeTrackingHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    isLoading = false
}) => {
    if (isLoading) {
        return <EmployeeTrackingHeaderSkeleton />;
    }

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
                placeholder="Search by Employee, Role or Beat Name"
                className="w-full md:w-72"
            />
        </div>
    );
};

export default EmployeeTrackingHeader;
