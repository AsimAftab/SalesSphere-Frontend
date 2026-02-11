import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import { useCollectionDetail } from './hooks/useCollectionDetail';
import CollectionDetailContent from './CollectionDetailContent';
import CollectionFormModal from '@/components/modals/Collections';
import { type NewCollectionData } from '@/api/collectionService';
import { useQuery } from '@tanstack/react-query';
import { getParties } from '@/api/partyService';
import { ErrorBoundary } from '@/components/ui';

const CollectionDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data, state, actions, permissions } = useCollectionDetail(id);

    // Fetch parties for edit modal
    const { data: parties = [] } = useQuery({
        queryKey: ['parties-list'],
        queryFn: () => getParties(),
        enabled: state.activeModal === 'edit',
    });

    return (
        <Sidebar>
            <ErrorBoundary>
                <CollectionDetailContent
                    data={data}
                    state={state}
                    actions={actions}
                    permissions={permissions}
                />
            </ErrorBoundary>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={state.activeModal === 'delete'}
                title="Delete Collection"
                message={`Are you sure you want to delete this collection? This action cannot be undone.`}
                onConfirm={() => {
                    actions.delete();
                    actions.closeModal();
                }}
                onCancel={actions.closeModal}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                confirmButtonVariant="danger"
            />

            {/* Collection Form Modal (Edit) */}
            <CollectionFormModal
                isOpen={state.activeModal === 'edit'}
                onClose={actions.closeModal}
                isEditMode={state.activeModal === 'edit'}
                initialData={data.collection}
                parties={parties}
                isSaving={state.isSaving}
                onSave={async (collectionData: NewCollectionData, _images: File[]) => {
                    try {
                        // Note: Images are passed but API integration needed
                        // for proper image upload handling
                        await actions.update(collectionData, _images);
                    } catch (error: unknown) {
                        throw new Error(error instanceof Error ? error.message : 'Failed to update collection');
                    }
                }}
            />
        </Sidebar>
    );
};

export default CollectionDetailsPage;
