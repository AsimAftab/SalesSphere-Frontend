import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import type { Note, CreateNoteRequest } from '../../../../api/notesService';
import { noteSchema, ENTITY_TYPES, type NoteFormData } from '../NoteFormSchema';
import { useFileGallery } from '../useFileGallery';
import { ENTITY_TYPE_CONFIG } from '../common/NoteConstants';
import type { PartyEntity, ProspectEntity, SiteEntity, ExistingImage, LinkableEntity } from '../common/NoteEntityTypes';

/**
 * Props for the useNoteEntity hook
 */
export interface UseNoteEntityProps {
    /** Whether the modal is currently open */
    isOpen: boolean;
    /** Existing note data for edit mode, null for create mode */
    initialData?: Note | null;
    /** List of available parties to link notes to */
    parties: PartyEntity[];
    /** List of available prospects to link notes to */
    prospects: ProspectEntity[];
    /** List of available sites to link notes to */
    sites: SiteEntity[];
    /** Entity types the user has permission to access */
    allowedTypes: string[];
    /** Callback to save the note with form data and files */
    onSave: (formData: CreateNoteRequest & { existingImages: ExistingImage[] }, files: File[]) => Promise<void>;
}

/**
 * Custom hook for managing note entity form state.
 * Handles form validation, file gallery, and entity selection logic.
 * Implements the Container-Hook-Form pattern for separation of concerns.
 * 
 * @param props - Hook configuration options
 * @returns Form controls, file gallery state, and entity selection data
 */

export const useNoteEntity = ({
    isOpen,
    initialData,
    parties,
    prospects,
    sites,
    allowedTypes,
    onSave
}: UseNoteEntityProps) => {
    // 1. Form Setup
    const form = useForm<NoteFormData>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: '',
            description: '',
            entityId: '',
            newImages: []
        }
    });

    const { register, control, reset, setValue, watch, formState: { errors }, handleSubmit: formHandleSubmit } = form;

    // 2. File Gallery
    const {
        newFiles,
        newPreviews: previews,
        existingImages,
        addFiles,
        removeNewFile: removeFile,
        removeExistingImage,
        setInitialImages,
        totalCount
    } = useFileGallery(2);

    // 3. Entity Selection
    const selectedType = watch('entityType');

    // 4. Entity Options
    const entityOptions = useMemo(() => {
        if (!selectedType) return [];

        // Safety check: if user somehow selected a type they don't have access to
        if (!allowedTypes.includes(selectedType)) return [];

        const dataMap: Record<string, LinkableEntity[]> = {
            party: parties,
            prospect: prospects,
            site: sites
        };
        const list = dataMap[selectedType] || [];

        return list.map(item => ({
            id: item.id || item._id,
            label: item[ENTITY_TYPE_CONFIG[selectedType]?.nameField] ||
                item.name ||
                item.companyName ||
                item.prospect_name ||
                item.site_name ||
                'Unknown Entity'
        }));
    }, [selectedType, parties, prospects, sites, allowedTypes]);

    // 5. Form Reset Effect
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const type = initialData.partyId ? 'party'
                    : initialData.prospectId ? 'prospect'
                        : initialData.siteId ? 'site'
                            : undefined;

                reset({
                    title: initialData.title,
                    description: initialData.description,
                    entityType: type as typeof ENTITY_TYPES[number] | undefined,
                    entityId: initialData.partyId || initialData.prospectId || initialData.siteId || '',
                    newImages: []
                });

                if (initialData.images) {
                    setInitialImages(initialData.images);
                }
            } else {
                reset({
                    title: '',
                    description: '',
                    entityType: undefined,
                    entityId: '',
                    newImages: []
                });
                setInitialImages([]);
            }
        }
    }, [isOpen, initialData, reset, setInitialImages]);

    // 6. Submit Handler
    const handleSubmit = async (data: NoteFormData) => {
        const request: CreateNoteRequest & { existingImages: ExistingImage[] } = {
            title: data.title,
            description: data.description,
            existingImages: existingImages
        };

        if (data.entityType && ENTITY_TYPE_CONFIG[data.entityType]) {
            const config = ENTITY_TYPE_CONFIG[data.entityType];
            (request as Record<string, unknown>)[config.key] = data.entityId;
        }

        await onSave(request, newFiles);
    };

    return {
        // Form
        register,
        control,
        setValue,
        errors,
        handleSubmit: formHandleSubmit(handleSubmit),

        // File Gallery
        fileGallery: {
            newFiles,
            previews,
            existingImages,
            addFiles,
            removeFile,
            removeExistingImage,
            totalCount
        },

        // Entity Selection
        entitySelection: {
            selectedType,
            entityOptions
        }
    };
};
