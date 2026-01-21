import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import NoteDetailContent from './NoteDetailContent';
import NoteFormModal from '../../components/modals/Notes/index';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ErrorBoundary from '../../components/UI/ErrorBoundary/ErrorBoundary';
import { useNoteDetail } from './useNoteDetail';
import { useAuth } from '../../api/authService';

/**
 * NotesDetailPage - Main page component for viewing a single note.
 * Handles edit modal, delete confirmation, and permission-based actions.
 */
const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, state, actions } = useNoteDetail(id);
  const { hasPermission } = useAuth();

  const [activeModal, setActiveModal] = useState<'edit' | 'delete' | null>(null);

  const canEdit = hasPermission('notes', 'update');
  const canDelete = hasPermission('notes', 'delete');

  return (
    <Sidebar>
      <ErrorBoundary>
        <NoteDetailContent
          note={data.note || null}
          loading={state.isLoading}
          error={state.error}
          onBack={() => navigate(-1)}
          onEdit={() => setActiveModal('edit')}
          onDelete={() => setActiveModal('delete')}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </ErrorBoundary>

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