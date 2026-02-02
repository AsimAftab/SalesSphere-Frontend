import React from 'react';
import type { Organization } from '@/api/SuperAdmin/organizationService';
import { toggleOrgUserAccess } from '@/api/SuperAdmin/organizationService';
import { OrganizationDetailsHeader } from './components/OrganizationDetailsHeader';
import { OrganizationUsersTable } from './components/OrganizationUsersTable';
import { SubscriptionDetailsCard } from './components/SubscriptionDetailsCard';
import { OrganizationGeneralInfoCard } from './components/OrganizationGeneralInfoCard';
import { OrganizationLocationCard } from './components/OrganizationLocationCard';
import { AlertCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui';
import { useOrganizationUsers } from './hooks/useOrganizationUsers';
import { useAuth } from '@/api/authService';
import toast from 'react-hot-toast';

interface OrganizationContentSectionProps {
    organization: Organization;
    onEdit: () => void;
    onDeactivate: () => void;
    onBulkImport: () => void;
}

const CardErrorFallback = () => (
    <div className="h-full min-h-[200px] flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl border border-red-100 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-sm font-medium text-red-800">Failed to load component</p>
        <p className="text-xs text-red-600 mt-1">Please refresh the page</p>
    </div>
);

const OrganizationContentSection: React.FC<OrganizationContentSectionProps> = ({
    organization,
    onEdit,
    onDeactivate,
    onBulkImport
}) => {
    const { users, isLoading, isError, error, refetch } = useOrganizationUsers(organization.id);
    const { user: currentUser } = useAuth();

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

    const handleManageSubscription = () => {
        console.log('Manage subscription');
    };

    return (
        <div className="space-y-6">
            <OrganizationDetailsHeader
                title="Organization Details"
                backPath="/system-admin/organizations"
                onBulkImport={onBulkImport}
                onEdit={onEdit}
                onDeactivate={onDeactivate}
                organizationStatus={organization.status}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <ErrorBoundary fallback={<CardErrorFallback />}>
                        <OrganizationGeneralInfoCard organization={organization} />
                    </ErrorBoundary>
                </div>
                <div className="lg:col-span-2">
                    <ErrorBoundary fallback={<CardErrorFallback />}>
                        <OrganizationLocationCard organization={organization} />
                    </ErrorBoundary>
                </div>
            </div>

            <ErrorBoundary fallback={<CardErrorFallback />}>
                <SubscriptionDetailsCard
                    organization={organization}
                    onManage={handleManageSubscription}
                />
            </ErrorBoundary>
            <ErrorBoundary fallback={<CardErrorFallback />}>
                <OrganizationUsersTable
                    users={users}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    onRetry={refetch}
                    onToggleAccess={handleToggleAccess}
                />
            </ErrorBoundary>
        </div>
    );
};

export default OrganizationContentSection;
