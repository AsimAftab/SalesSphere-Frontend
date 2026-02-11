export type SubscriptionDuration = '6months' | '12months';

export interface ExtendSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationId: string;
    organizationName: string;
    currentExpiry?: string;
    onSuccess?: () => void;
}

export interface SubscriptionFormData {
    duration: SubscriptionDuration | '';
}

export type SubscriptionFormErrors = Partial<Record<keyof SubscriptionFormData, string>>;

export interface UseExtendSubscriptionReturn {
    formData: SubscriptionFormData;
    errors: SubscriptionFormErrors;
    isSubmitting: boolean;
    handleDurationChange: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleClose: () => void;
}
