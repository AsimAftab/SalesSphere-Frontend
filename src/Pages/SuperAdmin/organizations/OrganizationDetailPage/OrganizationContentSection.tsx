import React from 'react';
import type { Organization } from '../../../../api/SuperAdmin/organizationService';
import { OrganizationDetailsHeader } from './components/OrganizationDetailsHeader';
import { OrganizationUsersTable } from './components/OrganizationUsersTable';
import { SubscriptionDetailsCard } from './components/SubscriptionDetailsCard';
import { OrganizationGeneralInfoCard } from './components/OrganizationGeneralInfoCard';
import { OrganizationLocationCard } from './components/OrganizationLocationCard';
import ErrorBoundary from '../../../../components/UI/ErrorBoundary/ErrorBoundary';
import { AlertCircle } from 'lucide-react';

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

    const handleManageSubscription = () => {
        // Placeholder for manage subscription action
        console.log('Manage subscription');
        // toast.success("Manage Subscription feature coming soon!");
    };

    const handleAddUser = () => {
        // Placeholder for add user action
        console.log('Add user');
        // toast.success("Add User feature coming soon!");
    };

    return (
        <div className="space-y-6">
            {/* Header with Title and Actions */}
            <OrganizationDetailsHeader
                title="Organization Details"
                backPath="/system-admin/organizations"
                onBulkImport={onBulkImport}
                onEdit={onEdit}
                onDeactivate={onDeactivate}
                organizationStatus={organization.status}
            />

            {/* Row 1: Organization Details & Location */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column - Organization Details (Generic Info) */}
                <div className="lg:col-span-3">
                    <ErrorBoundary fallback={<CardErrorFallback />}>
                        <OrganizationGeneralInfoCard organization={organization} />
                    </ErrorBoundary>
                </div>

                {/* Right Column - Location */}
                <div className="lg:col-span-2">
                    <ErrorBoundary fallback={<CardErrorFallback />}>
                        <OrganizationLocationCard organization={organization} />
                    </ErrorBoundary>
                </div>
            </div>

            {/* Row 2: Subscription & Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ErrorBoundary fallback={<CardErrorFallback />}>
                    <SubscriptionDetailsCard
                        organization={organization}
                        onManage={handleManageSubscription}
                    />
                </ErrorBoundary>
                <ErrorBoundary fallback={<CardErrorFallback />}>
                    <OrganizationUsersTable
                        users={organization.users || []}
                        onAddUser={handleAddUser}
                    />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default OrganizationContentSection;
