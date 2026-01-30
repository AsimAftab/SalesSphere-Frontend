import React, { useState } from 'react';
import ErrorBoundary from '../../../../components/UI/ErrorBoundary/ErrorBoundary';
import { useOrganizationDetails } from './useOrganizationDetails';
import OrganizationContentSection from './OrganizationContentSection';
import { Loader2, AlertCircle } from 'lucide-react';
import Button from '../../../../components/UI/Button/Button';
import BulkUploadPartiesModal from '../../../../components/modals/superadmin/BulkUploadParties/BulkUploadPartiesModal';
import { OrganizationFormModal } from '../../../../components/modals/superadmin/OrganizationFormModal/OrganizationFormModal';
import ConfirmationModal from '../../../../components/modals/CommonModals/ConfirmationModal';
import { updateOrganization, toggleOrganizationStatus } from '../../../../api/SuperAdmin/organizationService';
import toast from 'react-hot-toast';

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

    const handleSave = async (formData: any) => {
        if (!data?.organization?.id) return;
        try {
            await updateOrganization(data.organization.id, formData);
            toast.success('Organization updated successfully');
            refetch();
            setIsEditModalOpen(false);
        } catch (error: any) {
            console.error('Failed to update organization', error);
            toast.error(error.message || 'Failed to update organization');
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
        } catch (error: any) {
            console.error('Failed to toggle status', error);
            toast.error(error.message || 'Failed to change organization status');
        }
    };

    const handleBulkImport = () => {
        setIsBulkUploadModalOpen(true);
    };

    return (
        <ErrorBoundary>
            {/* Loading State */}
            {isLoading && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-slate-600">Loading organization details...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-red-900 font-medium">Error Loading Organization</p>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={refetch}
                            className="text-sm py-2 px-4"
                        >
                            Retry
                        </Button>
                    </div>
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
