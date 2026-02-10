import { useState, useEffect, useRef } from 'react';
import type { PaymentFormData, PaymentFormErrors, ChangeEvent, OrganizationPayment } from '../types';
import { INITIAL_FORM_DATA } from '../constants';
import { createPayment, updatePayment, uploadPaymentImage, deletePaymentImage, type PaymentProofImage } from '@/api/SuperAdmin';
import { useAuth } from '@/api/authService';
import toast from 'react-hot-toast';

interface UseAddPaymentProps {
    isOpen: boolean;
    organizationId: string;
    onClose: () => void;
    onSuccess?: () => void;
    payment?: OrganizationPayment;
}

export const useAddPayment = ({
    isOpen,
    organizationId,
    onClose,
    onSuccess,
    payment,
}: UseAddPaymentProps) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<PaymentFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<PaymentFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track existing images with their actual slot numbers from API
    const existingImagesWithSlots = useRef<PaymentProofImage[]>([]);
    // Track which slots were deleted
    const deletedSlots = useRef<Set<1 | 2>>(new Set());

    const isEditMode = !!payment;

    // Reset form when modal opens or payment changes
    useEffect(() => {
        if (isOpen) {
            deletedSlots.current.clear();

            if (payment) {
                // Edit mode: pre-fill form with payment data
                // Use actual slot numbers from API response
                existingImagesWithSlots.current = [...(payment.proofImages || [])];

                setFormData({
                    paymentMode: payment.paymentMode,
                    otherPaymentMode: payment.otherPaymentMode || '',
                    amount: payment.amount,
                    dateReceived: new Date(payment.dateReceived).toISOString().split('T')[0],
                    description: payment.description || '',
                    upgradedPlanName: payment.upgradedPlanName || '',
                    proofImages: [],
                    // Extract just URLs for display
                    existingImages: (payment.proofImages || []).map(img => img.imageUrl),
                });
            } else {
                // Add mode: reset to initial values
                existingImagesWithSlots.current = [];
                setFormData({
                    ...INITIAL_FORM_DATA,
                    dateReceived: new Date().toISOString().split('T')[0],
                });
            }
            setErrors({});
        }
    }, [isOpen, payment]);

    const handleChange = (e: ChangeEvent) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
        }));

        // Clear error when field is edited
        if (errors[name as keyof PaymentFormData]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof PaymentFormData];
                return newErrors;
            });
        }
    };

    const handleAddImage = (file: File) => {
        const totalImages = formData.existingImages.length + formData.proofImages.length;
        if (totalImages >= 2) {
            toast.error('Maximum 2 images allowed');
            return;
        }
        setFormData((prev) => ({
            ...prev,
            proofImages: [...prev.proofImages, file],
        }));
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            proofImages: prev.proofImages.filter((_, i) => i !== index),
        }));
    };

    const handleRemoveExistingImage = (index: number) => {
        // Find the actual slot number for this image from API data
        const imageToRemove = existingImagesWithSlots.current[index];
        if (imageToRemove) {
            deletedSlots.current.add(imageToRemove.imageNumber);
            // Remove from our tracking array
            existingImagesWithSlots.current = existingImagesWithSlots.current.filter((_, i) => i !== index);
        }

        setFormData((prev) => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== index),
        }));
    };

    const validate = (): boolean => {
        const newErrors: PaymentFormErrors = {};

        if (!formData.paymentMode) {
            newErrors.paymentMode = 'Payment mode is required';
        }

        if (formData.paymentMode === 'others' && !formData.otherPaymentMode.trim()) {
            newErrors.otherPaymentMode = 'Please specify the payment mode';
        }

        if (formData.amount === '' || formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.dateReceived) {
            newErrors.dateReceived = 'Date received is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            if (isEditMode && payment) {
                // Update existing payment
                await updatePayment(organizationId, payment._id, {
                    paymentMode: formData.paymentMode as Exclude<typeof formData.paymentMode, ''>,
                    otherPaymentMode: formData.paymentMode === 'others' ? formData.otherPaymentMode : undefined,
                    amount: formData.amount as number,
                    dateReceived: formData.dateReceived,
                    description: formData.description || undefined,
                    upgradedPlanName: formData.upgradedPlanName || undefined,
                });

                // Delete removed existing images (by their original slot numbers)
                for (const slot of deletedSlots.current) {
                    await deletePaymentImage(organizationId, payment._id, slot);
                }

                // Upload new proof images if any
                if (formData.proofImages.length > 0) {
                    // Find which slots are still occupied by remaining existing images
                    const occupiedSlots = new Set(existingImagesWithSlots.current.map(img => img.imageNumber));

                    // Find available slots (1 or 2 that are not occupied)
                    const availableSlots: (1 | 2)[] = [];
                    if (!occupiedSlots.has(1)) availableSlots.push(1);
                    if (!occupiedSlots.has(2)) availableSlots.push(2);

                    // Upload new images to available slots
                    const uploadPromises = formData.proofImages.map((file, index) => {
                        const slot = availableSlots[index];
                        if (slot) {
                            return uploadPaymentImage(organizationId, payment._id, file, slot);
                        }
                        return Promise.resolve(null);
                    });
                    await Promise.all(uploadPromises);
                }

                toast.success('Payment updated successfully');
            } else {
                // Create new payment
                const newPayment = await createPayment(organizationId, {
                    paymentMode: formData.paymentMode as Exclude<typeof formData.paymentMode, ''>,
                    otherPaymentMode: formData.paymentMode === 'others' ? formData.otherPaymentMode : undefined,
                    amount: formData.amount as number,
                    dateReceived: formData.dateReceived,
                    receivedBy: user?.id || '',
                    description: formData.description || undefined,
                    upgradedPlanName: formData.upgradedPlanName || undefined,
                });

                // Upload proof images if any (imageNumber must be 1 or 2)
                if (formData.proofImages.length > 0) {
                    const uploadPromises = formData.proofImages.map((file, index) =>
                        uploadPaymentImage(organizationId, newPayment._id, file, (index + 1) as 1 | 2)
                    );
                    await Promise.all(uploadPromises);
                }

                toast.success('Payment recorded successfully');
            }

            onSuccess?.();
            handleClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'record'} payment`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        existingImagesWithSlots.current = [];
        deletedSlots.current.clear();
        onClose();
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleAddImage,
        handleRemoveImage,
        handleRemoveExistingImage,
        handleSubmit,
        handleClose,
    };
};
