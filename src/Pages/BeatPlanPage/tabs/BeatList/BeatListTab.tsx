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

const BeatListTab: React.FC = () => {
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
        setCurrentPage
    } = useBeatPlanTemplates();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

    if (loading) {
        return (
            <div className="space-y-6">
                <BeatListSkeleton />
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <BeatListHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onCreate={() => setIsCreateModalOpen(true)}
                />

                <BeatListTable
                    templates={templates}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalTemplates={totalTemplates}
                    onPageChange={setCurrentPage}
                    onAssign={(template) => setAssignModalState({ isOpen: true, template })}
                    onView={(template) => setViewModalState({ isOpen: true, template })}
                    onDelete={(id) => setDeleteModalState({ isOpen: true, templateId: id })}
                />

                <BeatListMobile
                    templates={templates}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onAssign={(template) => setAssignModalState({ isOpen: true, template })}
                    onView={(template) => setViewModalState({ isOpen: true, template })}
                    onDelete={(id) => setDeleteModalState({ isOpen: true, templateId: id })}
                />
            </div>

            {/* Modals */}
            <CreateBeatPlanModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    refreshTemplates();
                    setIsCreateModalOpen(false);
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
