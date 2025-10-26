// src/pages/sites/SiteDetailsContent.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

import { type FullSiteDetailsData } from '../../api/siteDetailsService'; 

import Button from '../../components/UI/Button/Button'; 
import ImagePreviewModal from '../../components/modals/ImagePreviewModal'; 

// --- Leaflet Icon Fix ---
if (typeof window !== 'undefined') { 
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}
// ---

// --- Component Props Interface ---
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
    { url: 'https://picsum.photos/id/237/800/600', description: 'Front exterior view' }, // Increased size for better modal view
    { url: 'https://picsum.photos/id/238/800/600', description: 'Internal view of main floor' },
    { url: 'https://picsum.photos/id/239/800/600', description: 'Entrance gate' },
];
// ---

const SiteDetailsContent: React.FC<SiteDetailsContentProps> = ({
    data: fullData,
    loading,
    error,
    onDataRefresh: _onDataRefresh
}) => {
    // REINTRODUCING STATE for click preview
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Click handler function
    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setIsImageModalOpen(true);
    };

    // Loading/Error/NoData checks
    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Loading Site Details...</span>
        </div>
    );
    if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!fullData) return <div className="text-center p-10 text-gray-500">Site data not found.</div>;

    const { site, contact } = fullData;

    // Formatting function
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString); 
            return date.toLocaleDateString('en-US', options);
        } catch { return dateString; }
    };

    // --- JSX Return ---
    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/sites" className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Back to Sites">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Site Details</h1>
                    </div>
                </div>
                <div className="flex space-x-2 md:space-x-4">
                    <Button variant="primary" onClick={() => {/* Open Edit Site Modal */}}>
                        Edit Site
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {/* Open Delete Site Modal */}}
                        className="text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
                    >
                        Delete Site
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Site Details (Spans 2/3 on large screens) */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-6">

                    {/* Row 1: Main Site Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <BuildingStorefrontIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{site.name}</h2>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{contact.fullAddress}</span>
                                </div>
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

                            {/* Date Created (Mocked) */}
                            <div className="flex items-start gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Date Created</span>
                                    <span className="text-gray-800">{formatDate('2023-01-15')}</span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-2">
                                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Phone</span>
                                    <span className="text-gray-800">{contact.phone || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-2">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Email</span>
                                    <span className="text-gray-800 break-all">{contact.email || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Full Address */}
                            <div className="sm:col-span-2 flex items-start gap-2">
                                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Full Address</span>
                                    <span className="text-gray-800">{contact.fullAddress}</span>
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

                {/* Right Column: Location Map Card */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPinIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            Location Map
                        </h3>
                    </div>
                    <div className="flex-1 relative z-0" style={{ minHeight: '400px' }}>
                        {site.latitude && site.longitude ? (
                            <MapContainer
                                center={[site.latitude, site.longitude]}
                                zoom={14}
                                style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
                                scrollWheelZoom={false}
                                zoomControl={true}
                            >
                                <TileLayer
                                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[site.latitude, site.longitude]}>
                                    <Popup>{site.name}</Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500 text-sm">Location data not available</p>
                            </div>
                        )}
                    </div>
                    {site.latitude && site.longitude && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${site.latitude},${site.longitude}`}
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

            {/* Images Section with CLICK Preview */}
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
                            // Re-added click handler
                            onClick={() => handleImageClick(index)}
                            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group"
                        >
                            <img 
                                src={image.url} 
                                alt={image.description} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                            />
                            {/* Re-added visual indicator for clicking */}
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium p-1 rounded backdrop-blur-sm">Click to Enlarge</span>
                            </div>
                        </div>
                    ))}
                    {!mockImages.length && <p className="text-gray-500 col-span-full">No images found for this site.</p>}
                </div>
            </div>
            
            {/* Image Preview Modal (Opens on click, centered) */}
            {isImageModalOpen && (
                <ImagePreviewModal
                    // Assumes ImagePreviewModal handles centering and display
                    isOpen={isImageModalOpen}
                    onClose={() => setIsImageModalOpen(false)}
                    images={mockImages}
                    initialIndex={currentImageIndex}
                />
            )}

        </div>
    );
};

export default SiteDetailsContent;