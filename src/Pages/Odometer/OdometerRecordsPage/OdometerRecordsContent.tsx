import React from 'react';
import { motion } from 'framer-motion';
import useOdometerRecordsManager from './components/useOdometerRecordsManager';
import OdometerRecordsTable from './components/OdometerRecordsTable';
import OdometerMobileList from './components/OdometerMobileList';
import OdometerSkeleton from './components/OdometerSkeleton';
import OdometerHeader from './components/OdometerHeader';
import { OdometerExportService } from './components/OdometerExportService';
import FilterBar from '../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../components/UI/FilterDropDown/FilterDropDown';
import DateRangePicker from '../../../components/UI/DatePicker/DateRangePicker';
import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';
import Pagination from '../../../components/UI/Page/Pagination';

const OdometerRecordsContent: React.FC = () => {
    const { state, actions } = useOdometerRecordsManager();
    const { stats, loading, totalItems, currentPage } = state;

    const ITEMS_PER_PAGE = 10;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    if (loading && stats.length === 0) {
        return (
            <div className="p-4 sm:p-0">
                <OdometerSkeleton rows={6} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            {/* Header Section */}
            <OdometerHeader
                searchQuery={state.searchQuery}
                setSearchQuery={actions.setSearchQuery}
                isFilterVisible={state.isFilterVisible}
                setIsFilterVisible={actions.setIsFilterVisible}
                canExportPdf={true}
                canExportExcel={true}
                onExportPdf={() => OdometerExportService.toPdf(stats)}
                onExportExcel={() => OdometerExportService.toExcel(stats)}
            />

            {/* Filter Section */}
            <FilterBar
                isVisible={state.isFilterVisible}
                onClose={() => actions.setIsFilterVisible(false)}
                onReset={actions.onResetFilters}
            >
                <FilterDropdown
                    label="Employee"
                    options={state.employeeOptions.map(opt => opt.value)}
                    selected={state.filters.employees}
                    onChange={(val) => actions.setFilters({ ...state.filters, employees: val })}
                />
                <div className="min-w-[240px] flex-1 sm:flex-none">
                    <DateRangePicker
                        value={state.filters.dateRange}
                        onChange={(val) => actions.setFilters({ ...state.filters, dateRange: val })}
                        placeholder="Select Date Range"
                        className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                    />
                </div>
            </FilterBar>

            <div className="flex-1 overflow-hidden flex flex-col">
                {stats.length > 0 ? (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block flex-1 overflow-auto">
                            <OdometerRecordsTable
                                data={stats}
                                startIndex={startIndex}
                                onViewDetails={actions.onViewDetails}
                            />
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden flex-1 overflow-auto">
                            <OdometerMobileList
                                data={stats}
                                onViewDetails={actions.onViewDetails}
                            />
                        </div>

                        {/* Pagination - Reuse existing component */}
                        <div className="flex-shrink-0 mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={actions.setCurrentPage}
                            />
                        </div>
                    </>
                ) : (
                    <EmptyState
                        title="No Odometer Records Found"
                        description="There are no odometer records available to display."
                        icon={
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                )}
            </div>
        </motion.div>
    );
};

export default OdometerRecordsContent;
