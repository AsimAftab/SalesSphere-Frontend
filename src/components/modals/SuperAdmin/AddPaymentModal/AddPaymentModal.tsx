import { Receipt, Pencil } from 'lucide-react';
import type { AddPaymentModalProps } from './types';
import { useAddPayment } from './hooks/useAddPayment';
import AddPaymentForm from './components/AddPaymentForm';
import { FormModal } from '@/components/ui';

export function AddPaymentModal({
    isOpen,
    onClose,
    organizationId,
    organizationName,
    onSuccess,
    payment,
}: AddPaymentModalProps) {
    const isEditMode = !!payment;

    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleAddImage,
        handleRemoveImage,
        handleRemoveExistingImage,
        handleSubmit,
        handleClose,
    } = useAddPayment({
        isOpen,
        organizationId,
        onClose,
        onSuccess,
        payment,
    });

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditMode ? 'Edit Payment' : 'Record Payment'}
            description={organizationName}
            size="md"
            icon={isEditMode
                ? <Pencil className="w-5 h-5 text-blue-600" />
                : <Receipt className="w-5 h-5 text-green-600" />
            }
        >
            <AddPaymentForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                handleChange={handleChange}
                handleAddImage={handleAddImage}
                handleRemoveImage={handleRemoveImage}
                handleRemoveExistingImage={handleRemoveExistingImage}
                handleSubmit={handleSubmit}
                handleClose={handleClose}
                isEditMode={isEditMode}
            />
        </FormModal>
    );
}

export default AddPaymentModal;
