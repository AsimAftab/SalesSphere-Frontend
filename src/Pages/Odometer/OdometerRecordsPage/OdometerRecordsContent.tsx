import React from 'react';
import { motion } from 'framer-motion';
import useOdometerRecordsManager from './components/useOdometerRecordsManager';
import OdometerRecordsTable from './components/OdometerRecordsTable';
import OdometerMobileList from './components/OdometerMobileList';
import OdometerSkeleton from './components/OdometerSkeleton';
import OdometerHeader from './components/OdometerHeader';
import { OdometerExportService } from './components/OdometerExportService';
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
                <OdometerSkeleton rows={10} />
            </div>
        );
    }

    // Client-side pagination logic
    const paginatedStats = stats.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
                onExportPdf={() => OdometerExportService.toPdf(stats)}
            />

            <div className="flex-1 overflow-hidden flex flex-col">
                {stats.length > 0 ? (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block flex-1 overflow-auto">
                            <OdometerRecordsTable
                                data={paginatedStats}
                                startIndex={startIndex}
                                onViewDetails={actions.onViewDetails}
                            />
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden flex-1 overflow-auto">
                            <OdometerMobileList
                                data={paginatedStats}
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
