import React, { useState } from 'react';
import { useBeatPlanTemplates } from '../../hooks/useBeatPlanTemplates';
import CreateBeatPlanModal from '../../../../components/modals/beat-plan/CreateBeatPlanModal';
import AssignBeatPlanModal from '../../../../components/modals/beat-plan/AssignBeatPlanModal';
import ViewBeatPlanModal from '../../../../components/modals/beat-plan/ViewBeatPlanModal';
import ConfirmationModal from '../../../../components/modals/CommonModals/ConfirmationModal';
import ErrorBoundary from '../../../../components/UI/ErrorBoundary/ErrorBoundary';
import BeatListHeader from './components/BeatListHeader';
import BeatListTable from './components/BeatListTable';
import BeatListMobile from './components/BeatListMobile';
import type { BeatPlanList } from '../../../../api/beatPlanService';
import BeatListSkeleton from './components/BeatListSkeleton';
import FilterBar from '../../../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../../../components/UI/FilterDropDown/FilterDropDown';
import DatePicker from '../../../../components/UI/DatePicker/DatePicker';
import toast from 'react-hot-toast';
import { getBeatPlanListById } from '../../../../api/beatPlanService';
import { useBeatPlanPermissions } from '../../hooks/useBeatPlanPermissions';

const BeatListTab: React.FC = () => {
    const permissions = useBeatPlanPermissions();
    const {
        templates,
        loading,
        searchQuery,
        setSearchQuery,
        handleDeleteTemplate,
        refreshTemplates,
        currentPage,
        itemsPerPage,
        totalTemplates,
        setCurrentPage,
        filters,
        setFilters,
        uniqueCreators,
        filteredTemplates
    } = useBeatPlanTemplates();

    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const handleExportPdf = async () => {
        if (filteredTemplates.length === 0) {
            toast.error('No beat plans to export');
            return;
        }
        try {
            // Fetch full details for each beat plan (list endpoint only returns summaries)
            const fullData = await Promise.all(
                filteredTemplates.map((t) => getBeatPlanListById(t._id))
            );

            const { pdf } = await import('@react-pdf/renderer');
            const BeatPlanListPDF = (await import('./BeatPlanListPDF')).default;
            const docElement = React.createElement(BeatPlanListPDF, { data: fullData }) as any;
            const blob = await pdf(docElement).toBlob();
            window.open(URL.createObjectURL(blob), '_blank');
            toast.success('PDF exported successfully');
        } catch {
            toast.error('Failed to export PDF');
        }
    };

    const [createModalState, setCreateModalState] = useState<{ isOpen: boolean; editData: BeatPlanList | null }>({
        isOpen: false,
        editData: null
    });
    const [assignModalState, setAssignModalState] = useState<{ isOpen: boolean; template: BeatPlanList | null }>({
        isOpen: false,
        template: null
    });

    // View Modal State
    const [viewModalState, setViewModalState] = useState<{ isOpen: boolean; template: BeatPlanList | null }>({
        isOpen: false,
        template: null
    });

    // Delete Confirmation State
    const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; templateId: string | null }>({
        isOpen: false,
        templateId: null
    });

    const confirmDelete = () => {
        if (deleteModalState.templateId) {
            handleDeleteTemplate(deleteModalState.templateId);
            setDeleteModalState({ isOpen: false, templateId: null });
        }
    };

    const handleResetFilters = () => {
        setFilters({
            createdBy: [],
            month: [],
            date: null
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <BeatListSkeleton permissions={permissions} />
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <BeatListHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onCreate={() => setCreateModalState({ isOpen: true, editData: null })}
                    isFilterVisible={isFilterVisible}
                    setIsFilterVisible={setIsFilterVisible}
                    onExportPdf={handleExportPdf}
                    permissions={permissions}
                />

                <FilterBar
                    isVisible={isFilterVisible}
                    onClose={() => setIsFilterVisible(false)}
                    onReset={handleResetFilters}
                >
                    <FilterDropdown
                        label="Created By"
                        options={uniqueCreators}
                        selected={filters.createdBy}
                        onChange={(val) => setFilters({ ...filters, createdBy: val })}
                    />

                    <FilterDropdown
                        label="Created Month"
                        options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
                        selected={filters.month}
                        onChange={(val) => setFilters({ ...filters, month: val })}
                    />

                    <div className="min-w-[140px] flex-1 sm:flex-none">
                        <DatePicker
                            value={filters.date}
                            onChange={(val) => setFilters({ ...filters, date: val })}
                            placeholder="Created Date"
                            isClearable
                            className="bg-none border-gray-100 text-sm text-gray-900 font-semibold placeholder:text-gray-900"
                        />
                    </div>
                </FilterBar>

                <BeatListTable
                    templates={templates}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalTemplates={totalTemplates}
                    onPageChange={setCurrentPage}
                    onAssign={(template) => setAssignModalState({ isOpen: true, template })}
                    onView={(template) => setViewModalState({ isOpen: true, template })}
                    onEdit={(template) => setCreateModalState({ isOpen: true, editData: template })}
                    onDelete={(id) => setDeleteModalState({ isOpen: true, templateId: id })}
                    permissions={permissions}
                />

                <BeatListMobile
                    templates={templates}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onAssign={(template) => setAssignModalState({ isOpen: true, template })}
                    onView={(template) => setViewModalState({ isOpen: true, template })}
                    onEdit={(template) => setCreateModalState({ isOpen: true, editData: template })}
                    onDelete={(id) => setDeleteModalState({ isOpen: true, templateId: id })}
                    permissions={permissions}
                />
            </div>

            {/* Modals */}
            <CreateBeatPlanModal
                isOpen={createModalState.isOpen}
                onClose={() => setCreateModalState({ isOpen: false, editData: null })}
                editData={createModalState.editData}
                onSuccess={() => {
                    refreshTemplates();
                    setCreateModalState({ isOpen: false, editData: null });
                }}
            />

            {assignModalState.isOpen && (
                <AssignBeatPlanModal
                    isOpen={assignModalState.isOpen}
                    template={assignModalState.template}
                    onClose={() => setAssignModalState({ isOpen: false, template: null })}
                    onSuccess={() => {
                        setAssignModalState({ isOpen: false, template: null });
                    }}
                />
            )}

            {viewModalState.isOpen && (
                <ViewBeatPlanModal
                    isOpen={viewModalState.isOpen}
                    template={viewModalState.template}
                    onClose={() => setViewModalState({ isOpen: false, template: null })}
                />
            )}

            <ConfirmationModal
                isOpen={deleteModalState.isOpen}
                title="Delete Beat Plan"
                message="Are you sure you want to delete this beat plan template? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalState({ isOpen: false, templateId: null })}
                confirmButtonText="Delete"
                confirmButtonVariant="danger"
            />
        </ErrorBoundary>
    );
};

export default BeatListTab;
