import React, { useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { usePaymentHistory } from './hooks/usePaymentHistory';
import { PaymentHistoryContent } from './components/PaymentHistoryContent';
import { AddPaymentModal } from '@/components/modals/SuperAdmin/AddPaymentModal';
import ImagePreviewModal from '@/components/modals/CommonModals/ImagePreviewModal';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import { deletePayment } from '@/api/SuperAdmin';
import { ErrorBoundary, Button, EmptyState } from '@/components/ui';
import toast from 'react-hot-toast';

/**
 * PaymentHistoryPage - Pure Orchestrator (SRP Compliant)
 * All state is managed by usePaymentHistory hook.
 * Wrapped with ErrorBoundary for graceful error handling.
 */
const PaymentHistoryPage: React.FC = () => {
    const manager = usePaymentHistory();

    // Modal State for Add Payment
    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // --- HANDLERS ---
    const handleConfirmDeletion = async () => {
        const paymentId = manager.state.modals.paymentToDelete;
        if (!paymentId) return;

        try {
            setIsDeleting(true);
            await deletePayment(manager.state.organizationId, paymentId);
            toast.success('Payment deleted successfully');
            manager.actions.modals.closeDeleteModal();
            manager.actions.refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete payment');
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePaymentSuccess = () => {
        manager.actions.refetch();
    };

    // Transform string[] to ImagePreviewModal format
    const previewImages = useMemo(() =>
        manager.state.modals.imagesToView.map((url, index) => ({
            url,
            description: `Payment Proof ${index + 1}`,
            imageNumber: index + 1
        })),
        [manager.state.modals.imagesToView]
    );

    // Error State
    if (manager.state.isFetching === false && manager.state.payments.length === 0 && !manager.state.organizationId) {
        return (
            <div className="py-8">
                <EmptyState
                    title="Error Loading Payments"
                    description="Organization not found"
                    icon={<AlertCircle className="w-16 h-16 text-red-500" />}
                    action={
                        <Button
                            variant="outline"
                            onClick={() => manager.actions.refetch()}
                            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                        >
                            Try Again
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <>
            <ErrorBoundary>
                <PaymentHistoryContent
                    state={manager.state}
                    actions={{
                        ...manager.actions,
                        onAddPayment: () => setIsAddPaymentModalOpen(true),
                    }}
                />
            </ErrorBoundary>

            {/* --- Overlay Modals --- */}

            {/* Add Payment Modal */}
            <AddPaymentModal
                isOpen={isAddPaymentModalOpen}
                onClose={() => setIsAddPaymentModalOpen(false)}
                organizationId={manager.state.organizationId}
                organizationName={manager.state.organizationName}
                onSuccess={handlePaymentSuccess}
            />

            {/* Edit Payment Modal */}
            <AddPaymentModal
                isOpen={manager.state.modals.isEditModalOpen}
                onClose={manager.actions.modals.closeEditModal}
                organizationId={manager.state.organizationId}
                organizationName={manager.state.organizationName}
                onSuccess={handlePaymentSuccess}
                payment={manager.state.modals.paymentToEdit || undefined}
            />

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={manager.state.modals.isImageModalOpen}
                onClose={manager.actions.modals.closeImageModal}
                images={previewImages}
                initialIndex={0}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={manager.state.modals.isDeleteModalOpen}
                title="Confirm Deletion"
                message="Are you sure you want to delete this payment record? This action cannot be undone."
                onConfirm={handleConfirmDeletion}
                onCancel={manager.actions.modals.closeDeleteModal}
                confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
                confirmButtonVariant="danger"
            />
        </>
    );
};

export default PaymentHistoryPage;
