import React from 'react';

export interface SendNewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (payload: NewsletterPayload) => Promise<void>;
    activeSubscriberCount: number;
    selectedCount?: number;
}

export interface NewsletterPayload {
    subject: string;
    content: string;
    testEmail?: string;
    recipients?: string[];
}

export interface NewsletterFormData {
    subject: string;
    content: string;
    testEmail: string;
}

export type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type ChangeHandler = (e: ChangeEvent) => void;

export interface FormErrors {
    subject?: string;
    content?: string;
    testEmail?: string;
}
