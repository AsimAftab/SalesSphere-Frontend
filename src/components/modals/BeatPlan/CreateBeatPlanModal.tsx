import React, { useEffect } from 'react';
import { useCreateBeatPlan } from './hooks/useCreateBeatPlan';
import CreateBeatPlanForm from './components/CreateBeatPlanForm';
import type { BeatPlanList } from '@/api/beatPlanService';
import { FormModal } from '@/components/ui';

interface CreateBeatPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: BeatPlanList | null;
}

const CreateBeatPlanModal: React.FC<CreateBeatPlanModalProps> = ({ isOpen, onClose, onSuccess, editData }) => {
    const {
        name, setName,
        selectedIds, toggleSelection,
        directories,
        loading,
        submitting,
        createBeatPlan,
        searchQuery, setSearchQuery,
        activeTab, setActiveTab,
        fetchDirectories,
        isEditMode,
        enabledTypes
    } = useCreateBeatPlan(onSuccess, editData);

    useEffect(() => {
        if (isOpen) {
            fetchDirectories();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = () => {
        if (!submitting) onClose();
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Beat Plan Template' : 'Create Beat Plan Template'}
            description={isEditMode ? 'Update route details' : 'Define a route template for your sales team'}
            size="xl"
            closeOnBackdrop={!submitting}
        >
            <CreateBeatPlanForm
                name={name}
                setName={setName}
                selectedIds={selectedIds}
                toggleSelection={toggleSelection}
                directories={directories}
                loading={loading}
                submitting={submitting}
                onSubmit={() => createBeatPlan()}
                onCancel={handleClose}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isEditMode={isEditMode}
                enabledTypes={enabledTypes}
            />
        </FormModal>
    );
};

export default CreateBeatPlanModal;
