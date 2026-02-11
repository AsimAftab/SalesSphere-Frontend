import React from 'react';
import TourPlanForm from './components/TourPlanForm';
import { useTourPlanEntity } from './hooks/useTourPlanEntity';
import { type TourPlan, type CreateTourRequest } from '@/api/tourPlanService';
import { FormModal } from '@/components/ui';

interface TourPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: CreateTourRequest) => Promise<void>;
    initialData?: TourPlan | null;
    isSaving: boolean;
}

const TourPlanModal: React.FC<TourPlanModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isSaving
}) => {
    const isEditMode = !!initialData;

    const { form, onSubmit } = useTourPlanEntity({
        isOpen,
        initialData,
        onSave,
    });

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Tour Plan' : 'Create Tour Plan'}
            description={isEditMode ? 'Update the tour plan details' : 'Plan a new business tour visit'}
            size="lg"
        >
            <TourPlanForm
                form={form}
                onSubmit={onSubmit}
                isSaving={isSaving}
                onCancel={onClose}
                isEditMode={isEditMode}
            />
        </FormModal>
    );
};

export default TourPlanModal;
