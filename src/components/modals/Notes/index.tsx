import React, { useMemo } from 'react';

import type { Note, CreateNoteRequest } from '@/api/notesService';
import { useAuth } from '@/api/authService';
import { useNoteEntity } from './hooks/useNoteEntity';
import { NoteEntityForm } from './components/NoteEntityForm';
import type { PartyEntity, ProspectEntity, SiteEntity, ExistingImage } from './common/NoteEntityTypes';
import { Button, FormModal } from '@/components/ui';

/**
 * Props for the NoteFormModal component
 */
export interface NoteFormModalProps {
  /** Whether the modal is currently visible */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback to save the note, receives form data and files */
  onSave: (formData: CreateNoteRequest & { existingImages: ExistingImage[] }, files: File[]) => Promise<void>;
  /** Whether a save operation is in progress */
  isSaving: boolean;
  /** Existing note data for edit mode, null/undefined for create mode */
  initialData?: Note | null;
  /** List of available parties to link notes to */
  parties: PartyEntity[];
  /** List of available prospects to link notes to */
  prospects: ProspectEntity[];
  /** List of available sites to link notes to */
  sites: SiteEntity[];
}

const NoteFormModal: React.FC<NoteFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialData,
  parties,
  prospects,
  sites
}) => {
  // Permission Logic
  const { hasPermission, isPlanFeatureEnabled } = useAuth();

  const allowedTypes = useMemo(() => {
    const types: string[] = [];
    const partyAccess = isPlanFeatureEnabled('parties') && hasPermission('parties', 'viewList');
    const prospectAccess = isPlanFeatureEnabled('prospects') && hasPermission('prospects', 'viewList');
    const siteAccess = isPlanFeatureEnabled('sites') && hasPermission('sites', 'viewList');

    if (partyAccess) types.push('party');
    if (prospectAccess) types.push('prospect');
    if (siteAccess) types.push('site');
    return types;
  }, [hasPermission, isPlanFeatureEnabled]);

  // Use the extracted hook
  const {
    register,
    control,
    setValue,
    errors,
    handleSubmit,
    fileGallery,
    entitySelection
  } = useNoteEntity({
    isOpen,
    initialData,
    parties,
    prospects,
    sites,
    allowedTypes,
    onSave
  });

  const footer = (
    <div className="flex justify-end gap-3 w-full">
      <Button
        variant="outline"
        type="button"
        onClick={onClose}
        disabled={isSaving}
        className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
      >
        Cancel
      </Button>
      <Button
        variant="secondary"
        type="submit"
        form="note-form"
        isLoading={isSaving}
      >
        {initialData ? 'Save Changes' : 'Create Note'}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Note' : 'Create New Note'}
      size="md"
      className="max-h-[90vh]"
      footer={footer}
    >
      <form id="note-form" onSubmit={handleSubmit} className="flex flex-col">
        <div className="p-6">
          <NoteEntityForm
            register={register}
            control={control}
            setValue={setValue}
            errors={errors}
            fileGallery={fileGallery}
            entitySelection={entitySelection}
            allowedTypes={allowedTypes}
            isEditMode={!!initialData}
          />
        </div>
      </form>
    </FormModal>
  );
};

export default NoteFormModal;
