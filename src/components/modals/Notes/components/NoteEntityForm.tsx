import React from 'react';
import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { NoteFormData } from '../NoteFormSchema';
import { EntityTypeSelector } from '../EntityTypeSelector';
import { ImageUploadSection } from '../ImageUploadSection';
import DropDown from '../../../UI/DropDown/DropDown';
import { ENTITY_TYPE_CONFIG } from '../common/NoteConstants';
import { ExistingImagePreview } from './ExistingImagePreview';
import { NewImagePreview } from './NewImagePreview';

interface FileGalleryProps {
    previews: string[];
    existingImages: any[];
    addFiles: (files: File[]) => void;
    removeFile: (index: number) => void;
    removeExistingImage: (index: number) => void;
    totalCount: number;
}

interface EntitySelectionProps {
    selectedType?: string;
    entityOptions: { id: string; label: string }[];
}

interface NoteEntityFormProps {
    register: UseFormReturn<NoteFormData>['register'];
    control: UseFormReturn<NoteFormData>['control'];
    setValue: UseFormReturn<NoteFormData>['setValue'];
    errors: UseFormReturn<NoteFormData>['formState']['errors'];
    fileGallery: FileGalleryProps;
    entitySelection: EntitySelectionProps;
    allowedTypes: string[];
    isEditMode?: boolean;
}

export const NoteEntityForm: React.FC<NoteEntityFormProps> = ({
    register,
    control,
    setValue,
    errors,
    fileGallery,
    entitySelection,
    allowedTypes,
    isEditMode
}) => {
    const { selectedType, entityOptions } = entitySelection;

    return (
        <div className="space-y-6">
            {/* Title Field */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('title')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary font-medium transition-all"
                    placeholder="Enter note title"
                    aria-label="Note title"
                    aria-required="true"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Entity Type Selector */}
            <Controller
                name="entityType"
                control={control}
                render={({ field }) => (
                    <EntityTypeSelector
                        value={field.value}
                        onChange={(val) => {
                            field.onChange(val);
                            setValue('entityId', '');
                        }}
                        error={errors.entityType?.message}
                        allowedTypes={allowedTypes}
                    />
                )}
            />

            {/* Entity Dropdown */}
            {selectedType && (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Linked {ENTITY_TYPE_CONFIG[selectedType as keyof typeof ENTITY_TYPE_CONFIG].label} <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        control={control}
                        name="entityId"
                        render={({ field }) => (
                            <DropDown
                                value={field.value}
                                onChange={field.onChange}
                                options={entityOptions.map(opt => ({ value: opt.id, label: opt.label }))}
                                placeholder={`Select ${ENTITY_TYPE_CONFIG[selectedType as keyof typeof ENTITY_TYPE_CONFIG].label}`}
                                error={errors.entityId?.message}
                                isSearchable={true}
                            />
                        )}
                    />
                    {errors.entityId && <p className="text-red-500 text-xs mt-1">{errors.entityId.message}</p>}
                </div>
            )}

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none shadow-sm resize-none focus:ring-2 focus:ring-secondary focus:border-secondary font-medium transition-all"
                    placeholder="Enter note description"
                    aria-label="Note description"
                    aria-required="true"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Image Gallery - Hidden in Edit Mode */}
            {!isEditMode && (
                <div className="space-y-4">
                    <ImageUploadSection
                        onFilesAdded={fileGallery.addFiles}
                        maxFiles={2}
                        totalCount={fileGallery.totalCount}
                    />

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Note images">
                        <ExistingImagePreview
                            images={fileGallery.existingImages}
                            onRemove={fileGallery.removeExistingImage}
                        />
                        <NewImagePreview
                            previews={fileGallery.previews}
                            onRemove={fileGallery.removeFile}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
