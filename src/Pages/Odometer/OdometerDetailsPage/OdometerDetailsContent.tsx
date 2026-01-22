import React from 'react';
import { motion } from 'framer-motion';
import useOdometerDetailsManager from './components/useOdometerDetailsManager';
import OdometerDetailsHeader from './components/OdometerDetailsHeader';
import OdometerEmployeeSummary from './components/OdometerEmployeeSummary';
import OdometerDetailsTable from './components/OdometerDetailsTable';
import OdometerDetailsMobileList from './components/OdometerDetailsMobileList';
import OdometerDetailsSkeleton from './components/OdometerDetailsSkeleton';
import { OdometerDetailsExportService } from './components/OdometerDetailsExportService';
import Pagination from '../../../components/UI/Page/Pagination';

const OdometerDetailsContent: React.FC = () => {
    const { details, fullDetails, loading, actions, searchQuery, pagination } = useOdometerDetailsManager();

    if (loading || !details) {
        return (
            <div className="p-0">
                <OdometerDetailsSkeleton rows={6} showSummary={pagination.currentPage === 1} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            {/* Header & Summary Section - Fixed at top */}
            <div className="flex-shrink-0 space-y-4">
                <OdometerDetailsHeader
                    searchQuery={searchQuery}
                    setSearchQuery={actions.setSearchQuery}
                    onExportPdf={() => OdometerDetailsExportService.toPdf(fullDetails || details)}
                />

                {/* Blue Stats Card - Only on Page 1 */}
                {pagination.currentPage === 1 && (
                    <OdometerEmployeeSummary
                        employee={details.employee}
                        summary={details.summary}
                    />
                )}
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto pb-6 pt-4">
                {/* Desktop View */}
                <div className="hidden md:block">
                    <OdometerDetailsTable
                        data={details.dailyRecords}
                        onViewDetails={actions.handleViewTripDetails}
                    />
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                    <OdometerDetailsMobileList
                        data={details.dailyRecords}
                        onViewDetails={actions.handleViewTripDetails}
                    />
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={pagination.setCurrentPage}
                    className="mt-4"
                />
            </div>
        </motion.div>
    );
};

export default OdometerDetailsContent;
