import { useCallback } from 'react';
import { newsletterAdminService } from '@/api/SuperAdmin';
import type { NewsletterPayload } from '@/components/modals/SuperAdmin/SendNewsletterModal';
import type { SubscriberStats } from '../types';
import toast from 'react-hot-toast';

interface UseNewsletterActionsProps {
    refresh: () => Promise<void>;
    stats: SubscriberStats | null;
    selectedEmails: Set<string>;
    clearSelection: () => void;
    closeSendModal: () => void;
}

export const useNewsletterActions = ({
    refresh,
    stats,
    selectedEmails,
    clearSelection,
    closeSendModal,
}: UseNewsletterActionsProps) => {
    const handleUnsubscribe = useCallback(async (email: string) => {
        try {
            await newsletterAdminService.unsubscribe(email);
            toast.success('Subscriber removed successfully');
            refresh();
        } catch {
            toast.error('Failed to unsubscribe user');
        }
    }, [refresh]);

    const handleResubscribe = useCallback(async (email: string) => {
        try {
            await newsletterAdminService.resubscribe(email);
            toast.success('Subscriber reactivated successfully');
            refresh();
        } catch {
            toast.error('Failed to reactivate subscriber');
        }
    }, [refresh]);

    const handleSendNewsletter = useCallback(async (payload: NewsletterPayload) => {
        // Add selected emails to payload if any are selected (and not a test email)
        const finalPayload: NewsletterPayload = {
            ...payload,
            recipients: !payload.testEmail && selectedEmails.size > 0
                ? Array.from(selectedEmails)
                : undefined
        };

        // Just make the API call - modal hook handles toast and closing
        const response = await newsletterAdminService.sendNewsletter(finalPayload);

        // Only close modal if this is a "send to all" (no testEmail)
        if (!payload.testEmail) {
            // Handle different API response structures
            const apiResponse = response.data;
            const sentCount = apiResponse.data?.sentCount
                ?? (apiResponse as unknown as { sentCount?: number }).sentCount
                ?? (selectedEmails.size > 0 ? selectedEmails.size : stats?.active)
                ?? 0;
            toast.success(`Newsletter sent to ${sentCount} subscriber${sentCount !== 1 ? 's' : ''}`);
            closeSendModal();
            clearSelection();
        }
    }, [stats, selectedEmails, clearSelection, closeSendModal]);

    return {
        handleUnsubscribe,
        handleResubscribe,
        handleSendNewsletter,
    };
};
