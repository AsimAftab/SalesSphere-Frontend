import React, { useState } from 'react';
import { useOrganizationDetails } from './useOrganizationDetails';
import OrganizationContentSection from './OrganizationContentSection';
import OrganizationDetailSkeleton from './components/OrganizationDetailSkeleton';
import { AlertCircle } from 'lucide-react';
import BulkUploadPartiesModal from '@/components/modals/superadmin/BulkUploadParties/BulkUploadPartiesModal';
import { OrganizationFormModal } from '@/components/modals/superadmin/OrganizationFormModal/OrganizationFormModal';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import { updateOrganization, toggleOrganizationStatus } from '@/api/SuperAdmin/organizationService';
import toast from 'react-hot-toast';
import type { OrganizationFormData } from '@/components/modals/superadmin/OrganizationFormModal/types';
import { ErrorBoundary, Button, EmptyState } from '@/components/ui';

const OrganizationDetailPage: React.FC = () => {
    const { data, isLoading, error, refetch } = useOrganizationDetails();
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // State for Confirmation Modal
    const [confirmationModalConfig, setConfirmationModalConfig] = useState<{
        isOpen: boolean;
        type: 'deactivate' | 'reactivate';
    }>({
        isOpen: false,
        type: 'deactivate'
    });

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleSave = async (formData: OrganizationFormData) => {
        if (!data?.organization?.id) return;
        try {
            await updateOrganization(data.organization.id, formData);
            toast.success('Organization updated successfully');
            refetch();
            setIsEditModalOpen(false);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to update organization');
        }
    };

    const handleToggleStatus = async () => {
        if (!data?.organization?.id) return;

        try {
            const isActivating = confirmationModalConfig.type === 'reactivate';
            await toggleOrganizationStatus(data.organization.id, isActivating);

            toast.success(`Organization ${isActivating ? 'reactivated' : 'deactivated'} successfully`);
            setConfirmationModalConfig(prev => ({ ...prev, isOpen: false }));
            refetch();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to change organization status');
        }
    };

    const handleBulkImport = () => {
        setIsBulkUploadModalOpen(true);
    };

    return (
        <ErrorBoundary>
            {/* Loading State */}
            {isLoading && <OrganizationDetailSkeleton />}

            {/* Error State */}
            {error && !isLoading && (
                <div className="py-8">
                    <EmptyState
                        title="Error Loading Organization"
                        description={error}
                        icon={<AlertCircle className="w-16 h-16 text-red-500" />}
                        action={
                            <Button
                                variant="outline"
                                onClick={refetch}
                                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                            >
                                Try Again
                            </Button>
                        }
                    />
                </div>
            )}

            {/* Main Content */}
            {data && !isLoading && !error && (
                <>
                    <OrganizationContentSection
                        organization={data.organization}
                        onEdit={handleEdit}
                        onDeactivate={() => setConfirmationModalConfig({
                            isOpen: true,
                            type: data.organization.status === 'Active' ? 'deactivate' : 'reactivate'
                        })}
                        onBulkImport={handleBulkImport}
                    />

                    <BulkUploadPartiesModal
                        isOpen={isBulkUploadModalOpen}
                        onClose={() => setIsBulkUploadModalOpen(false)}
                        organizationId={data.organization.id}
                        organizationName={data.organization.name}
                        onUploadSuccess={() => {
                            setIsBulkUploadModalOpen(false);
                            refetch();
                        }}
                    />

                    <OrganizationFormModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSave}
                        initialData={data.organization}
                    />

                    <ConfirmationModal
                        isOpen={confirmationModalConfig.isOpen}
                        onCancel={() => setConfirmationModalConfig(prev => ({ ...prev, isOpen: false }))}
                        onConfirm={handleToggleStatus}
                        title={confirmationModalConfig.type === 'deactivate' ? 'Deactivate Organization' : 'Reactivate Organization'}
                        message={confirmationModalConfig.type === 'deactivate'
                            ? 'Are you sure you want to deactivate this organization? This will disable access for all users.'
                            : 'Are you sure you want to reactivate this organization? Access will be restored for all users.'}
                        confirmButtonText={confirmationModalConfig.type === 'deactivate' ? 'Deactivate' : 'Reactivate'}
                        confirmButtonVariant={confirmationModalConfig.type === 'deactivate' ? 'danger' : 'success'}
                        cancelButtonText="Cancel"
                    />
                </>
            )}
        </ErrorBoundary>
    );
};

export default OrganizationDetailPage;
