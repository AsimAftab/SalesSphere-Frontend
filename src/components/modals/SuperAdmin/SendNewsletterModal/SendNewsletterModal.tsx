import { X } from 'lucide-react';
import type { SendNewsletterModalProps } from './types';
import { useSendNewsletter } from './hooks/useSendNewsletter';
import SendNewsletterForm from './components/SendNewsletterForm';
import { ErrorBoundary } from '@/components/ui';

export function SendNewsletterModal(props: SendNewsletterModalProps) {
    const { isOpen, activeSubscriberCount, selectedCount = 0 } = props;
    const recipientCount = selectedCount > 0 ? selectedCount : activeSubscriberCount;
    const {
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
    } = useSendNewsletter(props);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
            onClick={handleClose}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClose()}
            role="button"
            tabIndex={0}
        >
            <div
                className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto z-[10000] shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="dialog"
                tabIndex={-1}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Send Newsletter
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {selectedCount > 0
                                ? `Send to ${selectedCount} selected subscriber${selectedCount !== 1 ? 's' : ''}`
                                : `Compose and send to ${activeSubscriberCount} active subscribers`
                            }
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSending || isSendingTest}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <ErrorBoundary>
                    <SendNewsletterForm
                        formData={formData}
                        errors={errors}
                        isSending={isSending}
                        isSendingTest={isSendingTest}
                        canSendTest={canSendTest}
                        canSendAll={canSendAll}
                        testSentSuccess={testSentSuccess}
                        recipientCount={recipientCount}
                        hasSelection={selectedCount > 0}
                        handleChange={handleChange}
                        handleSendTest={handleSendTest}
                        handleSendAll={handleSendAll}
                        handleClose={handleClose}
                    />
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default SendNewsletterModal;
