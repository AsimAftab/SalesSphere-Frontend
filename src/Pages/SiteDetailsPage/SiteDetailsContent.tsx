// In src/pages/SiteDetails/SiteDetailsContent.tsx

import React, { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { Loader2 } from 'lucide-react';
import { LocationMap } from '../../components/maps/LocationMap';
import {
  type ApiSite,
  type ApiSiteImage,
} from '../../api/siteService';
import Button from '../../components/UI/Button/Button';
import toast from 'react-hot-toast'; // We will use this

import ImagePreviewModal from '../../components/modals/ImagePreviewModal';

// --- PROPS INTERFACE ---
interface SiteDetailsContentProps {
  site: ApiSite | null;
  contact: { phone: string; email: string } | null;
  location: { address: string; latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
  isMutating: boolean;
  isUploading: boolean;
  isDeletingImage: boolean;
  images: ApiSiteImage[];
  onDataRefresh: () => void;
  onOpenEditModal: () => void;
  onDeleteRequest: () => void;
  onImageUpload: (imageNumber: number, file: File) => void;
  onImageDelete: (imageNumber: number) => void;
}

// ... (StaticMapViewer and ImageThumbnail components are unchanged) ...
interface StaticMapViewerProps {
  latitude: number;
  longitude: number;
}
const StaticMapViewer: React.FC<StaticMapViewerProps> = ({
  latitude,
  longitude,
}) => {
  const dummyHandler = () => {};
  return (
    <LocationMap
      isViewerMode={true}
      position={{ lat: latitude, lng: longitude }}
      onLocationChange={dummyHandler}
      onAddressGeocoded={dummyHandler}
    />
  );
};

interface ImageThumbnailProps {
  image: ApiSiteImage;
  onDelete: (imageNumber: number) => void;
  onPreview: () => void;
  isDeleting: boolean;
}
const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  image,
  onDelete,
  onPreview,
  isDeleting,
}) => {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden group">
      <img
        src={image.imageUrl}
        alt={`Site ${image.imageNumber}`}
        className="w-full h-full object-cover cursor-pointer"
        onClick={onPreview}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
      <button
        onClick={onPreview}
        className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Preview image"
      >
        <PhotoIcon className="w-8 h-8" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(image.imageNumber);
        }}
        disabled={isDeleting}
        className="absolute top-1 right-1 p-1.5 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:animate-spin"
        aria-label="Delete image"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <TrashIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};


