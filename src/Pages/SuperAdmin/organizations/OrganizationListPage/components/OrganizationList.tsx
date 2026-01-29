import React from 'react';
import { EmptyState } from '../../../../../components/UI/EmptyState/EmptyState';
import { BuildingOfficeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { OrganizationListSkeleton } from './OrganizationsSkeleton';
import type { Organization } from '../../../../../api/SuperAdmin/organizationService';
import { OrganizationCard } from '../../../../../components/UI/shared_cards/OrganizationCard';

interface OrganizationListProps {
    data: Organization[];
    isLoading: boolean;
    error?: string | null;
    onOrgClick: (org: Organization) => void;
    onRetry?: () => void;
}

const OrganizationList: React.FC<OrganizationListProps> = ({
    data,
    isLoading,
    error,
    onOrgClick,
    onRetry
}) => {

    if (isLoading) {
        return <OrganizationListSkeleton />;
    }

    if (error) {
        return (
            <div className="mt-8">
                <EmptyState
                    title="Error Loading Organizations"
                    description={error}
                    icon={<ExclamationTriangleIcon className="w-16 h-16 text-red-400" />}
                    action={
                        onRetry ? (
                            <button
                                onClick={onRetry}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        ) : undefined
                    }
                />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="mt-8">
                <EmptyState
                    title="No Organizations Found"
                    description="No organizations match your current filters. Try adjusting your search criteria or add a new organization."
                    icon={<BuildingOfficeIcon className="w-16 h-16 text-gray-300" />}
                />
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {data.map((org) => (
                <OrganizationCard
                    key={org.id}
                    organization={org}
                    onClick={onOrgClick}
                />
            ))}
        </div>
    );
};

export default OrganizationList;
