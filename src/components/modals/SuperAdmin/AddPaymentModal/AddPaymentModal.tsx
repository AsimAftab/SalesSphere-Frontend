import { X, Receipt, Pencil } from 'lucide-react';
import type { AddPaymentModalProps } from './types';
import { useAddPayment } from './hooks/useAddPayment';
import AddPaymentForm from './components/AddPaymentForm';
import { ErrorBoundary } from '@/components/ui';

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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
            onClick={handleClose}
            onKeyDown={(e) => e.key === 'Escape' && handleClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-payment-modal-title"
        >
            <div
                className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-hidden z-[10000] shadow-2xl flex flex-col border border-gray-100"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="document"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                    <div>
                        <h2
                            id="add-payment-modal-title"
                            className="text-xl font-semibold text-gray-900 flex items-center gap-2"
                        >
                            {isEditMode ? (
                                <>
                                    <Pencil className="w-5 h-5 text-blue-600" />
                                    Edit Payment
                                </>
                            ) : (
                                <>
                                    <Receipt className="w-5 h-5 text-green-600" />
                                    Record Payment
                                </>
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {organizationName}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex flex-col min-h-0 flex-1">
                    <ErrorBoundary>
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
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}

export default AddPaymentModal;