// --- MAIN CONTENT COMPONENT ---
const SiteDetailsContent: React.FC<SiteDetailsContentProps> = ({
  site,
  contact,
  location,
  loading,
  error,
  isUploading,
  isDeletingImage,
  images,
  onOpenEditModal,
  onDeleteRequest,
  onImageUpload,
  onImageDelete,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => a.imageNumber - b.imageNumber);
  }, [images]);

  const nextAvailableImageNumber = useMemo(() => {
    const existingNumbers = new Set(sortedImages.map(img => img.imageNumber));
    for (let i = 1; i <= 9; i++) {
      if (!existingNumbers.has(i)) {
        return i;
      }
    }
    return null; // All 9 slots are full
  }, [sortedImages]);
  
  const modalImages = useMemo(() => {
    return sortedImages.map((img) => ({
      url: img.imageUrl,
      description: `Site Image ${img.imageNumber}`,
      imageNumber: img.imageNumber,
    }));
  }, [sortedImages]);

  // --- Loading, Error, and Data Guard Clauses ---
  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Loading Site Details...</span>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  if (!site || !contact || !location) {
    return (
      <div className="text-center p-10 text-gray-500">
        Site data not found.
      </div>
    );
  }

  // --- Helper Functions ---
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const googleMapsUrl =
    location.latitude && location.longitude
      ? `http://googleusercontent.com/maps/google.com/1{location.latitude},${location.longitude}`
      : '#';

  // --- Click Handlers ---
  const handlePreviewClick = (imageNumber: number) => {
    const index = sortedImages.findIndex(
      (img) => img.imageNumber === imageNumber
    );
    if (index > -1) {
      setCurrentImageIndex(index);
      setIsPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File is too large. Max 5MB.');
        return;
      }
      if (nextAvailableImageNumber !== null) {
        onImageUpload(nextAvailableImageNumber, file);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- THIS IS THE UPDATED HANDLER ---
  const handleUploadButtonClick = () => {
    // 1. Check if an upload is already in progress
    if (isUploading) {
      return; // Do nothing
    }

    // 2. Check if the image limit is reached
    if (nextAvailableImageNumber === null) {
      toast.error("Image limit reached. Cannot upload more than 9 images.");
      return;
    }

    // 3. If all checks pass, open the file dialog
    fileInputRef.current?.click();
  };

  // --- JSX Return ---
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/sites"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to Sites"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">
              Site Details
            </h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <Button
            variant="primary"
            onClick={onOpenEditModal}
            className="w-full"
          >
            Edit Site
          </Button>
          <Button
            variant="outline"
            onClick={onDeleteRequest}
            className="text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500 w-full"
          >
            Delete Site
          </Button>
        </div>
      </div>

      {/* --- Main Grid (Cards and Map) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Site Details */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {/* ... (Site Card and Site Info Card are unchanged) ... */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BuildingStorefrontIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {site.siteName}
                </h2>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm hover:underline">
                    {location.address}
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
              Site Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
               <div className="flex items-start gap-2">
                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Owner Name
                  </span>
                  <span className="text-gray-800">
                    {site.ownerName || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Date Joined
                  </span>
                  <span className="text-gray-800">
                    {formatDate(site.dateJoined)}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Phone
                  </span>
                  <span className="text-gray-800">
                    {contact.phone || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Email
                  </span>
                  <span className="text-gray-800 break-all">
                    {contact.email || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2 flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Full Address
                  </span>
                  <span className="text-gray-800">{location.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Latitude
                  </span>
                  <span className="text-gray-800">
                    {location.latitude?.toFixed(6) ?? 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Longitude
                  </span>
                  <span className="text-gray-800">
                    {location.longitude?.toFixed(6) ?? 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                Description
              </h4>
              <p className="text-sm text-gray-600">
                {site.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* ... (Map Card is unchanged) ... */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-4 h-4 text-blue-600" />
              </div>
              Location Map
            </h3>
          </div>

          <div
            className="flex-1 relative z-0"
            style={{ minHeight: '400px' }}
          >
            <StaticMapViewer
              latitude={location.latitude}
              longitude={location.longitude}
            />
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button variant="secondary" className="w-full justify-center">
                <MapPinIcon className="w-4 h-4 mr-2" />
                View on Google Maps
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* --- Row 3: Site Image Card (UPDATED) --- */}
      <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <PhotoIcon className="w-4 h-4 text-blue-600" />
            </div>
            Site Images ({sortedImages.length} / 9)
          </h3>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
          
          {/* --- THIS IS THE UPDATED BUTTON --- */}
          <Button
            variant="secondary"
            onClick={handleUploadButtonClick}
            // The 'disabled' prop is REMOVED
            // We apply disabled styles manually so the button is still clickable
            className={`w-full sm:w-auto ${
              (nextAvailableImageNumber === null || isUploading) 
                ? 'opacity-50 cursor-not-allowed' // Visually disable
                : ''
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
            )}
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {/* --- END OF UPDATED BUTTON --- */}

        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
          {sortedImages.map((image) => (
            <ImageThumbnail
              key={image.imageNumber}
              image={image}
              isDeleting={isDeletingImage}
              onDelete={onImageDelete}
              onPreview={() => handlePreviewClick(image.imageNumber)}
            />
          ))}
        </div>

        {sortedImages.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No images have been uploaded for this site.
          </div>
        )}
      </div>

      {/* --- Image Preview Modal --- */}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        images={modalImages}
        initialIndex={currentImageIndex}
        onDeleteImage={onImageDelete}
        isDeletingImage={isDeletingImage}
      />
    </div>
  );
};

export default SiteDetailsContent;