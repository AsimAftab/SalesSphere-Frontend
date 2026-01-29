import { useRef } from 'react'; // Added useRef
import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { UploadCloud, X } from 'lucide-react'; // Added icons
import Button from '../../../UI/Button/Button'; // Added Button
import type { NoteFormData } from '../NoteFormSchema';
import { EntityTypeSelector } from '../EntityTypeSelector';
// Removed ImageUploadSection, ExistingImagePreview, NewImagePreview imports
import DropDown from '../../../UI/DropDown/DropDown';
import { ENTITY_TYPE_CONFIG } from '../common/NoteConstants';

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            fileGallery.addFiles(Array.from(e.target.files));
        }
        e.target.value = ''; // Reset
    };

    return (
        <div className="space-y-6">
            {/* Title Field */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('title')}
                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 font-medium transition-all ${errors.title
                        ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                        : 'border-gray-300 focus:ring-secondary focus:border-secondary'
                        }`}
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
                    className={`w-full px-4 py-3 border rounded-xl outline-none shadow-sm resize-none focus:ring-2 font-medium transition-all ${errors.description
                        ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                        : 'border-gray-300 focus:ring-secondary focus:border-secondary'
                        }`}
                    placeholder="Enter note description"
                    aria-label="Note description"
                    aria-required="true"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Image Gallery - Hidden in Edit Mode */}
            {/* Image Gallery - Matches Employee Form Style */}
            {!isEditMode && (
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">
                            Images <span className="text-gray-400 text-sm font-normal">(Optional - Max 2)</span>
                        </label>

                        {fileGallery.totalCount < 2 ? (
                            <>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 py-2 h-9 text-xs"
                                >
                                    <UploadCloud size={14} className="text-indigo-600" />
                                    Upload
                                </Button>
                            </>
                        ) : (
                            <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-blue-700 font-medium">Limit reached (2/2)</span>
                            </div>
                        )}
                    </div>

                    {/* File Gallery Grid */}
                    {(fileGallery.existingImages.length > 0 || fileGallery.previews.length > 0) && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                            {/* Existing Images */}
                            {fileGallery.existingImages.map((img, idx) => (
                                <div key={`existing-${idx}`} className="group relative aspect-square w-24 h-24">
                                    <div className="w-full h-full rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
                                        <img src={img.url} alt="Existing" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileGallery.removeExistingImage(idx)}
                                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                    >
                                        <X size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}

                            {/* New Previews */}
                            {fileGallery.previews.map((previewUrl, idx) => (
                                <div key={`new-${idx}`} className="group relative aspect-square w-24 h-24">
                                    <div className="w-full h-full rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
                                        <img src={previewUrl} alt="New" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -top-2 -left-2 bg-blue-500/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-sm ring-2 ring-white">
                                        NEW
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileGallery.removeFile(idx)}
                                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                                    >
                                        <X size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
