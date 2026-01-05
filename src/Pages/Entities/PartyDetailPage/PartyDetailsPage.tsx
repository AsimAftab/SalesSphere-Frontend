// src/pages/Entities/PartyPage/PartyDetailsPage/PartyDetailsPage.tsx
import React, { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import PartyDetailsContent from './PartyDetailsContent';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import EditEntityModal from '../../../components/Entities/EditEntityModal';
import { usePartyDetails } from './usePartyDetails';
import type { EditEntityData } from '../../../components/Entities/EditEntityModal/types';

const PartyDetailsPage: React.FC = () => {
  // Pull data, loading states, and async mutations from the orchestrator hook
  const { data, isLoading, mutations, partyTypes } = usePartyDetails();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  /**
   * ✅ FIX: Coordinates between the Modal's submitted data and the API mutation.
   */
  const handleModalSave = async (updated: EditEntityData) => {
    try {
      // Use mutateAsync from usePartyDetails to await the response
      await mutations.update({
        ...updated,
        // Ensure coordinates are strictly numbers (Fixes TS2322 in image_2be14b.png)
        latitude: updated.latitude ?? 0,
        longitude: updated.longitude ?? 0,
      });
      setIsEditOpen(false);
    } catch (error) {
      // Error feedback logic (toasts) is centralized inside the usePartyDetails hook
    }
  };

  return (
    <Sidebar>
      <PartyDetailsContent
        data={data || null}
        loading={isLoading}
        onOpenEdit={() => setIsEditOpen(true)}
        onOpenDelete={() => setIsDeleteConfirmOpen(true)}
        onImageUpload={mutations.uploadImage}
        onImageDelete={mutations.deleteImage}
        isUploading={mutations.isUploading}
        isDeletingImage={mutations.isDeleting}
      />

      {data && (
        <>
          <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            title="Confirm Deletion"
            message={`Are you sure you want to delete "${data.party.companyName}"? This action cannot be undone.`}
            onConfirm={mutations.delete}
            onCancel={() => setIsDeleteConfirmOpen(false)}
            confirmButtonVariant="danger"
            confirmButtonText="Delete Party"
          />

          <EditEntityModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleModalSave}
            title="Edit Party Details" // ✅ FIX: Added missing 'title' prop (Fixes TS2741 in image_2bf42c.png)
            entityType="Party"
            partyTypesList={partyTypes}
            initialData={{
              name: data.party.companyName,
              ownerName: data.party.ownerName,
              address: data.party.address,
              phone: (data.party.phone ?? '').replace(/\D/g, ''), // Sanitize phone formatting
              email: data.party.email || '',
              dateJoined: data.party.dateCreated || '',
              panVat: data.party.panVat || '',
              description: data.party.description || '',
              partyType: data.party.partyType || '',
              latitude: data.party.latitude ?? 0,
              longitude: data.party.longitude ?? 0,
            }}
            panVatMode="required"
            descriptionMode="required"
            nameLabel="Party Name"
            ownerLabel="Owner Name"
          />
        </>
      )}
    </Sidebar>
  );
};

export default PartyDetailsPage;