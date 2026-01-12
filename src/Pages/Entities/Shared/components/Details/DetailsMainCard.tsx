import React, { useRef } from 'react';
import { CameraIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

interface DetailsMainCardProps {
  title: string;
  address: string;
  // Optional image-related props
  image?: string | null;
  isUploading?: boolean;
  isDeleting?: boolean;
  onUpload?: (file: File) => void;
  onDelete?: () => void;
  onPreview?: () => void;
  // Location props
  googleMapsUrl?: string;
  hasCoordinates?: boolean;
  // Optional: Allow passing a default icon if no image logic is needed
  icon?: React.ReactNode;
}

export const DetailsMainCard: React.FC<DetailsMainCardProps> = ({
  title,
  address,
  image,
  isUploading = false,
  isDeleting = false,
  onUpload,
  onDelete,
  onPreview,
  googleMapsUrl = "#",
  hasCoordinates = false,
  icon
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // We show the image section ONLY if onUpload is provided OR an image/icon exists
  const showImageSection = !!(onUpload || image || icon);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-4">
      <div className="flex items-start gap-6">

        {/* --- OPTIONAL IMAGE/ICON SECTION --- */}
        {showImageSection && (
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-sm border border-gray-100 group shrink-0">
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
                />
                {onDelete && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    disabled={isDeleting}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:bg-gray-400"
                  >
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrashIcon className="w-3 h-3" />}
                  </button>
                )}
              </div>
            ) : icon ? (
              /* Display a static icon if provided (like a Building icon) */
              <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white">
                {icon}
              </div>
            ) : onUpload ? (
              /* Display Upload placeholder only if upload function exists */
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors group/btn"
              >
                <CameraIcon className="w-8 h-8 mb-1 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Upload</span>
              </button>
            ) : null}

            {onUpload && (
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              />
            )}
          </div>
        )}

        {/* --- TEXT SECTION --- */}
        <div className="flex-1 min-w-0 py-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate">
            {title}
          </h2>

          {hasCoordinates ? (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <MapPinIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm hover:underline line-clamp-2">{address}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="w-4 h-4 shrink-0" />
              <span className="text-sm line-clamp-2">{address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};