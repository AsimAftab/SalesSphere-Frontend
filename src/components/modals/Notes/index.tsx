import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

import type { Note } from '../../../api/notesService';
import Button from '../../UI/Button/Button';
import { useAuth } from '../../../api/authService';
import { useNoteEntity } from './hooks/useNoteEntity';
import { NoteEntityForm } from './components/NoteEntityForm';

export interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any, files: File[]) => Promise<void>;
  isSaving: boolean;
  initialData?: Note | null;
  parties: any[];
  prospects: any[];
  sites: any[];
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex justify-between items-center sticky top-0 bg-white z-50">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {initialData ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 scrollbar-hide">
          <NoteEntityForm
            register={register}
            control={control}
            setValue={setValue}
            errors={errors}
            fileGallery={fileGallery}
            entitySelection={entitySelection}
            allowedTypes={allowedTypes}
          />

          {/* Footer */}
          <div className="pt-4 flex gap-3 sticky bottom-0 bg-white border-t mt-6">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="flex-1 font-bold text-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 font-bold shadow-lg shadow-blue-200"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin mx-auto" /> : initialData ? 'Save Changes' : 'Create Note'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NoteFormModal;
