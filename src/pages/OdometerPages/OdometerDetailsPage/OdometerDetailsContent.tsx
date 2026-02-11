import React from 'react';
import { motion } from 'framer-motion';
import useOdometerDetailsManager from './hooks/useOdometerDetailsManager';
import OdometerDetailsHeader from './components/OdometerDetailsHeader';
import OdometerEmployeeSummary from './components/OdometerEmployeeSummary';
import OdometerDetailsTable from './components/OdometerDetailsTable';
import OdometerDetailsMobileList from './components/OdometerDetailsMobileList';
import OdometerDetailsSkeleton from './components/OdometerDetailsSkeleton';
import { OdometerDetailsExportService } from './components/OdometerDetailsExportService';
import OdometerIcon from '@/assets/images/icons/odometer.svg';
import { EmptyState, Pagination } from '@/components/ui';

const OdometerDetailsContent: React.FC = () => {
    const { details, fullDetails, loading, error, actions, searchQuery, pagination } = useOdometerDetailsManager();

    if (loading || !details) {
        return (
            <div className="p-0">
                <OdometerDetailsSkeleton rows={6} showSummary={pagination.currentPage === 1} />
            </div>
        );
    }

    if (error && !details) {
        return (
            <EmptyState
                title="Failed to Load Details"
                description={error}
                icon={
                    <img
                        src={OdometerIcon}
                        alt="Error loading odometer details"
                        className="w-16 h-16 opacity-50 filter grayscale"
                    />
                }
            />
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
                {details.dailyRecords.length > 0 ? (
                    <>
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
                    </>
                ) : (
                    <EmptyState
                        title="No Daily Records Found"
                        description={searchQuery
                            ? "No records match your current filters. Try adjusting your search criteria."
                            : "No odometer records available for this employee."}
                        icon={
                            <img
                                src={OdometerIcon}
                                alt="No daily records"
                                className="w-16 h-16 opacity-50 filter grayscale"
                            />
                        }
                    />
                )}
            </div>
        </motion.div>
    );
};

export default OdometerDetailsContent;
