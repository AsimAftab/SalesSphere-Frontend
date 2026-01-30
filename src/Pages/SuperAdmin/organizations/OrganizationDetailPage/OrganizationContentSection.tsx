import React from 'react';
import type { Organization } from '../../../../api/SuperAdmin/organizationService';
import { OrganizationDetailsHeader } from './components/OrganizationDetailsHeader';
import { OrganizationUsersTable } from './components/OrganizationUsersTable';
import { SubscriptionDetailsCard } from './components/SubscriptionDetailsCard';
import { OrganizationGeneralInfoCard } from './components/OrganizationGeneralInfoCard';
import { OrganizationLocationCard } from './components/OrganizationLocationCard';

interface OrganizationContentSectionProps {
    organization: Organization;
    onEdit: () => void;
    onDeactivate: () => void;
    onBulkImport: () => void;
}

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
                    <OrganizationGeneralInfoCard organization={organization} />
                </div>

                {/* Right Column - Location */}
                <div className="lg:col-span-2">
                    <OrganizationLocationCard organization={organization} />
                </div>
            </div>

            {/* Row 2: Subscription & Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubscriptionDetailsCard
                    organization={organization}
                    onManage={handleManageSubscription}
                />
                <OrganizationUsersTable
                    users={organization.users || []}
                    onAddUser={handleAddUser}
                />
            </div>
        </div>
    );
};

export default OrganizationContentSection;
