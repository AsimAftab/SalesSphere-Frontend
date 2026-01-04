import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import NoteDetailContent from './NoteDetailContent';
import NoteFormModal from '../../components/modals/NoteFormModal/index';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { useNoteDetail } from './useNoteDetail';

const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, state, actions } = useNoteDetail(id);

  const [activeModal, setActiveModal] = useState<'edit' | 'delete' | null>(null);

  return (
    <Sidebar>
      <NoteDetailContent 
        note={data.note || null} 
        loading={state.isLoading} 
        error={state.error} 
        onBack={() => navigate(-1)}
        onEdit={() => setActiveModal('edit')}
        onDelete={() => setActiveModal('delete')}
      />

      {/* Edit Modal reusing your existing NoteFormModal */}
      <NoteFormModal 
        isOpen={activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        initialData={data.note} 
        parties={data.parties}
        prospects={data.prospects}
        sites={data.sites}
        isSaving={state.isSaving}
        // FIXED: Using any to allow the new existingImages array to pass to actions.update
        onSave={async (formData: any, files: File[]) => {
          try {
            await actions.update({ data: formData, files });
            setActiveModal(null);
          } catch (error) {
            console.error("Update failed:", error);
          }
        }}
      />

      <ConfirmationModal
        isOpen={activeModal === 'delete'}
        title="Delete Note"
        message="This action is permanent. Are you sure you want to remove this note from the audit log?"
        onConfirm={actions.delete}
        onCancel={() => setActiveModal(null)}
        confirmButtonText={state.isDeleting ? "Deleting..." : "Confirm Delete"}
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default NoteDetailPage;