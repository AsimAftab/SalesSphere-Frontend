import React from 'react';
import { useNewsletterManager } from './hooks/useNewsletterManager';
import NewsletterContent from './NewsletterContent';
import { SendNewsletterModal } from '@/components/modals/superadmin/SendNewsletterModal';
import { ErrorBoundary } from '@/components/ui';

const NewsletterPage: React.FC = () => {
    const manager = useNewsletterManager();

    return (
        <>
            <ErrorBoundary>
                <NewsletterContent manager={manager} />
            </ErrorBoundary>

            <SendNewsletterModal
                isOpen={manager.modalState.isSendModalOpen}
                onClose={manager.modalState.closeSendModal}
                onSend={manager.actions.handleSendNewsletter}
                activeSubscriberCount={manager.stats?.active || 0}
                selectedCount={manager.selection.selectedCount}
            />
        </>
    );
};

export default NewsletterPage;
