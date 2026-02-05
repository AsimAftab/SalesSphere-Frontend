import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganizationManager } from './useOrganizationManager';
import OrganizationContent from './OrganizationContent';
import type { Organization } from '@/api/SuperAdmin/organizationService';
import { ErrorBoundary } from '@/components/ui';

const OrganizationFormModal = React.lazy(() => import('../../../../components/modals/SuperAdmin/OrganizationFormModal').then(m => ({ default: m.OrganizationFormModal })));

export default function OrganizationListPage() {
    // 1. Initialize Manager (Hook Composition)
    const manager = useOrganizationManager();
    const navigate = useNavigate();

    // 3. Handlers
    const handleOrgClick = (org: Organization) => {
        // Navigate to detail page instead of opening modal
        navigate(`/system-admin/organizations/${org.id}`);
    };

    return (
        <>
            {/* Main Content Area */}
            <ErrorBoundary>
                <OrganizationContent
                    manager={manager}
                    onOrgClick={handleOrgClick}
                    onCreateClick={manager.modalState.openAdd}
                />
            </ErrorBoundary>

            {/* Modals */}
            <Suspense fallback={null}>
                <OrganizationFormModal
                    isOpen={manager.modalState.isOpen}
                    onClose={manager.modalState.close}
                    onSave={async (data) => {
                        if (manager.modalState.editingOrg) {
                            await manager.actions.updateOrganization(manager.modalState.editingOrg.id, data);
                        } else {
                            await manager.actions.addOrganization(data);
                        }
                    }}
                    initialData={manager.modalState.editingOrg}
                />
            </Suspense>
        </>
    );
}

