import { useState } from 'react';
import { useOrganizationManager } from './useOrganizationManager';
import OrganizationContent from './OrganizationContent';
import { OrganizationDetailsModal } from '../../../components/modals/superadmin/OrganizationDetailsModal';
import { OrganizationFormModal } from '../../../components/modals/superadmin/OrganizationFormModal';
import type { Organization } from '../../../api/SuperAdmin/organizationService';
import ErrorBoundary from '../../../components/UI/ErrorBoundary/ErrorBoundary';

export default function OrganizationListPage() {
    // 1. Initialize Manager (Hook Composition)
    const manager = useOrganizationManager();

    // 2. Local Modal State (Page Level - Details Modal only)
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // 3. Handlers
    const handleOrgClick = (org: Organization) => {
        setSelectedOrg(org);
        setIsDetailsModalOpen(true);
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
        </>
    );
}
