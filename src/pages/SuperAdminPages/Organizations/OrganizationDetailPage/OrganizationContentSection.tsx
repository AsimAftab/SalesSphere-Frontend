import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Organization } from '@/api/SuperAdmin';
import { toggleOrgUserAccess } from '@/api/SuperAdmin';
import { OrganizationDetailsHeader } from './components/OrganizationDetailsHeader';
import { OrganizationUsersTable } from './components/OrganizationUsersTable';
import { OrganizationGeneralInfoCard } from './components/OrganizationGeneralInfoCard';
import { OrganizationLocationCard } from './components/OrganizationLocationCard';
import { useOrganizationUsers } from './hooks/useOrganizationUsers';
import { useAuth } from '@/api/authService';
import toast from 'react-hot-toast';

interface OrganizationContentSectionProps {
    organization: Organization;
    onEdit: () => void;
    onDeactivate: () => void;
    onBulkImport: () => void;
    onExtendSubscription: () => void;
}

const OrganizationContentSection: React.FC<OrganizationContentSectionProps> = ({
    organization,
    onEdit,
    onDeactivate,
    onBulkImport,
    onExtendSubscription,
}) => {
    const navigate = useNavigate();
    const { users, isLoading, isError, error, refetch } = useOrganizationUsers(organization.id);
    const { user: currentUser } = useAuth();

    const handleViewPayments = () => {
        navigate(`/system-admin/organizations/${organization.id}/payments`);
    };

    const handleToggleAccess = async (userId: string, currentStatus: boolean) => {
        if (currentUser?.role === 'admin') {
            toast.error('You do not have permission to change user access');
            return;
        }
        try {
            await toggleOrgUserAccess(organization.id, userId, !currentStatus);
            toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            refetch();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to toggle user access');
        }
    };

    return (
        <div className="space-y-6">
            <OrganizationDetailsHeader
                title="Organization Details"
                backPath="/system-admin/organizations"
                onViewPayments={handleViewPayments}
                onExtendSubscription={onExtendSubscription}
                onBulkImport={onBulkImport}
                onEdit={onEdit}
                onDeactivate={onDeactivate}
                organizationStatus={organization.status}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <OrganizationGeneralInfoCard organization={organization} />
                </div>
                <div className="lg:col-span-2">
                    <OrganizationLocationCard organization={organization} />
                </div>
            </div>

            <OrganizationUsersTable
                users={users}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onRetry={refetch}
                onToggleAccess={handleToggleAccess}
            />
        </div>
    );
};

export default OrganizationContentSection;
