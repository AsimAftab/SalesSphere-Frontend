import React from 'react';
import { ImagePlus, X, Cloud } from 'lucide-react';

/**
 * Interface representing images already stored on the server.
 */
export interface ExistingImage {
  imageUrl: string;
  publicId?: string;
  _id?: string;
}

/**
 * COMPONENT: ImageUploadSection
 * Handles the logic for selecting local files and displaying the upload UI.
 */
interface ImageUploadSectionProps {
  totalCount: number;
  onFilesAdded: (files: File[]) => void;
  maxFiles: number;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  totalCount,
  onFilesAdded,
  maxFiles
}) => {
  const isLimitReached = totalCount >= maxFiles;
  const remainingSlots = maxFiles - totalCount;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Images <span className="text-gray-400 text-sm font-normal">(Optional - Max {maxFiles})</span>
      </label>

      {!isLimitReached && (
        <div
          className="relative border-2 border-dashed rounded-xl transition-all duration-200 border-gray-300 bg-white hover:bg-blue-50/30 hover:border-blue-400 cursor-pointer"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              onFilesAdded(files);
              e.target.value = '';
            }}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            aria-label="Upload images"
          />

          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-3 p-3 rounded-full transition-colors bg-blue-50">
              <ImagePlus
                className="transition-colors text-blue-500"
                size={32}
              />
            </div>

            <p className="text-sm font-semibold mb-1 transition-colors text-gray-700">
              Click or drag to upload images
            </p>

            <p className="text-xs transition-colors text-gray-500">
              {`${remainingSlots} ${remainingSlots === 1 ? 'slot' : 'slots'} available`}
            </p>
          </div>
        </div>
      )}

      {isLimitReached && (
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700 font-semibold text-center">
            Image limit reached ({maxFiles}/{maxFiles}) — Remove an image to add more
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * COMPONENT: ImagePreviewGallery
 * Displays a grid of both existing remote images and new local previews.
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      {/* 1. Remote Images (Saved in Database) */}
      {existingImages.map((img, i) => (
        <div key={img._id || `existing-${i}`} className="group relative aspect-square">
          <img
            src={img.imageUrl}
            className="w-full h-full object-cover rounded-2xl border-2 border-gray-100 shadow-sm"
            alt="Saved"
          />
          <div className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
            <Cloud size={10} /> Saved
          </div>
          <button
            type="button"
            onClick={() => onRemoveExisting(i)}
            className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>
      ))}

      {/* 2. Local Previews (Newly Picked Files) */}
      {newPreviews.map((url, i) => (
        <div key={url} className="group relative aspect-square">
          <img
            src={url}
            className="w-full h-full object-cover rounded-2xl border-2 border-blue-200 shadow-sm"
            alt="Pending upload"
          />
          <div className="absolute top-2 left-2 bg-blue-500/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
            New
          </div>
          <button
            type="button"
            onClick={() => onRemoveNew(i)}
            className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 shadow-lg border border-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>
      ))}
    </div>
  );
};