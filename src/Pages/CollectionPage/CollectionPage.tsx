import React from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import CollectionContent from "./CollectionContent";
import ConfirmationModal from "../../components/modals/CommonModals/ConfirmationModal";
import ErrorBoundary from "../../components/UI/ErrorBoundary/ErrorBoundary";
import { useCollectionViewState } from "./Components/useCollectionViewState";
import { CollectionExportService } from "./Components/ExportCollectionService";
import { type Collection, type NewCollectionData } from "../../api/collectionService";
import CollectionFormModal from "../../components/modals/Collections";


const CollectionPage: React.FC = () => {
    // 1. Facade Hook handles all logic (using client-side filtering / pagination)
    const { state, actions, permissions } = useCollectionViewState();

    // Export Logic
    const handleExport = async (type: 'pdf' | 'excel', dataToExport: Collection[]) => {
        try {
            if (type === 'pdf') {
                await CollectionExportService.toPdf(dataToExport);
            } else {
                await CollectionExportService.toExcel(dataToExport);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Sidebar>
            <ErrorBoundary>
                <CollectionContent
                    state={state}
                    actions={actions}
                    permissions={permissions}
                    onExportPdf={(data) => handleExport('pdf', data)}
                    onExportExcel={(data) => handleExport('excel', data)}
                />
            </ErrorBoundary>

            {/* Bulk Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={state.isDeleteModalOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to delete ${state.idsToDelete.length} collection(s)? This action cannot be undone.`}
                confirmButtonText={state.isDeleting ? "Deleting..." : "Delete"}
                confirmButtonVariant="danger"
                onConfirm={() => actions.deleteCollections(state.idsToDelete)}
                onCancel={actions.closeDeleteModal}
            />

            {/* Collection Form Modal (Create) */}
            <CollectionFormModal
                isOpen={state.isCreateModalOpen}
                onClose={actions.closeCreateModal}
                parties={state.partiesData}
                isSaving={state.isCreating}
                onSave={async (data: NewCollectionData, _images: File[]) => {
                    try {
                        // Note: Images are passed but API integration needed
                        // for proper image upload handling
                        await actions.createCollection({ data, files: _images });
                    } catch (error: unknown) {
                        throw new Error(error instanceof Error ? error.message : 'Failed to create collection');
                    }
                }}
            />
        </Sidebar>
    );
};

export default CollectionPage;
