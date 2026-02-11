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

    const footerContent = (
        <div className="flex justify-end gap-3 w-full">
            <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="tour-plan-form"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isEditMode ? 'Update Tour Plan' : 'Create Tour Plan'}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Tour Plan' : 'Create Tour Plan'}
            description={isEditMode ? 'Update the tour plan details' : 'Plan a new business tour visit'}
            size="lg"
            footer={footerContent}
        >
            <TourPlanForm
                form={form}
                onSubmit={onSubmit}
            />
        </FormModal>
    );
};

export default TourPlanModal;
