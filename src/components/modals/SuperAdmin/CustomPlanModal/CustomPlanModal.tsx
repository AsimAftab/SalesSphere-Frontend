import type { CustomPlanModalProps } from './types';
import { useCustomPlan } from './hooks/useCustomPlan';
import CustomPlanForm from './components/CustomPlanForm';
import { FormModal } from '@/components/ui';

// eslint-disable-next-line react-refresh/only-export-components
export * from './types';

export function CustomPlanModal(props: CustomPlanModalProps) {
    const { isOpen, initialPlan } = props;
    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleModuleToggle,
        handleSelectAll,
        handleDeselectAll,
        handleSubmit,
        handleClose
    } = useCustomPlan(props);

    const isEditMode = !!initialPlan;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Plan' : 'Create Custom Plan'}
            description={isEditMode ? 'Update plan configuration' : 'Configure a new subscription plan'}
            size="lg"
        >
            <CustomPlanForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                handleChange={handleChange}
                handleModuleToggle={handleModuleToggle}
                handleSelectAll={handleSelectAll}
                handleDeselectAll={handleDeselectAll}
                handleSubmit={handleSubmit}
                handleClose={handleClose}
                isEditMode={isEditMode}
            />
        </FormModal>
    );
}

export default CustomPlanModal;
