// src/pages/Entities/Shared/components/Details/DetailsMainCard.tsx
import React, { useRef } from 'react';
import { CameraIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

interface DetailsMainCardProps {
  title: string;
  address: string;
  image?: string | null;
  isUploading: boolean;
  isDeleting?: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
  onPreview: () => void;
  googleMapsUrl: string;
  hasCoordinates: boolean;
}

export const DetailsMainCard: React.FC<DetailsMainCardProps> = ({
  title, 
  address, 
  image, 
  isUploading, 
  isDeleting,
  onUpload, 
  onDelete,
  onPreview, 
  googleMapsUrl, 
  hasCoordinates
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-4">
      <div className="flex items-start gap-6">
        
        {/* --- IMAGE SECTION --- */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-gray-100 group shrink-0">
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : image ? (
            <div className="relative w-full h-full">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={onPreview}
                title="Click to view full image"
              />
              {/* Delete Overlay - visible on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                disabled={isDeleting}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:bg-gray-400"
              >
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrashIcon className="w-3 h-3" />}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors group/btn"
            >
              <CameraIcon className="w-8 h-8 mb-1 group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Upload</span>
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/png, image/jpeg, image/webp" 
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} 
          />
        </div>
        {/* --- END IMAGE SECTION --- */}

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {hasCoordinates ? (
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm hover:underline">{address}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};