import { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import ProspectDetailContent from './ProspectDetailContent';
import { useProspectDetails } from './useProspectDetails';
import ConfirmationModal from '../../../components/modals/CommonModals/ConfirmationModal';
import EditEntityModal from '../../../components/modals/Entities/EditEntityModal';
import ProspectDetailsSkeleton from './ProspectDetailsSkeleton';

import ErrorBoundary from '../../../components/UI/ErrorBoundary/ErrorBoundary';

const ProspectDetailsPage = () => {
  const { data, isLoading, actions, categories, isMutating, isUploading, isDeletingImage, permissions } = useProspectDetails();
  const [modals, setModals] = useState({ edit: false, transfer: false, delete: false });

  if (isLoading) return <Sidebar><ProspectDetailsSkeleton /></Sidebar>;
  if (!data) return null;

  return (
    <Sidebar>
      <ErrorBoundary>
        <ProspectDetailContent
          data={data}
          actions={actions}
          loadingStates={{ isUploading, isDeletingImage, isMutating }}
          permissions={permissions}
          // Pass modal triggers down to the content
          onEdit={() => setModals({ ...modals, edit: true })}
          onTransfer={() => setModals({ ...modals, transfer: true })}
          onDelete={() => setModals({ ...modals, delete: true })}
        />
      </ErrorBoundary>

      {/* Modals remain at the page level to keep Content clean of "Overlay" logic */}
      {modals.edit && (
        <EditEntityModal
          isOpen={modals.edit}
          title='Edit Prospect'
          onClose={() => setModals({ ...modals, edit: false })}
          onSave={async (updated) => {
            await actions.update({ ...updated, interest: (updated as any).prospectInterest });
            setModals({ ...modals, edit: false });
          }}
          initialData={{
            name: data.prospect.name,
            ownerName: data.prospect.ownerName,
            dateJoined: data.prospect.dateJoined,
            address: data.location.address,
            latitude: data.location.latitude ?? 0,
            longitude: data.location.longitude ?? 0,
            phone: data.contact.phone,
            email: data.contact.email ?? '',
            panVat: data.prospect.panVat ?? '',
            prospectInterest: data.prospect.interest || []
          }}
          categoriesData={categories}
          entityType="Prospect"
          nameLabel="Prospect Name"
          ownerLabel="Owner Name"
          panVatMode="optional"
          descriptionMode="required"
        />
      )}

      <ConfirmationModal
        isOpen={modals.transfer}
        title="Transfer Prospect"
        message={`Convert "${data.prospect.name}" to a permanent Party record?`}
        onConfirm={actions.transfer}
        onCancel={() => setModals({ ...modals, transfer: false })}
      />

      <ConfirmationModal
        isOpen={modals.delete}
        title="Delete Prospect"
        message={`Permanently remove "${data.prospect.name}"? This cannot be undone.`}
        onConfirm={actions.deleteProspect}
        onCancel={() => setModals({ ...modals, delete: false })}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default ProspectDetailsPage;