import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../../components/UI/EmptyState/EmptyState';

// Components
import { CollectionsHeader } from './Components/CollectionsHeader';
import { CollectionTable } from './Components/CollectionTable';
import { CollectionMobileList } from './Components/CollectionMobileList';
import { CollectionsSkeleton } from './Components/CollectionsSkeleton';
import Pagination from '../../components/UI/Page/Pagination';

// Types
import type { Collection } from '../../api/collectionService';

// Constants
import { MONTH_OPTIONS, PAYMENT_MODE_OPTIONS } from './Components/CollectionConstants';
import collectionIcon from '../../assets/Image/icons/collection.svg';

// Filter Imports
import FilterBar from "../../components/UI/FilterDropDown/FilterBar";
import FilterDropdown from "../../components/UI/FilterDropDown/FilterDropDown";
import DatePicker from "../../components/UI/DatePicker/DatePicker";


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
        selectedCreatedBy: string[];
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
        creators: string[];
        paymentModes: string[];
        chequeStatuses: string[];
    };
    actions: {
        setSearchTerm: (val: string) => void;
        setCurrentPage: (page: number) => void;
        setSelectedDate: (date: Date | null) => void;
        setSelectedMonth: (months: string[]) => void;
        setSelectedParty: (parties: string[]) => void;
        setSelectedCreatedBy: (creators: string[]) => void;
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
        state.selectedCreatedBy.length > 0 ||
        state.selectedPaymentMode.length > 0 ||
        state.selectedChequeStatus.length > 0;

    const isEmpty = state.collections.length === 0;
    const isEmptyWithFilters = isEmpty && hasActiveFilters;

    // Navigation
    const navigate = useNavigate();
    const handleViewDetails = (collection: Collection) => {
        navigate(`/collection/${collection._id}`);
    };

    // Early return with skeleton during loading (matches LeavePage pattern)
    if (state.isLoading && state.collections.length === 0) {
        return (
            <div className="flex-1 flex flex-col p-4 sm:p-0">
                <CollectionsSkeleton rows={state.itemsPerPage} permissions={permissions} />
            </div>
        );
    }

    return (
        <div>
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
                                label="Party"
                                options={state.parties}
                                selected={state.selectedParty}
                                onChange={actions.setSelectedParty}
                            />
                            <FilterDropdown
                                label="Created By"
                                options={state.creators}
                                selected={state.selectedCreatedBy}
                                onChange={actions.setSelectedCreatedBy}
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
                {isEmpty ? (
                    <EmptyState
                        title={isEmptyWithFilters ? "No collections match your filters" : "No collections yet"}
                        description={
                            isEmptyWithFilters
                                ? "Try adjusting your search or filter criteria"
                                : "Start recording payment collections from parties"
                        }
                        action={undefined}
                        icon={
                            <img
                                src={collectionIcon}
                                alt="No Collections"
                                className="w-16 h-16 opacity-50 filter grayscale"
                            />
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
