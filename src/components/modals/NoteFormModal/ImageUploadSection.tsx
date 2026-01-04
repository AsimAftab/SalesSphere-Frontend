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

  return (
    <div className="space-y-3">
      <label className="text-sm font-black text-gray-500 tracking-widest ml-1 uppercase">
        Media Gallery
      </label>
      
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all relative
          ${isLimitReached 
            ? 'border-gray-100 bg-gray-50/50 cursor-not-allowed' 
            : 'border-gray-200 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-400 cursor-pointer'
          }`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          disabled={isLimitReached}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            onFilesAdded(files);
            // Reset input so picking the exact same file again triggers onChange
            e.target.value = '';
          }}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
        />
        
        <ImagePlus 
          className={`mb-2 transition-colors ${isLimitReached ? 'text-gray-200' : 'text-gray-400'}`} 
          size={40} 
        />
        
        <p className={`text-sm font-bold transition-colors ${isLimitReached ? 'text-gray-300' : 'text-gray-500'}`}>
          {isLimitReached 
            ? `Limit reached (${totalCount}/${maxFiles})` 
            : `Add images (${totalCount}/${maxFiles})`
          }
        </p>
      </div>
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