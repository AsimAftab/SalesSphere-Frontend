import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../../components/UI/EmptyState/EmptyState';
import { SkeletonTheme } from 'react-loading-skeleton';

// Components
import { CollectionsHeader } from './components/CollectionsHeader';
import { CollectionTable } from './components/CollectionTable';
import { CollectionMobileList } from './components/CollectionMobileList';
import { CollectionsSkeleton } from './components/CollectionsSkeleton';
import Pagination from '../../components/UI/Page/Pagination';

// Types
import type { Collection } from '../../api/collectionService';

// Filter Imports
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";
import FilterDropdown from "../../components/UI/FilterDropDown/FilterDropDown";
import DatePicker from "../../components/UI/DatePicker/DatePicker";

// Month options for filter
const MONTH_OPTIONS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const PAYMENT_MODE_OPTIONS = ["Cash", "Cheque", "Bank Transfer", "QR Pay"];

interface CollectionContentProps {
    state: {
        collections: Collection[];
        allFilteredCollections: Collection[];
        isLoading: boolean;
        selectedIds: string[];
        // Filters
        searchTerm: string;
        selectedDate: Date | null;
        selectedMonth: string[];
        selectedParty: string[];
        selectedPaymentMode: string[];
        selectedChequeStatus: string[];
        isFilterVisible: boolean;
        // Pagination
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
        // Filter Options
        parties: string[];
        paymentModes: string[];
        chequeStatuses: string[];
    };
    actions: {
        setSearchTerm: (val: string) => void;
        setCurrentPage: (page: number) => void;
        setSelectedDate: (date: Date | null) => void;
        setSelectedMonth: (months: string[]) => void;
        setSelectedParty: (parties: string[]) => void;
        setSelectedPaymentMode: (modes: string[]) => void;
        setSelectedChequeStatus: (statuses: string[]) => void;
        resetFilters: () => void;
        openCreateModal: () => void;
        openDeleteModal: (ids: string[]) => void;
        toggleSelection: (id: string) => void;
        selectAll: (ids: string[]) => void;
        toggleFilterVisibility: () => void;
    };
    permissions: {
        canCreate: boolean;
        canDelete: boolean;
        canBulkDelete: boolean;
        canExportPdf: boolean;
        canExportExcel: boolean;
        canViewDetail: boolean;
    };
    onExportPdf?: (data: Collection[]) => void;
    onExportExcel?: (data: Collection[]) => void;
}

const CollectionContent: React.FC<CollectionContentProps> = ({
    state,
    actions,
    permissions,
    onExportPdf,
    onExportExcel
}) => {
    // Determine if filters are active
    const hasActiveFilters =
        state.searchTerm !== "" ||
        state.selectedDate !== null ||
        state.selectedMonth.length > 0 ||
        state.selectedParty.length > 0 ||
        state.selectedPaymentMode.length > 0 ||
        state.selectedChequeStatus.length > 0;

    const isEmpty = state.collections.length === 0;
    const isEmptyWithFilters = isEmpty && hasActiveFilters;

    // Navigation
    const navigate = useNavigate();
    const handleViewDetails = (collection: Collection) => {
        navigate(`/collection/${collection._id}`);
    };

    return (
        <div className="min-h-screen px-2 sm:px-4 lg:px-6 pt-0 pb-4">
            {/* Header */}
            <CollectionsHeader
                searchTerm={state.searchTerm}
                setSearchTerm={actions.setSearchTerm}
                isFilterVisible={state.isFilterVisible}
                setIsFilterVisible={actions.toggleFilterVisibility}
                selectedCount={state.selectedIds.length}
                onBulkDelete={() => actions.openDeleteModal(state.selectedIds)}
                onExportPdf={() => onExportPdf?.(state.allFilteredCollections)}
                onExportExcel={() => onExportExcel?.(state.allFilteredCollections)}
                handleCreate={actions.openCreateModal}
                setCurrentPage={actions.setCurrentPage}
                permissions={permissions}
            />

            {/* Filters */}
            <AnimatePresence>
                {state.isFilterVisible && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FilterBar
                            isVisible={state.isFilterVisible}
                            onClose={actions.toggleFilterVisibility}
                            onReset={actions.resetFilters}
                        >
                            <FilterDropdown
                                label="Created By"
                                options={state.parties}
                                selected={state.selectedParty}
                                onChange={actions.setSelectedParty}
                            />
                            <FilterDropdown
                                label="Payment Mode"
                                options={PAYMENT_MODE_OPTIONS}
                                selected={state.selectedPaymentMode}
                                onChange={actions.setSelectedPaymentMode}
                            />
                            <FilterDropdown
                                label="Month"
                                options={MONTH_OPTIONS}
                                selected={state.selectedMonth}
                                onChange={actions.setSelectedMonth}
                            />
                            <div className="min-w-[140px] flex-1 sm:flex-none">
                                <DatePicker
                                    value={state.selectedDate}
                                    onChange={actions.setSelectedDate}
                                    placeholder="Received Date"
                                    isClearable
                                    className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                                />
                            </div>
                        </FilterBar>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <div className="mt-6">
                {state.isLoading ? (
                    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                        <CollectionsSkeleton />
                    </SkeletonTheme>
                ) : isEmpty ? (
                    <EmptyState
                        title={isEmptyWithFilters ? "No collections match your filters" : "No collections yet"}
                        description={
                            isEmptyWithFilters
                                ? "Try adjusting your search or filter criteria"
                                : "Start recording payment collections from parties"
                        }
                        action={
                            isEmptyWithFilters ? (
                                <button
                                    onClick={actions.resetFilters}
                                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            ) : permissions.canCreate ? (
                                <button
                                    onClick={actions.openCreateModal}
                                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                                >
                                    Create Collection
                                </button>
                            ) : undefined
                        }
                    />
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block">
                            <CollectionTable
                                collections={state.collections}
                                selectedIds={state.selectedIds}
                                onToggleSelection={actions.toggleSelection}
                                onSelectAll={actions.selectAll}
                                onViewDetails={handleViewDetails}
                                permissions={permissions}
                                currentPage={state.currentPage}
                                itemsPerPage={state.itemsPerPage}
                            />
                        </div>

                        {/* Mobile List */}
                        <div className="lg:hidden">
                            <CollectionMobileList
                                collections={state.collections}
                                selectedIds={state.selectedIds}
                                onToggleSelection={actions.toggleSelection}
                                onViewDetails={handleViewDetails}
                                permissions={permissions}
                                currentPage={state.currentPage}
                                itemsPerPage={state.itemsPerPage}
                            />
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={state.currentPage}
                            totalItems={state.totalItems}
                            itemsPerPage={state.itemsPerPage}
                            onPageChange={actions.setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CollectionContent;
