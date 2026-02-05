import { useState, useEffect, useCallback, useMemo } from 'react';
import { newsletterAdminService } from '@/api/SuperAdmin/newsletterService';
import type { Subscriber, SubscriberStats } from '../types';
import type { NewsletterPayload } from '@/components/modals/SuperAdmin/SendNewsletterModal';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

export const useNewsletterManager = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [stats, setStats] = useState<SubscriberStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterActive, setFilterActive] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

    const fetchSubscribers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await newsletterAdminService.getSubscribers();
            setSubscribers(response.data.data || []);
            setStats(response.data.stats || null);
        } catch {
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    // Filter subscribers based on search and active status
    const filteredSubscribers = useMemo(() => {
        let result = subscribers;

        // Filter by active status
        if (filterActive !== null) {
            result = result.filter(s => s.isActive === filterActive);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(s => s.email.toLowerCase().includes(q));
        }

        return result;
    }, [subscribers, searchQuery, filterActive]);

    // Pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedSubscribers = filteredSubscribers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterActive]);

    // Get only active subscribers for selection
    const activeSubscribers = useMemo(() =>
        filteredSubscribers.filter(s => s.isActive),
        [filteredSubscribers]
    );

    // Selection handlers
    const handleSelectSubscriber = useCallback((email: string) => {
        setSelectedEmails(prev => {
            const next = new Set(prev);
            if (next.has(email)) {
                next.delete(email);
            } else {
                next.add(email);
            }
            return next;
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        const activeEmails = activeSubscribers.map(s => s.email);
        const allSelected = activeEmails.every(email => selectedEmails.has(email));

        if (allSelected) {
            // Deselect all
            setSelectedEmails(new Set());
        } else {
            // Select all active
            setSelectedEmails(new Set(activeEmails));
        }
    }, [activeSubscribers, selectedEmails]);

    const clearSelection = useCallback(() => {
        setSelectedEmails(new Set());
    }, []);

    // Actions
    const handleUnsubscribe = useCallback(async (email: string) => {
        try {
            await newsletterAdminService.unsubscribe(email);
            toast.success('Subscriber removed successfully');
            fetchSubscribers();
        } catch {
            toast.error('Failed to unsubscribe user');
        }
    }, [fetchSubscribers]);

    const handleResubscribe = useCallback(async (email: string) => {
        try {
            await newsletterAdminService.resubscribe(email);
            toast.success('Subscriber reactivated successfully');
            fetchSubscribers();
        } catch {
            toast.error('Failed to reactivate subscriber');
        }
    }, [fetchSubscribers]);

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
            // API might return { data: { sentCount } } or { sentCount } directly
            const apiResponse = response.data;
            const sentCount = apiResponse.data?.sentCount
                ?? (apiResponse as unknown as { sentCount?: number }).sentCount
                ?? (selectedEmails.size > 0 ? selectedEmails.size : stats?.active)
                ?? 0;
            toast.success(`Newsletter sent to ${sentCount} subscriber${sentCount !== 1 ? 's' : ''}`);
            setIsSendModalOpen(false);
            clearSelection(); // Clear selection after sending
        }
    }, [stats, selectedEmails, clearSelection]);

    // Calculate if all active are selected
    const allActiveSelected = activeSubscribers.length > 0 &&
        activeSubscribers.every(s => selectedEmails.has(s.email));

    return {
        subscribers: {
            data: filteredSubscribers,
            paginatedData: paginatedSubscribers,
            totalItems: filteredSubscribers.length
        },
        stats,
        loading,
        searchQuery,
        setSearchQuery,
        filterActive,
        setFilterActive,
        pagination: {
            currentPage,
            onPageChange: setCurrentPage,
            itemsPerPage: ITEMS_PER_PAGE,
            totalItems: filteredSubscribers.length
        },
        modalState: {
            isSendModalOpen,
            openSendModal: () => setIsSendModalOpen(true),
            closeSendModal: () => setIsSendModalOpen(false)
        },
        selection: {
            selectedEmails,
            selectedCount: selectedEmails.size,
            allActiveSelected,
            activeCount: activeSubscribers.length,
            onSelectSubscriber: handleSelectSubscriber,
            onSelectAll: handleSelectAll,
            clearSelection
        },
        actions: {
            handleUnsubscribe,
            handleResubscribe,
            handleSendNewsletter,
            refresh: fetchSubscribers
        }
    };
};
