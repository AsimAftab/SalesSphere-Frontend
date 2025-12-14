import React, { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MapPinIcon,
  UserIcon,
  ArrowPathRoundedSquareIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  IdentificationIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; 
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import { LocationMap } from '../../components/maps/LocationMap';
import { type Prospect, type ApiProspectImage } from '../../api/prospectService';
import Button from '../../components/UI/Button/Button';
import toast from 'react-hot-toast';
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';

// --- PROPS INTERFACE ---
interface ProspectDetailsContentProps {
  prospect: Prospect | null;
  contact: { phone: string; email?: string } | null;
  location: { address: string; latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
  isMutating: boolean; 
  isUploading: boolean;
  isDeletingImage: boolean;
  isTransferring: boolean;
  images: ApiProspectImage[];
  onOpenEditModal: () => void;
  onDeleteRequest: () => void;
  onTransferRequest: () => void;
  onDataRefresh: () => void;
  onImageUpload: (imageNumber: number, file: File) => void;
  onImageDelete: (imageNumber: number) => void;
}

// Map Viewer Component - Updated to take full height
const StaticMapViewer: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => (
    <LocationMap 
        isViewerMode={true} 
        position={{ lat: latitude, lng: longitude }} 
        onLocationChange={() => {}} 
        onAddressGeocoded={() => {}} 
    />
);

// Image Thumbnail Component
interface ImageThumbnailProps {
  image: ApiProspectImage;
  onDelete: (imageNumber: number) => void;
  onPreview: () => void;
  isDeleting: boolean;
}
const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ image, onDelete, onPreview, isDeleting }) => (
    <div className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 shadow-sm">
      <img src={image.imageUrl} alt={`Prospect ${image.imageNumber}`} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300" onClick={onPreview} />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all" />
      <button onClick={onPreview} className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Preview">
        <PhotoIcon className="w-8 h-8 drop-shadow-md" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(image.imageNumber); }} 
        disabled={isDeleting} 
        className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-600 shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-50 transition-all hover:bg-red-50"
        aria-label="Delete"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" />}
      </button>
    </div>
);

// Framer Motion Variants
const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

// Skeleton Loader Component
const ProspectDetailsSkeleton: React.FC = () => (
    <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <Skeleton width={300} height={40} /> <Skeleton width={400} height={40} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6"><Skeleton height={200} /><Skeleton height={300} /></div>
          <div className="lg:col-span-1"><Skeleton height={400} /></div>
        </div>
      </div>
    </SkeletonTheme>
);

