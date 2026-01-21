import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import type { Note } from '../../../../api/notesService';
import { noteSchema, type NoteFormData } from '../NoteFormSchema';
import { useFileGallery } from '../useFileGallery';
import { ENTITY_TYPE_CONFIG } from '../common/NoteConstants';

export interface UseNoteEntityProps {
    isOpen: boolean;
    initialData?: Note | null;
    parties: any[];
    prospects: any[];
    sites: any[];
    allowedTypes: string[];
    onSave: (formData: any, files: File[]) => Promise<void>;
}

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

        const dataMap: Record<string, any[]> = {
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
                    entityType: type as any,
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
        const request: any = {
            title: data.title,
            description: data.description,
            existingImages: existingImages
        };

        if (data.entityType && ENTITY_TYPE_CONFIG[data.entityType]) {
            const config = ENTITY_TYPE_CONFIG[data.entityType];
            request[config.key] = data.entityId;
        }

        // Pass the mapped request and the new local binary files
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
