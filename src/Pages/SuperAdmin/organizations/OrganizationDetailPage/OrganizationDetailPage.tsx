import React from 'react';
import ErrorBoundary from '../../../../components/UI/ErrorBoundary/ErrorBoundary';
import { useOrganizationDetails } from './useOrganizationDetails';
import OrganizationContentSection from './OrganizationContentSection';
import { Card } from '../../../../components/UI/SuperadminComponents/card';
import { Loader2, AlertCircle } from 'lucide-react';
import CustomButton from '../../../../components/UI/Button/Button';

const OrganizationDetailPage: React.FC = () => {
    const { data, isLoading, error, refetch } = useOrganizationDetails();

    const handleEdit = () => {
        // TODO: Implement edit modal
        console.log('Edit organization:', data?.organization);
    };

    const handleDeactivate = () => {
        // TODO: Implement deactivate/activate functionality
        console.log('Toggle organization status:', data?.organization);
    };

    const handleBulkImport = () => {
        // TODO: Implement bulk import functionality
        console.log('Bulk import users for organization:', data?.organization);
    };

    return (
        <ErrorBoundary>
            {/* Loading State */}
            {isLoading && (
                <Card className="p-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-slate-600">Loading organization details...</p>
                    </div>
                </Card>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <Card className="border-red-200 bg-red-50 p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-red-900 font-medium">Error Loading Organization</p>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                        <CustomButton
                            variant="outline"
                            onClick={refetch}
                            className="text-sm py-2 px-4"
                        >
                            Retry
                        </CustomButton>
                    </div>
                </Card>
            )}

            {/* Main Content */}
            {data && !isLoading && !error && (
                <OrganizationContentSection
                    organization={data.organization}
                    onEdit={handleEdit}
                    onDeactivate={handleDeactivate}
                    onBulkImport={handleBulkImport}
                />
            )}
        </ErrorBoundary>
    );
};

export default OrganizationDetailPage;
