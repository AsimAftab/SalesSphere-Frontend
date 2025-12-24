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
  TagIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; 
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import { LocationMap } from '../../components/maps/LocationMap';
import {
  type ApiSite,
  type ApiSiteImage,
} from '../../api/siteService';
import Button from '../../components/UI/Button/Button';
import toast from 'react-hot-toast';

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

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// --- Skeleton Component ---
const SiteDetailsSkeleton: React.FC = () => {
  return (
    <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
      <div className="relative">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={180} height={32} />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <Skeleton width={120} height={40} borderRadius={8} />
            <Skeleton width={130} height={40} borderRadius={8} />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            {/* Main Card Skeleton */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <div className="flex items-start gap-6">
                <Skeleton width={80} height={80} borderRadius={12} />
                <div className="flex-1 pt-2">
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="90%" height={20} className="mt-2" />
                </div>
              </div>
            </div>

            {/* Info Card Skeleton */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Skeleton circle width={32} height={32} />
                <Skeleton width={200} height={24} />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="70%" height={20} className="mt-1" />
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Skeleton width={100} height={20} className="mb-2" />
                <Skeleton count={2} height={16} />
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Skeleton circle width={32} height={32} />
                <Skeleton width={150} height={24} />
              </h3>
            </div>
            <div className="flex-1 relative z-0" style={{ minHeight: '400px' }}>
              <Skeleton height={400} />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Skeleton height={40} borderRadius={8} />
            </div>
          </div>
        </div>

        {/* Image Card Skeleton */}
        <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Skeleton circle width={32} height={32} />
              <Skeleton width={160} height={24} />
            </h3>
            <Skeleton width={160} height={40} borderRadius={8} />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i}
                className="aspect-square"
                borderRadius={8}
              />
            ))}
          </div>
        </div>

      </div>
    </SkeletonTheme>
  );
};

// --- MAIN CONTENT COMPONENT ---
const SiteDetailsContent: React.FC<SiteDetailsContentProps> = ({
  site,
  contact,
  location,
  loading,
  error,
  isMutating, 
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
    return null; 
  }, [sortedImages]);

  const modalImages = useMemo(() => {
    return sortedImages.map((img) => ({
      url: img.imageUrl,
      description: `Site Image ${img.imageNumber}`,
      imageNumber: img.imageNumber,
    }));
  }, [sortedImages]);

  // --- Use Skeleton on initial load ---
  if (loading && (!site || !contact || !location)) {
    return <SiteDetailsSkeleton />;
  }

  // --- Use standard error block ---
  if (error && (!site || !contact || !location)) {
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  // --- Data Guard Clause ---
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

   const googleMapsUrl = location?.latitude && location?.longitude ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}` : '#';

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
      if (file.size > 5 * 1024 * 1024) { 
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

  

  const handleUploadButtonClick = () => {
    if (isUploading) {
      return;
    }
    if (nextAvailableImageNumber === null) {
      toast.error("Image limit reached. Cannot upload more than 9 images.");
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    // --- Added motion wrapper ---
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* --- Overlays (Refresh, Error, Mutating) --- */}
      {loading && site && (
        <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>
      )}
      {error && site && (
        <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
      {isMutating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">Saving...</span>
          </div>
        </div>
      )}

      {/* --- Added motion wrapper to Header --- */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
      >
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
      </motion.div>

      {/* --- Added motion wrapper to Main Grid --- */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column: Site Details */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {/* Site Card */}
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
          {/* Site Info Card */}
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
              <div className="flex items-start gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Created By
                  </span>
                  <span className="text-gray-800 break-all">
                    {contact.email || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-500 block">
                    Sub-Organization Name
                  </span>
                  <span className="text-gray-800 break-all">
                    { site.subOrganization|| 'N/A'}
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

        {/* Map Card */}
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
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 overflow-hidden">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
              <TagIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                Site Interest Categories
              </h3>
              <p className="text-sm text-gray-500 hidden sm:block">
                Categories and brands the site is associated with.
              </p>
            </div>
          </div>
          <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-full border border-gray-200">
            {site.siteInterest?.length || 0} Categories
          </span>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
            {site.siteInterest && site.siteInterest.length > 0 ? (
            site.siteInterest.map((item, index) => (
                <motion.div 
                    key={index} 
                    whileHover={{ y: -2 }}
                    className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-secondary transition-all duration-200 h-full group"
                >
                    {/* Category Header with Accent */}
                    <div className="p-4 border-b border-400 bg-gray-50/50 rounded-t-xl">
                        <div className="flex items-center gap-2.5">
                            <h4 className="font-semibold text-gray-900 text-sm truncate leading-snug" title={item.category}>
                                {item.category}
                            </h4>
                        </div>
                    </div>

                    {/* Brands Body */}
                    <div className="p-4 flex-1 flex flex-col">
                        <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Brands Used</p>
                        <div className="flex flex-wrap gap-2 content-start">
                            {item.brands && item.brands.length > 0 ? (
                            item.brands.map((brand, bIndex) => (
                                <span 
                                    key={bIndex} 
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-secondary border border-blue-100 hover:bg-blue-100 transition-colors duration-150 cursor-default"
                                >
                                    {brand}
                                </span>
                            ))
                            ) : (
                            <span className="text-sm text-gray-400 italic flex items-center gap-1">No brands specified</span>
                            )}
                        </div>
                        
                        {/* ✅ NEW: Display Technicians for the Site Interest (If available) */}
                        {item.technicians && item.technicians.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                                <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">Technicians</p>
                                <div className="space-y-1">
                                    {item.technicians.map((tech, tIndex) => (
                                        <div key={tIndex} className="flex items-center text-xs text-gray-700 bg-gray-100 p-1 rounded">
                                            <BriefcaseIcon className="w-4 h-4 mr-2 text-secondary flex-shrink-0" />
                                            <span className="truncate" title={tech.name}>{tech.name}</span>
                                            <span className="ml-auto text-gray-500 flex-shrink-0">({tech.phone})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))
            ) : (
            
            <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <TagIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-900">No Interests Found</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">This site hasn't defined any specific categories or brands yet.</p>
            </div>
            )}
        </div>
      </motion.div>

      {/* --- Added motion wrapper to Image Card --- */}
      <motion.div
        variants={itemVariants}
        className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6"
      >
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
            aria-label="Upload site image"
          />

          <Button
            variant="secondary"
            onClick={handleUploadButtonClick}
            className={`w-full sm:w-auto ${
              (nextAvailableImageNumber === null || isUploading)
                ? 'opacity-50 cursor-not-allowed'
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
      </motion.div>

      {/* --- Image Preview Modal --- */}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        images={modalImages}
        initialIndex={currentImageIndex}
        onDeleteImage={onImageDelete}
        isDeletingImage={isDeletingImage}
      />
    </motion.div>
  );
};

export default SiteDetailsContent;