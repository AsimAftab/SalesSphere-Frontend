import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    MapPinIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarDaysIcon,
    GlobeAltIcon,
    PhotoIcon, 
    BuildingStorefrontIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

// --- GOOGLE MAPS ---
import { LocationMap } from '../../components/maps/LocationMap'; 

// Import correct functions and types
import { type FullSiteDetailsData, type SiteDetails, type SiteContact, updateSite } from '../../api/siteDetailsService';
import { deleteSite } from '../../api/siteService'; 

import Button from '../../components/UI/Button/Button';
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, { type EditEntityData } from '../../components/modals/EditEntityModal';

// --- (Component Props Interface remains the same) ---
interface SiteDetailsContentProps {
    data: FullSiteDetailsData | null;
    loading: boolean;
    error: string | null;
    onDataRefresh: () => void;
}

// --- Image Preview Data Structure ---
interface SiteImage {
    url: string;
    description: string;
}
const mockImages: SiteImage[] = [

  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Entrance gate and security area of the site',
  },
  {
    url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    description: 'Site overview with cranes and workers',
  }
];
// ---

// --- STATIC MAP VIEWER WRAPPER ---
interface StaticMapViewerProps {
    latitude: number;
    longitude: number;
}

const StaticMapViewer: React.FC<StaticMapViewerProps> = ({ latitude, longitude }) => {
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
// ---

const SiteDetailsContent: React.FC<SiteDetailsContentProps> = ({
    data: fullData,
    loading,
    error,
    onDataRefresh
}) => {
    // --- STATE DEFINITIONS ---
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // <-- This is now used
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    // --- HANDLERS (LOGIC RESTORED) ---
    const handleImageClick = (index: number) => { // <-- 'index' is now used
        setCurrentImageIndex(index); // <-- 'setCurrentImageIndex' is now used
        setIsImageModalOpen(true);
    };

    const openEditModal = useCallback(() => setIsEditModalOpen(true), []); // <-- 'openEditModal' is now used
    const closeEditModal = useCallback(() => setIsEditModalOpen(false), []);

    const handleSaveEditedSite = useCallback(async (updatedData: EditEntityData) => { // <-- 'updatedData' is now used
        if (!fullData?.site) return;

        const siteUpdatePayload: Partial<SiteDetails> = {
            name: updatedData.name,
            manager: updatedData.ownerName, 
            description: updatedData.description,
            latitude: updatedData.latitude,
            longitude: updatedData.longitude,
            location: updatedData.address, 
        };

        const contactUpdatePayload: Partial<SiteContact> = {
            phone: updatedData.phone,
            email: updatedData.email,
            fullAddress: updatedData.address, 
        };

        const combinedUpdate: Partial<SiteDetails> & Partial<SiteContact> = {
             ...siteUpdatePayload,
             ...contactUpdatePayload
        };

        try {
            await updateSite(fullData.site.id, combinedUpdate); // <-- 'updateSite' is now used
            closeEditModal();
            onDataRefresh();
        } catch (error) {
            console.error('Error updating site:', error);
            alert(`Failed to update site: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [fullData, onDataRefresh, closeEditModal]); 

    const openDeleteModal = useCallback(() => setIsDeleteModalOpen(true), []); // <-- 'openDeleteModal' is now used
    const cancelDelete = useCallback(() => setIsDeleteModalOpen(false), []);

    const confirmDelete = useCallback(async () => {
        if (!fullData?.site?.id) {
            console.error("Cannot delete: Site data or ID is missing.");
            alert("Could not delete site. Data is missing.");
            cancelDelete();
            return;
        }
        try {
            await deleteSite(fullData.site.id); // <-- 'deleteSite' is now used
            console.log("Deletion successful, navigating...");
            navigate('/sites');
        } catch (error) {
            console.error('Error deleting site:', error);
            alert(`Failed to delete site: ${error instanceof Error ? error.message : 'Unknown error'}`);
            cancelDelete();
        }
    }, [fullData, navigate, cancelDelete]);


    // --- (Loading/Error/NoData checks) ---
    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <span className="ml-2 text-gray-500">Loading Site Details...</span>
        </div>
    );
    if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!fullData || !fullData.site) return <div className="text-center p-10 text-gray-500">Site data not found.</div>;

    const { site, contact } = fullData; 

    // --- (formatDate function - LOGIC RESTORED) ---
    const formatDate = (dateString: string | undefined | null) => { // <-- 'formatDate' is now used
        if (!dateString) return 'N/A';
        try {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            let date;
            if (dateString.includes('T')) {
                 date = new Date(dateString);
            } else {
                 const parts = dateString.split('-').map(Number);
                 date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
                 return date.toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });
            }
            return date.toLocaleDateString('en-US', options);
        } catch { return dateString; }
    };
    
    // --- Use standard Google Maps URL format ---
    const googleMapsUrl = (site.latitude && site.longitude)
        ? `http://maps.google.com/mapfiles/ms/icons/blue-dot.png4{site.latitude},${site.longitude}`
        : '#';

    // --- JSX Return ---
    return (
        <div className="relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/sites" className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Back to Sites">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">Site Details</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 md:space-x-4">
                    <Button variant="primary" onClick={openEditModal} className="w-full" disabled={!site}>
                        Edit Site
                    </Button>
                    <Button
                        variant="outline"
                        onClick={openDeleteModal}
                        className="w-full text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
                        disabled={!site}
                    >
                        Delete Site
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Site Details */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                    {/* Row 1: Main Site Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <BuildingStorefrontIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{site.name}</h2>
                        
                        {/* --- START: Adapted Code --- */}
                        {site.latitude && site.longitude ? (
                            <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                            >
                            <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm hover:underline">{contact?.fullAddress ?? 'Address N/A'}</span>
                            </a>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-600">
                            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{contact?.fullAddress ?? 'Address N/A'}</span>
                            </div>
                        )}
                        {/* --- END: Adapted Code --- */}

                        </div>
                    </div>
                    </div>

                    {/* Row 2: Site Information Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            Site Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Manager Name */}
                            <div className="flex items-start gap-2">
                                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Manager Name</span>
                                    <span className="text-gray-800">{site.manager || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Date Joined/Created */}
                            <div className="flex items-start gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Date Joined</span>
                                    <span className="text-gray-800">{formatDate(site.dateJoined)}</span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-2">
                                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Phone</span>
                                    <span className="text-gray-800">{contact?.phone ?? 'N/A'}</span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-2">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Email</span>
                                    <span className="text-gray-800 break-all">{contact?.email ?? 'N/A'}</span>
                                </div>
                            </div>
                            
                            {/* Full Address */}
                            <div className="sm:col-span-2 flex items-start gap-2">
                                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Full Address</span>
                                    <span className="text-gray-800">{contact?.fullAddress ?? 'N/A'}</span>
                                </div>
                            </div>

                            {/* Latitude */}
                            <div className="flex items-start gap-2">
                                <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Latitude</span>
                                    <span className="text-gray-800">{site.latitude?.toFixed(6) ?? 'N/A'}</span>
                                </div>
                            </div>

                            {/* Longitude */}
                            <div className="flex items-start gap-2">
                                <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Longitude</span>
                                    <span className="text-gray-800">{site.longitude?.toFixed(6) ?? 'N/A'}</span>
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="sm:col-span-2 flex items-start gap-2 mt-2 pt-2 border-t border-gray-100">
                                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Description</span>
                                    <p className="text-gray-800 whitespace-pre-wrap">{site.description || 'No description provided.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Location Map Card (UPDATED) */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                         <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                 <MapPinIcon className="w-4 h-4 text-blue-600" />
                             </div>
                             Location Map
                         </h3>
                    </div>
                  
                    {/* --- REPLACED LEAFLET WITH GOOGLE MAPS WRAPPER --- */}
                    <div className="flex-1 relative z-0" style={{ minHeight: '400px' }}>
                         {site.latitude && site.longitude ? (
                             <StaticMapViewer
                                 latitude={site.latitude}
                                 longitude={site.longitude}
                             />
                         ) : (
                             <div className="h-full flex items-center justify-center bg-gray-100">
                                 <p className="text-gray-500 text-sm">Location data not provided</p>
                             </div>
                         )}
                    </div>
                  
                    {site.latitude && site.longitude && (
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
                    )}
                </div>
            </div>

            {/* --- Images Section --- */}
            <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PhotoIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    Site Images ({mockImages.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mockImages.map((image, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleImageClick(index)}
                            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group"
                        >
                            <img 
                                src={image.url} 
                                alt={image.description} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium p-1 rounded backdrop-blur-sm">Click to Enlarge</span>
                            </div>
                        </div>
                    ))}
                    {!mockImages.length && <p className="text-gray-500 col-span-full">No images found for this site.</p>}
                </div>
            </div>
            
            {/* --- Modals --- */}
            {isImageModalOpen && (
                <ImagePreviewModal
                    isOpen={isImageModalOpen}
                    onClose={() => setIsImageModalOpen(false)}
                    images={mockImages}
                    initialIndex={currentImageIndex}
                />
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to delete "${site.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                confirmButtonText="Delete"
                confirmButtonVariant="danger"
            />

            <EditEntityModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleSaveEditedSite}
                title="Edit Site"
                nameLabel="Site Name"
                ownerLabel="Manager Name" 
                panVatMode="hidden" 
                descriptionMode="required"
                initialData={{
                    name: site.name,
                    ownerName: site.manager, 
                    dateJoined: site.dateJoined,
                    address: contact?.fullAddress ?? site.location ?? '', 
                    description: site.description ?? '',
                    latitude: site.latitude ?? 0,
                    longitude: site.longitude ?? 0,
                    email: contact?.email ?? '',
                    phone: (contact?.phone ?? '').replace(/[^0-9]/g, ''), 
                    panVat: '', 
                }}
            />

        </div>
    );
};

export default SiteDetailsContent;