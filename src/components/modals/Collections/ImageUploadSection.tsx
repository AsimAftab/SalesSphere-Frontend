import React, { useRef } from 'react';
import { UploadCloud, X, Cloud } from 'lucide-react';
import { getSafeImageUrl } from '../../../utils/security';
import Button from '../../UI/Button/Button';

/**
 * Interface representing images already stored on the server.
 */
export interface ExistingImage {
    imageUrl?: string;
    url?: string;
    publicId?: string;
    _id?: string;
}

/**
 * COMPONENT: ImageUploadSection
 * Handles the logic for selecting local files and displaying the upload UI.
 * Matches the Employee/Expense form design.
 */
interface ImageUploadSectionProps {
    totalCount: number;
    onFilesAdded: (e: React.ChangeEvent<HTMLInputElement>) => void;
    maxFiles: number;
    error?: string;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
    totalCount,
    onFilesAdded,
    maxFiles,
    error
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isLimitReached = totalCount >= maxFiles;

    return (
        <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                    Images <span className="text-gray-400 text-sm font-normal">(Optional - Max {maxFiles})</span>
                </label>

                {!isLimitReached ? (
                    <>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={onFilesAdded}
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
                        <span className="text-xs text-blue-700 font-medium">Limit reached ({maxFiles}/{maxFiles})</span>
                    </div>
                )}
            </div>

            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
};

/**
 * COMPONENT: ImagePreviewGallery
 * Displays a grid of both existing remote images and new local previews.
 * Matches the Employee/Expense form design.
 */
interface PreviewGalleryProps {
    existingImages: ExistingImage[];
    newPreviews: string[];
    onRemoveExisting: (index: number) => void;
    onRemoveNew: (index: number) => void;
}

export const ImagePreviewGallery: React.FC<PreviewGalleryProps> = ({
    existingImages,
    newPreviews,
    onRemoveExisting,
    onRemoveNew
}) => {
    if (existingImages.length === 0 && newPreviews.length === 0) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {/* 1. Remote Images (Saved in Database) */}
            {existingImages.map((img, i) => (
                <div key={img._id || `existing-${i}`} className="group relative aspect-square w-24 h-24">
                    <div className="w-full h-full rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
                        <img
                            src={img.imageUrl || img.url || ''}
                            className="w-full h-full object-cover"
                            alt="Saved"
                        />
                    </div>
                    <div className="absolute -top-2 -left-2 bg-green-500/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-bold shadow-sm ring-2 ring-white">
                        <Cloud size={10} /> Saved
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemoveExisting(i)}
                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
            ))}

            {/* 2. Local Previews (Newly Picked Files) */}
            {newPreviews.map((url, i) => (
                <div key={url} className="group relative aspect-square w-24 h-24">
                    <div className="w-full h-full rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
                        <img
                            src={getSafeImageUrl(url) || ''}
                            className="w-full h-full object-cover"
                            alt="Pending upload"
                        />
                    </div>
                    <div className="absolute -top-2 -left-2 bg-blue-500/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-sm ring-2 ring-white">
                        NEW
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemoveNew(i)}
                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
            ))}
        </div>
    );
};
