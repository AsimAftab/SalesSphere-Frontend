import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import type { Note, CreateNoteRequest } from '../../../api/notesService';
import Button from '../../UI/Button/Button';
import { useAuth } from '../../../api/authService';
import { useNoteEntity } from './hooks/useNoteEntity';
import { NoteEntityForm } from './components/NoteEntityForm';
import type { PartyEntity, ProspectEntity, SiteEntity } from './common/NoteEntityTypes';

/**
 * Props for the NoteFormModal component
 */
export interface NoteFormModalProps {
  /** Whether the modal is currently visible */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback to save the note, receives form data and files */
  onSave: (formData: CreateNoteRequest & { existingImages: any[] }, files: File[]) => Promise<void>;
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {initialData ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
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

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
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
              isLoading={isSaving}
            >
              {initialData ? 'Save Changes' : 'Create Note'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NoteFormModal;
