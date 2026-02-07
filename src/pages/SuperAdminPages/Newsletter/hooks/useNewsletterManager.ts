import { useState, useCallback } from 'react';
import { useNewsletterData } from './useNewsletterData';
import { useNewsletterFilters } from './useNewsletterFilters';
import { useNewsletterActions } from './useNewsletterActions';

export const useNewsletterManager = () => {
    // Data fetching
    const { subscribers, stats, loading, refresh } = useNewsletterData();

    // Filtering and pagination
    const {
        searchQuery,
        setSearchQuery,
        filterActive,
        setFilterActive,
        filteredSubscribers,
        paginatedSubscribers,
        activeSubscribers,
        pagination,
    } = useNewsletterFilters(subscribers);

    // Modal state
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const openSendModal = useCallback(() => setIsSendModalOpen(true), []);
    const closeSendModal = useCallback(() => setIsSendModalOpen(false), []);

    // Selection state (email-based for newsletter)
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

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
            setSelectedEmails(new Set());
        } else {
            setSelectedEmails(new Set(activeEmails));
        }
    }, [activeSubscribers, selectedEmails]);

    const clearSelection = useCallback(() => {
        setSelectedEmails(new Set());
    }, []);

    const allActiveSelected = activeSubscribers.length > 0 &&
        activeSubscribers.every(s => selectedEmails.has(s.email));

    // Actions
    const { handleUnsubscribe, handleResubscribe, handleSendNewsletter } = useNewsletterActions({
        refresh,
        stats,
        selectedEmails,
        clearSelection,
        closeSendModal,
    });

    return {
        subscribers: {
            data: filteredSubscribers,
            paginatedData: paginatedSubscribers,
            totalItems: filteredSubscribers.length,
        },
        stats,
        loading,
        searchQuery,
        setSearchQuery,
        filterActive,
        setFilterActive,
        pagination,
        modalState: {
            isSendModalOpen,
            openSendModal,
            closeSendModal,
        },
        selection: {
            selectedEmails,
            selectedCount: selectedEmails.size,
            allActiveSelected,
            activeCount: activeSubscribers.length,
            onSelectSubscriber: handleSelectSubscriber,
            onSelectAll: handleSelectAll,
            clearSelection,
        },
        actions: {
            handleUnsubscribe,
            handleResubscribe,
            handleSendNewsletter,
            refresh,
        },
    };
};
