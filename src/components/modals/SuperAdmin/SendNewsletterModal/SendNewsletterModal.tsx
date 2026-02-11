import type { SendNewsletterModalProps } from './types';
import { useSendNewsletter } from './hooks/useSendNewsletter';
import SendNewsletterForm from './components/SendNewsletterForm';
import { Button, FormModal } from '@/components/ui';
import { Send } from 'lucide-react';

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

    const description = selectedCount > 0
        ? `Send to ${selectedCount} selected subscriber${selectedCount !== 1 ? 's' : ''}`
        : `Compose and send to ${activeSubscriberCount} active subscribers`;
    const isDisabled = isSending || isSendingTest;
    const footer = (
        <div className="flex justify-end gap-3 w-full">
            <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                disabled={isDisabled}
                className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
            >
                Cancel
            </Button>
            <Button
                type="button"
                onClick={handleSendAll}
                disabled={!canSendAll || isDisabled}
            >
                <Send className="h-4 w-4 mr-2" />
                {isSending
                    ? 'Sending...'
                    : selectedCount > 0
                        ? `Send to Selected (${recipientCount})`
                        : `Send to All (${recipientCount})`
                }
            </Button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Send Newsletter"
            description={description}
            size="md"
            closeOnBackdrop={!isSending && !isSendingTest}
            footer={footer}
        >
            <SendNewsletterForm
                formData={formData}
                errors={errors}
                isSending={isSending}
                isSendingTest={isSendingTest}
                canSendTest={canSendTest}
                testSentSuccess={testSentSuccess}
                handleChange={handleChange}
                handleSendTest={handleSendTest}
            />
        </FormModal>
    );
}

export default SendNewsletterModal;
