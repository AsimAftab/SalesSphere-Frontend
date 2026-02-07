import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Receipt, Calendar } from 'lucide-react';
import type { OrganizationPayment } from '@/api/SuperAdmin/organizationPaymentService';
import {
    EmptyState,
    Pagination,
    FilterBar,
    FilterDropdown,
    DatePicker,
    StatCard,
} from '@/components/ui';
import { PaymentHistoryHeader } from './PaymentHistoryHeader';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import { PaymentHistoryMobileList } from './PaymentHistoryMobileList';
import { PaymentHistorySkeleton } from './PaymentHistorySkeleton';
import { PAYMENT_MODE_OPTIONS, MONTH_OPTIONS } from '../types';
import type { PaymentFilters, PaymentSummary } from '../types';
import receiptIcon from '@/assets/images/icons/collection.svg';

interface PaymentHistoryContentProps {
    state: {
        organizationId: string;
        organizationName: string;
        payments: OrganizationPayment[];          // Full filtered data
        paginatedPayments: OrganizationPayment[]; // Sliced data for table
        summary: PaymentSummary;
        isFetching: boolean;
        filters: PaymentFilters;
        isFilterVisible: boolean;
        currentPage: number;
        totalItems: number;
        itemsPerPage: number;
        startIndex: number;
        receiverOptions: string[];
    };
    actions: {
        updateFilter: <K extends keyof PaymentFilters>(key: K, value: PaymentFilters[K]) => void;
        setFilters: React.Dispatch<React.SetStateAction<PaymentFilters>>;
        onResetFilters: () => void;
        setIsFilterVisible: (visible: boolean) => void;
        setCurrentPage: (page: number) => void;
        modals: {
            openImageModal: (images: string[]) => void;
            openEditModal: (payment: OrganizationPayment) => void;
            openDeleteModal: (id: string) => void;
        };
        onAddPayment: () => void;
    };
}

const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No payments yet';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const PaymentHistoryContent: React.FC<PaymentHistoryContentProps> = ({
    state,
    actions,
}) => {
    const {
        organizationId,
        organizationName,
        payments,
        paginatedPayments,
        summary,
        isFetching,
        filters,
        isFilterVisible,
        currentPage,
        totalItems,
        itemsPerPage,
        startIndex,
        receiverOptions,
    } = state;

    const { setCurrentPage, modals, setIsFilterVisible } = actions;

    // Show skeleton during initial loading
    if (isFetching && payments.length === 0) {
        return (
            <div className="flex-1 flex flex-col p-4 sm:p-0">
                <PaymentHistorySkeleton />
            </div>
        );
    }

    const hasActiveFilters =
        filters.dateFrom !== null ||
        filters.dateTo !== null ||
        filters.paymentModes.length > 0 ||
        filters.receivedBy.length > 0 ||
        filters.months.length > 0 ||
        filters.searchQuery !== '';

    const isEmpty = payments.length === 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            {/* Header */}
            <PaymentHistoryHeader
                organizationId={organizationId}
                organizationName={organizationName}
                searchTerm={filters.searchQuery}
                onSearchChange={(value) => actions.updateFilter('searchQuery', value)}
                isFilterVisible={isFilterVisible}
                onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
                onAddPayment={actions.onAddPayment}
            />

            {/* Filter Section */}
            <FilterBar
                isVisible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onReset={actions.onResetFilters}
            >
                <FilterDropdown
                    label="Payment Mode"
                    options={PAYMENT_MODE_OPTIONS}
                    selected={filters.paymentModes}
                    onChange={(val) => actions.setFilters(prev => ({ ...prev, paymentModes: val }))}
                />
                <FilterDropdown
                    label="Month"
                    options={MONTH_OPTIONS}
                    selected={filters.months}
                    onChange={(val) => actions.setFilters(prev => ({ ...prev, months: val }))}
                />
                <FilterDropdown
                    label="Received By"
                    options={receiverOptions}
                    selected={filters.receivedBy}
                    onChange={(val) => actions.setFilters(prev => ({ ...prev, receivedBy: val }))}
                />
                <div className="min-w-[140px] flex-1 sm:flex-none">
                    <DatePicker
                        value={filters.dateFrom}
                        onChange={(val) => actions.setFilters(prev => ({ ...prev, dateFrom: val }))}
                        placeholder="From Date"
                        isClearable
                        maxDate={filters.dateTo || new Date()}
                        className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                    />
                </div>
                <div className="min-w-[140px] flex-1 sm:flex-none">
                    <DatePicker
                        value={filters.dateTo}
                        onChange={(val) => actions.setFilters(prev => ({ ...prev, dateTo: val }))}
                        placeholder="To Date"
                        isClearable
                        minDate={filters.dateFrom || undefined}
                        maxDate={new Date()}
                        className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                    />
                </div>
            </FilterBar>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <StatCard
                    title="Total Payments Received"
                    value={formatAmount(summary.totalAmount)}
                    icon={<IndianRupee className="w-6 h-6 text-green-600" />}
                    iconBgColor="bg-green-100"
                />
                <StatCard
                    title="Total Payments Count"
                    value={summary.totalCount}
                    icon={<Receipt className="w-6 h-6 text-blue-600" />}
                    iconBgColor="bg-blue-100"
                />
                <StatCard
                    title="Last Payment Date"
                    value={formatDate(summary.lastPaymentDate)}
                    icon={<Calendar className="w-6 h-6 text-purple-600" />}
                    iconBgColor="bg-purple-100"
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {payments.length > 0 ? (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block flex-1 overflow-auto">
                            <PaymentHistoryTable
                                data={paginatedPayments}
                                onViewImage={modals.openImageModal}
                                onEdit={modals.openEditModal}
                                onDelete={modals.openDeleteModal}
                                startIndex={startIndex}
                            />
                        </div>

                        {/* Mobile List */}
                        <div className="md:hidden flex-1 overflow-auto">
                            <PaymentHistoryMobileList
                                data={paginatedPayments}
                                onViewImage={modals.openImageModal}
                                onEdit={modals.openEditModal}
                                onDelete={modals.openDeleteModal}
                            />
                        </div>

                        {/* Pagination */}
                        <div className="flex-shrink-0 mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                ) : (
                    <EmptyState
                        title={isEmpty && hasActiveFilters ? 'No payments match your filters' : 'No payments yet'}
                        description={
                            isEmpty && hasActiveFilters
                                ? 'Try adjusting your search or filter criteria'
                                : 'Start recording payment receipts from this organization'
                        }
                        icon={
                            <img
                                src={receiptIcon}
                                alt="No Payments"
                                className="w-16 h-16 opacity-50 filter grayscale"
                            />
                        }
                    />
                )}
            </div>
        </motion.div>
    );
};

export default PaymentHistoryContent;