const ProspectDetailsContent: React.FC<ProspectDetailsContentProps> = ({
  prospect,
  contact,
  location,
  loading,
  error,
  isMutating,
  isUploading,
  isDeletingImage,
  isTransferring,
  images,
  onOpenEditModal,
  onDeleteRequest,
  onTransferRequest,
  onImageUpload,
  onImageDelete,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedImages = useMemo(() => [...images].sort((a, b) => a.imageNumber - b.imageNumber), [images]);

  const nextAvailableImageNumber = useMemo(() => {
    const existingNumbers = new Set(sortedImages.map(img => img.imageNumber));
    for (let i = 1; i <= 5; i++) {
      if (!existingNumbers.has(i)) return i;
    }
    return null;
  }, [sortedImages]);

  const modalImages = useMemo(() => sortedImages.map(img => ({
      url: img.imageUrl,
      description: `Prospect Image ${img.imageNumber}`,
      imageNumber: img.imageNumber
  })), [sortedImages]);

  const handlePreviewClick = (imageNumber: number) => {
    const index = sortedImages.findIndex(img => img.imageNumber === imageNumber);
    if (index > -1) { setCurrentImageIndex(index); setIsPreviewOpen(true); }
  };

  const handleClosePreview = () => setIsPreviewOpen(false);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { toast.error('Only image files are allowed.'); return; }
      if (file.size > 5 * 1024 * 1024) { toast.error('File too large (Max 5MB).'); return; }
      if (nextAvailableImageNumber !== null) onImageUpload(nextAvailableImageNumber, file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadButtonClick = () => {
    if (isUploading) return;
    if (nextAvailableImageNumber === null) { toast.error("Image limit reached (Max 5)."); return; }
    fileInputRef.current?.click();
  };

  if (loading && !prospect) return <ProspectDetailsSkeleton />;
  if (error && !prospect) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  if (!prospect) return <div className="text-center p-10 text-gray-500">Prospect data not found.</div>;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return dateString; }
  };

  const googleMapsUrl = location?.latitude && location?.longitude ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}` : '#';

  return (
    <motion.div className="relative" variants={containerVariants} initial="hidden" animate="show">
      
      {/* Overlays */}
      {(isMutating || isTransferring) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">{isTransferring ? 'Transferring...' : 'Saving...'}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/prospects" className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ArrowLeftIcon className="h-5 w-5 text-gray-600" /></Link>
          <h1 className="text-2xl font-bold text-gray-800">Prospect Details</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <Button variant="secondary" onClick={onTransferRequest} className="bg-secondary hover:bg-secondary text-white w-full">
            <ArrowPathRoundedSquareIcon className="h-4 w-4 mr-2" /> Transfer to Party
          </Button>
          <Button variant="primary" onClick={onOpenEditModal} className="w-full">Edit Prospect</Button>
          <Button variant="outline" onClick={onDeleteRequest} className="text-red-600 border-red-300 hover:bg-red-50 w-full">Delete Prospect</Button>
        </div>
      </motion.div>

      {/* ========================================================================
        TOP SECTION: NAME, INFO, AND MAP
        ========================================================================
      */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left Column: Info & Name */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Name Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BuildingStorefrontIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{prospect.name}</h2>
                {location?.latitude ? (
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group">
                    <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm hover:underline">{location?.address}</span>
                  </a>
                ) : (<span className="text-gray-500 text-sm">{location?.address}</span>)}
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><UserIcon className="w-4 h-4 text-blue-600" /></div>
                Prospect Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div className="flex items-start gap-2">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div><span className="font-medium text-gray-500 block">Owner Name</span><span className="text-gray-800">{prospect.ownerName}</span></div>
                </div>
                <div className="flex items-start gap-2">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div><span className="font-medium text-gray-500 block">Date Joined</span><span className="text-gray-800">{formatDate(prospect.dateJoined)}</span></div>
                </div>
                <div className="flex items-start gap-2">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div><span className="font-medium text-gray-500 block">Phone</span><span className="text-gray-800">{contact?.phone}</span></div>
                </div>
                <div className="flex items-start gap-2">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div><span className="font-medium text-gray-500 block">Email</span><span className="text-gray-800 break-all">{contact?.email || 'N/A'}</span></div>
                </div>
                <div className="flex items-start gap-2">
                    <IdentificationIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div><span className="font-medium text-gray-500 block">PAN/VAT</span><span className="text-gray-800">{prospect.panVat || 'N/A'}</span></div>
                </div>
                <div className="flex items-start gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div><span className="font-medium text-gray-500 block">Address</span><span className="text-gray-800">{prospect.address || 'N/A'}</span></div>
                </div>

                <div className="flex items-start gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div><span className="font-medium text-gray-500 block">Latitude</span><span className="text-gray-800">{location?.latitude?.toFixed(6) ?? 'N/A'}</span></div>
                </div>
                 <div className="flex items-start gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div><span className="font-medium text-gray-500 block">Longitude</span><span className="text-gray-800">{location?.longitude?.toFixed(6) ?? 'N/A'}</span></div>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"><DocumentTextIcon className="w-4 h-4 text-gray-500" />Description</h4>
                <p className="text-sm text-gray-600">{prospect.description || 'No description.'}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Map Card (Full Height) */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-blue-600" /> Location Map</h3>
            </div>
            {/* flex-1 ensures it fills available vertical space */}
            <div className="flex-1 min-h-[400px] h-full relative"> 
                {location?.latitude ? <StaticMapViewer latitude={location.latitude} longitude={location.longitude} /> : <div className="h-full flex justify-center items-center text-gray-500">No Location</div>}
            </div>
            {location?.latitude && (
                <div className="p-4 bg-gray-50 border-t mt-auto">
                    <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                        <Button variant="secondary" className="w-full justify-center"><MapPinIcon className="w-4 h-4 mr-2" /> View on Google Maps</Button>
                    </a>
                </div>
            )}
        </div>

      </motion.div>

      {/* ========================================================================
        MIDDLE SECTION: PROSPECT INTEREST (FULL WIDTH & PROFESSIONAL UI)
        ========================================================================
      */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 overflow-hidden">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
              <TagIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                Interest Categories
              </h3>
              <p className="text-sm text-gray-500 hidden sm:block">
                Categories and brands the prospect is interested in.
              </p>
            </div>
          </div>
          <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-full border border-gray-200">
            {prospect.interest?.length || 0} Categories
          </span>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
            {prospect.interest && prospect.interest.length > 0 ? (
            prospect.interest.map((item, index) => (
                <motion.div 
                    key={index} 
                    whileHover={{ y: -2 }}
                    className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-secondary transition-all duration-200 h-full group"
                >
                    {/* Category Header with Accent */}
                    <div className="p-4 border-b border-gray-400 bg-gray-50/50 rounded-t-xl">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                            <h4 className="font-semibold text-gray-900 text-sm truncate leading-snug" title={item.category}>
                                {item.category}
                            </h4>
                        </div>
                    </div>

                    {/* Brands Body */}
                    <div className="p-4 flex-1 flex flex-col">
                        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Brands Used</p>
                        <div className="flex flex-wrap gap-2 content-start">
                            {item.brands && item.brands.length > 0 ? (
                            item.brands.map((brand, bIndex) => (
                                <span 
                                    key={bIndex} 
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-secondary border border-blue-100 hover:bg-blue-100 transition-colors duration-150 cursor-default"
                                >
                                    {brand}
                                </span>
                            ))
                            ) : (
                            <span className="text-sm text-gray-400 italic flex items-center gap-1">No brands specified</span>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))
            ) : (
           
            <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <TagIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-900">No Interests Found</h4>
                <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">This prospect hasn't expressed interest in any specific categories or brands yet.</p>
            </div>
            )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><PhotoIcon className="w-4 h-4 text-secondary" /></div>
                Prospect Images ({sortedImages.length} / 5)
            </h3>
            <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" accept="image/png, image/jpeg, image/webp" />
            <Button variant="secondary" onClick={handleUploadButtonClick} className={`w-full sm:w-auto ${nextAvailableImageNumber === null || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isUploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ArrowUpTrayIcon className="w-5 h-5 mr-2" />}
                {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {sortedImages.map(img => (
                <ImageThumbnail key={img.imageNumber} image={img} isDeleting={isDeletingImage} onDelete={onImageDelete} onPreview={() => handlePreviewClick(img.imageNumber)} />
            ))}
        </div>
        {sortedImages.length === 0 && <div className="text-center py-10 text-gray-500">No images uploaded.</div>}
      </motion.div>

      {/* Preview Modal */}
      <ImagePreviewModal isOpen={isPreviewOpen} onClose={handleClosePreview} images={modalImages} initialIndex={currentImageIndex} onDeleteImage={onImageDelete} isDeletingImage={isDeletingImage} />
    </motion.div>
  );
};

export default ProspectDetailsContent;