// src/pages/prospects/ProspectDetailsContent.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    DocumentTextIcon // <-- This is the correct import for the Description icon
} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

import { type Prospect } from '../../api/prospectService'; 
import { deleteProspect, updateProspect, transferProspectToParty } from '../../api/prospectDetailsService';

import ConfirmationModal from '../../components/modals/ConfirmationModal'; 
import Button from '../../components/UI/Button/Button';
import EditProspectModal from '../../components/modals/EditProspectModal'; 

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
interface ProspectDetailsContentProps {
    data: Prospect | null;
    loading: boolean;
    error: string | null;
    onDataRefresh: () => void;
}

const ProspectDetailsContent: React.FC<ProspectDetailsContentProps> = ({
    data: prospect,
    loading,
    error,
    onDataRefresh
}) => {
    // State for Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const navigate = useNavigate();

    // Loading/Error/NoData checks
    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Loading Prospect Details...</span>
        </div>
    );
    if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    if (!prospect) return <div className="text-center p-10 text-gray-500">Prospect data not found.</div>;

    // Formatting function
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            // Handle potential full ISO strings or date-only strings by creating a new Date object
            const date = new Date(dateString); 
            return date.toLocaleDateString('en-US', options);
        } catch { return dateString; } // Fallback to original string if parsing fails
    };

    // --- Delete Logic ---
    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteProspect(prospect.id);
            navigate('/prospects');
        } catch (err) {
            console.error('Error deleting prospect:', err);
        } finally {
            setDeleteModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
    }

    // --- Edit Logic ---
    const handleSaveEditedProspect = async (updatedData: Partial<Prospect>) => {
        try {
            await updateProspect(prospect.id, updatedData);
            setIsEditModalOpen(false);
            onDataRefresh(); // Call parent's refresh function
        } catch (error) {
            console.error('Error updating prospect:', error);
        }
    };

    // --- Transfer Logic ---
    const handleTransferClick = () => {
        setIsTransferModalOpen(true);
    };

    const confirmTransfer = async () => {
        try {
            await transferProspectToParty(prospect.id);
            navigate('/parties'); // Navigate to parties list after transfer
        } catch (error) {
            console.error('Error transferring prospect:', error);
        } finally {
            setIsTransferModalOpen(false);
        }
    };

    const cancelTransfer = () => {
        setIsTransferModalOpen(false);
    };

    // --- JSX Return ---
    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/prospects" className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Back to Prospects">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Prospect Details</h1>
                    </div>
                </div>
                <div className="flex space-x-2 md:space-x-4">
                    <Button
                        variant="secondary"
                        onClick={handleTransferClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white" 
                    >
                        <ArrowPathRoundedSquareIcon className="h-4 w-4 mr-2" />
                        Transfer to Party
                    </Button>
                    <Button variant="primary" onClick={() => setIsEditModalOpen(true)}>
                        Edit Prospect
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDeleteClick}
                        className="text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
                    >
                        Delete Prospect
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Left Column: Prospect Details (Spans 2/3 on large screens) */}
    <div className="lg:col-span-2 grid grid-cols-1 gap-6">

        {/* Row 1: Main Prospect Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BuildingStorefrontIcon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{prospect.name}</h2>
                    {prospect.latitude && prospect.longitude ? (
                        <a
                            // Using a standard Google Maps URL format
                            href={`http://maps.google.com/maps?q=${prospect.latitude},${prospect.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                        >
                            <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm hover:underline">{prospect.address}</span>
                        </a>
                    ) : (
                         <div className="flex items-center gap-2 text-gray-600">
                            <MapPinIcon className="w-4 h-4" />
                            <span className="text-sm">{prospect.address}</span>
                        </div>
                        )}
                </div>
            </div> 
        </div>
        
        {/* Row 2: Prospect Information Card - MODIFIED */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                Prospect Information
            </h3>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                {/* --- Row 1: Owner Name --- */}
                <div className="flex items-start gap-2">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-500 block">Owner Name</span>
                        <span className="text-gray-800">{prospect.ownerName || 'N/A'}</span>
                    </div>
                </div>

                {/* Date Joined */}
                <div className="flex items-start gap-2">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-500 block">Date Joined</span>
                        <span className="text-gray-800">{formatDate(prospect.dateJoined)}</span>
                    </div>
                </div>

                {/* --- Row 2: Phone --- */}
                <div className="flex items-start gap-2">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-500 block">Phone</span>
                        <span className="text-gray-800">{prospect.phone || 'N/A'}</span>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-2">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-500 block">Email</span>
                        <span className="text-gray-800 break-all">{prospect.email || 'N/A'}</span>
                    </div>
                </div>

                {/* --- Row 3: Full Address (Spans 2 columns) --- */}
                <div className="sm:col-span-2 flex items-start gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-500 block">Full Address</span>
                        <span className="text-gray-800">{prospect.address}</span>
                    </div>
                </div>

                {/* --- Row 4: Latitude --- */}
                <div className="flex items-start gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-500 block">Latitude</span>
                        <span className="text-gray-800">{prospect.latitude?.toFixed(6) ?? 'N/A'}</span>
                    </div>
                </div>

                {/* Longitude */}
                <div className="flex items-start gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium text-gray-500 block">Longitude</span>
                        <span className="text-gray-800">{prospect.longitude?.toFixed(6) ?? 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            {/* New Description Section (Spans full width) */}
            <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-gray-500" /> {/* Now using the correctly imported icon */}
                    Description
                </h4>
                <p className="text-sm text-gray-600">{prospect.description || 'No description provided.'}</p>
            </div>
        </div>
    </div>

    {/* Right Column: Location Map Card (No change) */}
    <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="w-4 h-4 text-blue-600" />
                </div>
                Location Map
             </h3>
        </div>
        {/* Map container uses flex-1 to fill all remaining height */}
        <div className="flex-1 relative z-0" style={{ minHeight: '400px' }}>
            {prospect.latitude && prospect.longitude ? (
                <MapContainer
                    center={[prospect.latitude, prospect.longitude]}
                    zoom={14}
                    style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
                    scrollWheelZoom={false}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[prospect.latitude, prospect.longitude]}>
                        <Popup>{prospect.name}</Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500 text-sm">Location data not provided</p>
                </div>
            )}
        </div>
        {prospect.latitude && prospect.longitude && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <a
                    // Using a standard Google Maps URL format
                    href={`http://maps.google.com/maps?q=${prospect.latitude},${prospect.longitude}`}
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

            {/* Modals */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to delete "${prospect.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                confirmButtonText="Delete"
                confirmButtonVariant="danger"
            />
            <ConfirmationModal
                isOpen={isTransferModalOpen}
                title="Confirm Transfer"
                message={`Are you sure you want to transfer "${prospect.name}" to a Party? This prospect record will be removed.`}
                onConfirm={confirmTransfer}
                onCancel={cancelTransfer}
                confirmButtonText="Transfer"
                confirmButtonVariant="primary"
            />
            
            <EditProspectModal
                prospect={prospect}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEditedProspect}
            />

        </div>
    );
};

export default ProspectDetailsContent;