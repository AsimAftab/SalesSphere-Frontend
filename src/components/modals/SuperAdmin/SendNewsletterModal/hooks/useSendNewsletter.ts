import { useState, useEffect, useCallback } from 'react';
import type { NewsletterFormData, FormErrors, NewsletterPayload, ChangeEvent } from '../types';
import toast from 'react-hot-toast';

interface UseSendNewsletterProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (payload: NewsletterPayload) => Promise<void>;
}

const INITIAL_FORM_DATA: NewsletterFormData = {
    subject: '',
    content: '',
    testEmail: ''
};

export const useSendNewsletter = ({ isOpen, onClose, onSend }: UseSendNewsletterProps) => {
    const [formData, setFormData] = useState<NewsletterFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSending, setIsSending] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [testSentSuccess, setTestSentSuccess] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setFormData(INITIAL_FORM_DATA);
            setErrors({});
            setTestSentSuccess(false);
        }
    }, [isOpen]);

    // Clear test success indicator after 5 seconds
    useEffect(() => {
        if (testSentSuccess) {
            const timer = setTimeout(() => setTestSentSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [testSentSuccess]);

    const handleChange = useCallback((e: ChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTestSentSuccess(false); // Reset test success when form changes

        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof FormErrors];
                return newErrors;
            });
        }
    }, [errors]);

    const validateForm = useCallback((includeTestEmail: boolean = false): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        if (includeTestEmail && !formData.testEmail.trim()) {
            newErrors.testEmail = 'Test email is required';
        } else if (includeTestEmail && formData.testEmail.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.testEmail)) {
                newErrors.testEmail = 'Please enter a valid email address';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSendTest = useCallback(async () => {
        if (!validateForm(true)) return;

        setIsSendingTest(true);
        setTestSentSuccess(false);
        try {
            await onSend({
                subject: formData.subject,
                content: formData.content,
                testEmail: formData.testEmail
            });
            setTestSentSuccess(true);
            toast.success(`Test email sent to ${formData.testEmail}`);
            // Modal stays open - user can review and send to all
        } catch {
            toast.error('Failed to send test email');
        } finally {
            setIsSendingTest(false);
        }
    }, [formData, onSend, validateForm]);

    const handleSendAll = useCallback(async () => {
        if (!validateForm(false)) return;

        setIsSending(true);
        try {
            await onSend({
                subject: formData.subject,
                content: formData.content
            });
            // Reset form and close modal after successful send to all
            setFormData(INITIAL_FORM_DATA);
            setTestSentSuccess(false);
        } finally {
            setIsSending(false);
        }
    }, [formData, onSend, validateForm]);

    const handleClose = useCallback(() => {
        if (isSending || isSendingTest) return;
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setTestSentSuccess(false);
        onClose();
    }, [isSending, isSendingTest, onClose]);

    const canSendTest = Boolean(formData.subject.trim() && formData.content.trim() && formData.testEmail.trim());
    const canSendAll = Boolean(formData.subject.trim() && formData.content.trim());

    return {
        formData,
        errors,
        isSending,
        isSendingTest,
        canSendTest,
        canSendAll,
        testSentSuccess,
        handleChange,
        handleSendTest,
        handleSendAll,
        handleClose
    };
};
