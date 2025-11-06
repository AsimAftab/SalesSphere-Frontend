import React from 'react';
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
    DocumentTextIcon 
} from '@heroicons/react/24/outline';

import { Loader2 } from 'lucide-react';
import { LocationMap } from '../../components/maps/LocationMap';
import { type FullSiteDetailsData } from '../../api/siteService';
import Button from '../../components/UI/Button/Button';

// --- PROPS INTERFACE (Updated) ---
interface SiteDetailsContentProps {
    data: FullSiteDetailsData | null;
    loading: boolean;
    error: string | null;
    onDataRefresh: () => void;
    onOpenEditModal: () => void;
    onDeleteRequest: () => void;
}

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

const SiteDetailsContent: React.FC<SiteDetailsContentProps> = ({
    data: fullData,
    loading,
    error,
    onOpenEditModal,
    onDeleteRequest,
   
}) => {

    if (loading)
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Loading Site Details...</span>
            </div>
        );
    if (error)
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!fullData || !fullData.site)
        return <div className="text-center p-10 text-gray-500">Site data not found.</div>;

    const { site, contact, location } = fullData;

    // (formatDate function)
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options);
        } catch {
            return dateString;
        }
    };

    const googleMapsUrl =
        location.latitude && location.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
            : '#';

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
                    {/* Buttons now call props passed from the parent */}
                    <Button variant="primary" onClick={onOpenEditModal} className="w-full">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Site Details */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                    {/* Row 1: Main Site Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <BuildingStorefrontIcon className="w-10 h-10 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {site.siteName}
                                </h2>
                                {location.latitude && location.longitude ? (
                                    <a
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                                    >
                                        <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm hover:underline">{location.address}</span>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPinIcon className="w-4 h-4" />
                                        <span className="text-sm">{location.address}</span>
                                    </div>
                                )}
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
                            <div className="flex items-start gap-2">
                                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Owner Name</span>
                                    <span className="text-gray-800">{site.ownerName || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Date Joined</span>
                                    <span className="text-gray-800">{formatDate(site.dateJoined)}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Phone</span>
                                    <span className="text-gray-800">{contact.phone || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Email</span>
                                    <span className="text-gray-800 break-all">
                                        {contact.email || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="sm:col-span-2 flex items-start gap-2">
                                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Full Address</span>
                                    <span className="text-gray-800">{location.address}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Latitude</span>
                                    <span className="text-gray-800">
                                        {location.latitude?.toFixed(6) ?? 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-500 block">Longitude</span>
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
                        {location.latitude && location.longitude ? (
                            <StaticMapViewer
                                latitude={location.latitude}
                                longitude={location.longitude}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500 text-sm">Location data not provided</p>
                            </div>
                        )}
                    </div>
                    
                    {location.latitude && location.longitude && (
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

            
        </div>
    );
};

export default SiteDetailsContent;