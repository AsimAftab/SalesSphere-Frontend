import type { PaymentMode, CreatePaymentRequest, OrganizationPayment } from '@/api/SuperAdmin';

export interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationId: string;
    organizationName: string;
    onSuccess?: () => void;
    /** Payment to edit - if provided, modal operates in edit mode */
    payment?: OrganizationPayment;
}

export type { OrganizationPayment };

export interface PaymentFormData {
    paymentMode: PaymentMode | '';
    otherPaymentMode: string;
    amount: number | '';
    dateReceived: string;
    description: string;
    upgradedPlanName: string;
    proofImages: File[];
    existingImages: string[]; // URLs of existing images (for edit mode)
}

export type PaymentFormErrors = Partial<Record<keyof PaymentFormData, string>>;

export type ChangeEvent =
    | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    | { target: { name: string; value: string | number } };

export type ChangeHandler = (e: ChangeEvent) => void;

export interface UseAddPaymentReturn {
    formData: PaymentFormData;
    errors: PaymentFormErrors;
    isSubmitting: boolean;
    handleChange: ChangeHandler;
    handleAddImage: (file: File) => void;
    handleRemoveImage: (index: number) => void;
    handleRemoveExistingImage: (index: number) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleClose: () => void;
}

export type { PaymentMode, CreatePaymentRequest };
