import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Cloud } from 'lucide-react';

import type { Note } from '../../../api/notesService';
import { noteSchema, type NoteFormData } from './NoteFormSchema';
import { EntityTypeSelector } from './EntityTypeSelector';
import { ImageUploadSection } from './ImageUploadSection';
import { SearchableSelect } from './SearchableSelect';
import { useFileGallery } from './useFileGallery';
import Button from '../../UI/Button/Button';
import { useAuth } from '../../../api/authService'; // Import useAuth

const ENTITY_CONFIG: Record<string, { label: string; key: string; nameField: string }> = {
  party: { label: 'Party', key: 'party', nameField: 'partyName' },
  prospect: { label: 'Prospect', key: 'prospect', nameField: 'prospectName' },
  site: { label: 'Site', key: 'site', nameField: 'siteName' }
};

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
  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', description: '', entityId: '', newImages: [] }
  });

  // Permission Logic
  const { hasPermission, isPlanFeatureEnabled } = useAuth();

  const allowedTypes = useMemo(() => {
    const types: string[] = [];

    // Match Sidebar Logic: Check if Module is in Plan && User has Role Permission
    // We avoid 'hasAccess' because it strictly checks specific features in the Plan, which might not be defined for standard 'viewList'
    const partyAccess = isPlanFeatureEnabled('parties') && hasPermission('parties', 'viewList');
    const prospectAccess = isPlanFeatureEnabled('prospects') && hasPermission('prospects', 'viewList');
    const siteAccess = isPlanFeatureEnabled('sites') && hasPermission('sites', 'viewList');



    if (partyAccess) types.push('party');
    if (prospectAccess) types.push('prospect');
    if (siteAccess) types.push('site');
    return types;
  }, [hasPermission, isPlanFeatureEnabled]);


  // Destructure the values from the gallery hook
  const {
    newFiles, // Changed name from 'files' to match hook output and prevent reference errors
    newPreviews: previews,
    existingImages,
    addFiles,
    removeNewFile: removeFile,
    removeExistingImage,
    setInitialImages,
    totalCount
  } = useFileGallery(2);

  const selectedType = watch('entityType');
  const selectedId = watch('entityId');

  const entityOptions = useMemo(() => {
    if (!selectedType) return [];

    // Safety check: if user somehow selected a type they don't have access to (e.g. via old state), return empty
    if (!allowedTypes.includes(selectedType)) return [];

    const dataMap: Record<string, any[]> = { party: parties, prospect: prospects, site: sites };
    const list = dataMap[selectedType] || [];

    return list.map(item => ({
      id: item.id || item._id,
      label: item[ENTITY_CONFIG[selectedType]?.nameField] ||
        item.name ||
        item.companyName ||
        item.prospect_name ||
        item.site_name ||
        'Unknown Entity'
    }));
  }, [selectedType, parties, prospects, sites, allowedTypes]); // Added allowedTypes dependency

  const handleActualSubmit = (data: NoteFormData) => {
    const request: any = {
      title: data.title,
      description: data.description,
      existingImages: existingImages // Pass the kept remote images for backend syncing
    };

    if (data.entityType && ENTITY_CONFIG[data.entityType]) {
      const config = ENTITY_CONFIG[data.entityType];
      request[config.key] = data.entityId;
    }

    // Pass the mapped request and the new local binary files
    onSave(request, newFiles);
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const type = initialData.partyId ? 'party' : initialData.prospectId ? 'prospect' : initialData.siteId ? 'site' : undefined;
        reset({
          title: initialData.title,
          description: initialData.description,
          entityType: type as any,
          entityId: initialData.partyId || initialData.prospectId || initialData.siteId || '',
          newImages: []
        });

        if (initialData.images) {
          setInitialImages(initialData.images);
        }
      } else {
        reset({ title: '', description: '', entityType: undefined, entityId: '', newImages: [] });
        setInitialImages([]);
      }
    }
  }, [isOpen, initialData, reset, setInitialImages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-5 border-b flex justify-between items-center sticky top-0 bg-white z-50">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {initialData ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleActualSubmit)} className="overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider">Title *</label>
            <input {...register('title')} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary font-medium transition-all" placeholder="Note Title" />
            {errors.title && <p className="text-red-500 text-sm mt-1 font-bold ml-1">{errors.title.message}</p>}
          </div>

          <Controller name="entityType" control={control} render={({ field }) => (
            <EntityTypeSelector
              value={field.value}
              onChange={(val) => { field.onChange(val); setValue('entityId', ''); }}
              error={errors.entityType?.message}
              allowedTypes={allowedTypes} // Pass permissions
            />
          )} />

          {selectedType && (
            <SearchableSelect
              label={`Linked ${ENTITY_CONFIG[selectedType].label} *`}
              placeholder={`Search ${selectedType}...`}
              selectedId={selectedId}
              value={entityOptions.find(o => o.id === selectedId)?.label || ''}
              options={entityOptions}
              onSelect={(opt) => setValue('entityId', opt.id, { shouldValidate: true })}
            />
          )}

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider">Description *</label>
            <textarea {...register('description')} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none shadow-sm resize-none focus:ring-2 focus:ring-secondary font-medium transition-all" placeholder="Provide context..." />
            {errors.description && <p className="text-red-500 text-sm mt-1 font-bold ml-1">{errors.description.message}</p>}
          </div>

          <div className="space-y-4">
            <ImageUploadSection
              onFilesAdded={addFiles}
              maxFiles={2}
              totalCount={totalCount}
            />

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Existing Images (Remote) */}
              {existingImages.map((img: any, i: number) => (
                <div key={img._id || i} className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-gray-50 border shadow-sm group/img">
                  <img src={img.imageUrl || img.url || img} className="w-full h-full object-cover" alt="Saved" />
                  <div className="absolute top-1 left-1 bg-green-500 text-[8px] text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Cloud size={8} /> SAVED
                  </div>
                  <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow-lg opacity-100 sm:opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ))}

              {/* New Previews (Local) */}
              {previews.map((url: string, i: number) => (
                <div key={url} className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-blue-50 border border-blue-100 shadow-sm group/img">
                  <img src={url} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute top-1 left-1 bg-blue-500 text-[8px] text-white px-1.5 py-0.5 rounded-full font-bold">NEW</div>
                  <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow-lg opacity-100 sm:opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3 sticky bottom-0 bg-white border-t mt-auto">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1 font-bold text-gray-400">Cancel</Button>
            <Button type="submit" disabled={isSaving} className="flex-1 font-bold shadow-lg shadow-blue-200">
              {isSaving ? <Loader2 size={18} className="animate-spin mx-auto" /> : initialData ? 'Save Changes' : 'Create Note'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NoteFormModal;