import React from 'react';
import PaymentDetailsSection from './PaymentDetailsSection';
import ProofImagesSection from './ProofImagesSection';
import type { PaymentFormData, PaymentFormErrors, ChangeHandler } from '../types';
import { Button } from '@/components/ui';

interface AddPaymentFormProps {
    formData: PaymentFormData;
    errors: PaymentFormErrors;
    isSubmitting: boolean;
    handleChange: ChangeHandler;
    handleAddImage: (file: File) => void;
    handleRemoveImage: (index: number) => void;
    handleRemoveExistingImage: (index: number) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleClose: () => void;
    isEditMode?: boolean;
}

const AddPaymentForm: React.FC<AddPaymentFormProps> = ({
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleAddImage,
    handleRemoveImage,
    handleRemoveExistingImage,
    handleSubmit,
    handleClose,
    isEditMode = false,
}) => {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
            <div className="flex-1 overflow-y-auto min-h-0 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PaymentDetailsSection
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                    />
                    <ProofImagesSection
                        images={formData.proofImages}
                        existingImages={formData.existingImages}
                        onAddImage={handleAddImage}
                        onRemoveImage={handleRemoveImage}
                        onRemoveExistingImage={handleRemoveExistingImage}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                <Button
                    variant="outline"
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    className={isEditMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                >
                    {isSubmitting
                        ? (isEditMode ? 'Updating...' : 'Recording...')
                        : (isEditMode ? 'Update Payment' : 'Record Payment')
                    }
                </Button>
            </div>
        </form>
    );
};

export default AddPaymentForm;
