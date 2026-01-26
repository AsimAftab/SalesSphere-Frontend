import React, { useState } from 'react';
import { useActiveBeatPlans } from './hooks/useActiveBeatPlans';
import ActiveBeatsHeader from './components/ActiveBeatsHeader';
import ActiveBeatsTable from './components/ActiveBeatsTable';
import ActiveBeatsMobile from './components/ActiveBeatsMobile';
import BeatListSkeleton from '../BeatList/components/BeatListSkeleton';
import FilterBar from '../../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../../components/UI/FilterDropDown/FilterDropDown';
import DatePicker from '../../../../components/UI/DatePicker/DatePicker';
import type { BeatPlan } from '../../../../api/beatPlanService';

const ActiveBeatsTab: React.FC = () => {
    const {
        beatPlans,
        loading,
        totalPlans,
        currentPage,
        itemsPerPage,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        setCurrentPage,
        uniqueEmployeeNames,
    } = useActiveBeatPlans();

    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // View Modal State (To be implemented or connected)
    const handleView = (plan: BeatPlan) => {
        console.log('View Plan:', plan);
        // Implement View Modal logic here
    };

    const handleResetFilters = () => {
        setFilters({
            status: [],
            assignedTo: [],
            date: null,
            month: []
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <BeatListSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ActiveBeatsHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isFilterVisible={isFilterVisible}
                setIsFilterVisible={setIsFilterVisible}
            />

            <FilterBar
                isVisible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onReset={handleResetFilters}
            >
                <FilterDropdown
                    label="Status"
                    options={['pending', 'active']}
                    selected={filters.status}
                    onChange={(val) => setFilters({ ...filters, status: val })}
                />

                <FilterDropdown
                    label="Assigned To"
                    options={uniqueEmployeeNames}
                    selected={filters.assignedTo}
                    onChange={(val) => setFilters({ ...filters, assignedTo: val })}
                />

                <FilterDropdown
                    label="Month"
                    options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
                    selected={filters.month}
                    onChange={(val) => setFilters({ ...filters, month: val })}
                />

                <div className="min-w-[140px] flex-1 sm:flex-none">
                    <DatePicker
                        value={filters.date}
                        onChange={(val) => setFilters({ ...filters, date: val })}
                        placeholder="Specific Date"
                        isClearable
                        className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                    />
                </div>
            </FilterBar>

            <div className="hidden md:block">
                <ActiveBeatsTable
                    beatPlans={beatPlans}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalPlans={totalPlans}
                    onPageChange={setCurrentPage}
                    onView={handleView}
                   
                />
            </div>

            <ActiveBeatsMobile
                beatPlans={beatPlans}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onView={handleView}
                
            />
        </div>
    );
};
    
export default ActiveBeatsTab;
