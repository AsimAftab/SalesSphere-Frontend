import { useState, useEffect } from 'react';
import type { SubscriptionFormData, SubscriptionFormErrors, UseExtendSubscriptionReturn, SubscriptionDuration } from '../types';
import { INITIAL_FORM_DATA } from '../constants';
import { extendSubscription } from '@/api/SuperAdmin';
import toast from 'react-hot-toast';

interface UseExtendSubscriptionProps {
    isOpen: boolean;
    organizationId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export const useExtendSubscription = ({
    isOpen,
    organizationId,
    onClose,
    onSuccess,
}: UseExtendSubscriptionProps): UseExtendSubscriptionReturn => {
    const [formData, setFormData] = useState<SubscriptionFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<SubscriptionFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(INITIAL_FORM_DATA);
            setErrors({});
        }
    }, [isOpen]);

    const handleDurationChange = (value: string) => {
        setFormData({ duration: value as SubscriptionDuration | '' });

        // Clear error when field is edited
        if (errors.duration) {
            setErrors({});
        }
    };

    const validate = (): boolean => {
        const newErrors: SubscriptionFormErrors = {};

        if (!formData.duration) {
            newErrors.duration = 'Please select a duration';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await extendSubscription(organizationId, formData.duration as SubscriptionDuration);

            toast.success('Subscription extended successfully');
            onSuccess?.();
            handleClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to extend subscription');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        onClose();
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleDurationChange,
        handleSubmit,
        handleClose,
    };
};
