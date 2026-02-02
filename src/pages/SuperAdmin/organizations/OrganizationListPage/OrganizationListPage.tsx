import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganizationManager } from './useOrganizationManager';
import OrganizationContent from './OrganizationContent';
import type { Organization } from '@/api/SuperAdmin/organizationService';
import { ErrorBoundary } from '@/components/ui';

const OrganizationDetailsModal = React.lazy(() => import('../../../../components/modals/superadmin/OrganizationDetailsModal').then(m => ({ default: m.OrganizationDetailsModal })));
const OrganizationFormModal = React.lazy(() => import('../../../../components/modals/superadmin/OrganizationFormModal').then(m => ({ default: m.OrganizationFormModal })));

export default function OrganizationListPage() {
    // 1. Initialize Manager (Hook Composition)
    const manager = useOrganizationManager();
    const navigate = useNavigate();

    // 2. Local Modal State (Page Level - Details Modal only)
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
                {selectedOrg && (
                    <OrganizationDetailsModal
                        organization={selectedOrg}
                        isOpen={isDetailsModalOpen}
                        onClose={() => {
                            setIsDetailsModalOpen(false);
                            setSelectedOrg(null);
                        }}
                        onUpdate={() => {
                            manager.actions.refresh();
                            setIsDetailsModalOpen(false);
                        }}
                    />
                )}

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
