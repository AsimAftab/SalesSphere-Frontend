import React, { useState } from 'react';
import { useActiveBeatPlans } from './hooks/useActiveBeatPlans';
import ActiveBeatsHeader from './components/ActiveBeatsHeader';
import ActiveBeatsTable from './components/ActiveBeatsTable';
import ActiveBeatsMobile from './components/ActiveBeatsMobile';
import ActiveBeatsSkeleton from './components/ActiveBeatsSkeleton';
import ActiveBeatViewModal from '../../../../components/modals/beat-plan/components/ActiveBeatViewModal';
import FilterBar from '../../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../../components/UI/FilterDropDown/FilterDropDown';
import DatePicker from '../../../../components/UI/DatePicker/DatePicker';
import ConfirmationModal from '../../../../components/modals/CommonModals/ConfirmationModal';
import type { BeatPlan } from '../../../../api/beatPlanService';
import { useBeatPlanPermissions } from '../../hooks/useBeatPlanPermissions';

const ActiveBeatsTab: React.FC = () => {
    const permissions = useBeatPlanPermissions();
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
        handleDeletePlan,
    } = useActiveBeatPlans();

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<BeatPlan | null>(null);

    // View Modal State (To be implemented or connected)
    // View Modal State (To be implemented or connected)
    const handleView = (plan: BeatPlan) => {
        setSelectedPlan(plan);
    };

    const handleResetFilters = () => {
        setFilters({
            status: [],
            assignedTo: [],
            date: null,
            month: []
        });
    };

    const onDeleteClick = (id: string) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await handleDeletePlan(deleteId);
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <ActiveBeatsSkeleton />
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
                        placeholder="Beat Date"
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
                    onDelete={onDeleteClick}
                    canDelete={permissions.canDelete}
                    canViewDetails={permissions.canViewDetails}
                />
            </div>

            <ActiveBeatsMobile
                beatPlans={beatPlans}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onView={handleView}
                onDelete={onDeleteClick}
                canDelete={permissions.canDelete}
                canViewDetails={permissions.canViewDetails}
            />

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                title="Delete Beat Plan"
                message="Are you sure you want to delete this assigned beat plan? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmButtonText="Delete"
                confirmButtonVariant="danger"
            />

            <ActiveBeatViewModal
                isOpen={!!selectedPlan}
                onClose={() => setSelectedPlan(null)}
                plan={selectedPlan}
            />
        </div>
    );
};

export default ActiveBeatsTab;
