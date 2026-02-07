import React from 'react';
import NewsletterHeader from './components/NewsletterHeader';
import NewsletterStatsCards from './components/NewsletterStatsCards';
import SubscribersTable from './components/SubscribersTable';
import NewsletterSkeleton from './components/NewsletterSkeleton';
import type { useNewsletterManager } from './hooks/useNewsletterManager';

interface NewsletterContentProps {
    manager: ReturnType<typeof useNewsletterManager>;
}

const NewsletterContent: React.FC<NewsletterContentProps> = ({ manager }) => {
    const {
        subscribers,
        stats,
        loading,
        searchQuery,
        setSearchQuery,
        filterActive,
        setFilterActive,
        pagination,
        modalState,
        selection
    } = manager;

    if (loading) {
        return <NewsletterSkeleton />;
    }

    return (
        <div className="space-y-6">
            <NewsletterHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterActive={filterActive}
                setFilterActive={setFilterActive}
                onSendClick={modalState.openSendModal}
            />

            <NewsletterStatsCards stats={stats} />

            <SubscribersTable
                subscribers={subscribers.paginatedData}
                totalItems={subscribers.totalItems}
                currentPage={pagination.currentPage}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={pagination.onPageChange}
                searchQuery={searchQuery}
                filterActive={filterActive}
                selection={{
                    selectedEmails: selection.selectedEmails,
                    allActiveSelected: selection.allActiveSelected,
                    onSelectSubscriber: selection.onSelectSubscriber,
                    onSelectAll: selection.onSelectAll
                }}
            />
        </div>
    );
};

export default NewsletterContent;
