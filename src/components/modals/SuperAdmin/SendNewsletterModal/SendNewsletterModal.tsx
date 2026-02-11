import type { SendNewsletterModalProps } from './types';
import { useSendNewsletter } from './hooks/useSendNewsletter';
import SendNewsletterForm from './components/SendNewsletterForm';
import { FormModal } from '@/components/ui';

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

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Send Newsletter"
            description={description}
            size="md"
            closeOnBackdrop={!isSending && !isSendingTest}
        >
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
        </FormModal>
    );
}

export default SendNewsletterModal;
