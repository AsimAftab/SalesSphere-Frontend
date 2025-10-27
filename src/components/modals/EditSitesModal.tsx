// src/components/modals/EditSitesModal.tsx

import React, { useState, useEffect } from 'react';
import { 
    XMarkIcon as X, 
    MapPinIcon, 
    PhoneIcon, 
    DocumentTextIcon, 
    CalendarDaysIcon,
    GlobeAltIcon,
    BuildingStorefrontIcon 
} from '@heroicons/react/24/outline';
import { type SiteDetails, type SiteContact } from '../../api/services/site/siteDetailsService';
import { LocationMap } from '../maps/LocationMap'; 
import Button from '../UI/Button/Button'; 
import DatePicker from '../UI/DatePicker/DatePicker'; 

// --- Component Props Interface ---
interface EditSitesModalProps {
    site: SiteDetails; 
    contact?: SiteContact; 
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedSiteData: Partial<SiteDetails> & Partial<SiteContact>) => void;
}

// --- Form Data Interface ---
interface EditSiteFormData {
    name: string;
    manager: string;
    description: string;
    latitude: number;
    longitude: number;
    email: string;
    phone: string;
    fullAddress: string;
    dateCreated: string;
}

// Helper function to safely get contact data
const getInitialContact = (c: SiteContact | undefined) => c || { email: '', phone: '', fullAddress: '' };


// Renamed and Exported as a Named Export
export const EditSitesModal: React.FC<EditSitesModalProps> = ({ site, contact, isOpen, onClose, onSave }) => {
    
    // Safely initialize state based on props
    const initialContact = getInitialContact(contact);

    const [formData, setFormData] = useState<EditSiteFormData>({
        name: site.name,
        manager: site.manager,
        dateCreated: '2023-01-15', 
        fullAddress: initialContact.fullAddress,
        description: site.description,
        latitude: site.latitude || 27.7172,
        longitude: site.longitude || 85.324,
        email: initialContact.email || '', 
        phone: initialContact.phone || '', 
    });

    const [dateCreatedState, setDateCreatedState] = useState<Date | null>(null); 

    const [mapPosition, setMapPosition] = useState({
        lat: site.latitude || 27.7172,
        lng: site.longitude || 85.324,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form data when modal is opened or site/contact changes
    useEffect(() => {
        if (isOpen) {
            const currentContact: SiteContact = getInitialContact(contact); 
            
            setFormData({
                name: site.name,
                manager: site.manager,
                dateCreated: '2023-01-15', 
                fullAddress: currentContact.fullAddress,
                description: site.description,
                latitude: site.latitude || 27.7172,
                longitude: site.longitude || 85.324,
                email: currentContact.email || '', 
                phone: currentContact.phone || '', 
            });

            // Initialize Date object for DatePicker
            const dateStr = '2023-01-15'; 
            const initialDate = dateStr ? new Date(dateStr + 'T00:00:00') : null;
            setDateCreatedState(initialDate); 
            
            setMapPosition({
                lat: site.latitude || 27.7172,
                lng: site.longitude || 85.324,
            });
            setErrors({});
        }
    }, [isOpen, site, contact]); 

    // --- Geocode/Location Handlers ---
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();

            if (data && data.display_name) {
                const fullAddress = data.display_name || '';
                setFormData(prev => ({
                    ...prev,
                    fullAddress, 
                    latitude: lat,
                    longitude: lng,
                }));
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    };

    const handleLocationChange = (location: { lat: number; lng: number }) => {
        setMapPosition(location);
        reverseGeocode(location.lat, location.lng);
    };

    // --- Form Change Handler ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;

        if (name === 'phone') {
            value = value.replace(/[^0-9]/g, ''); 
            if (value.length > 10) {
                value = value.slice(0, 10); 
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value as any
        }));

        if (name === 'latitude' || name === 'longitude') {
            const lat = name === 'latitude' ? parseFloat(value) : Number(formData.latitude);
            const lng = name === 'longitude' ? parseFloat(value) : Number(formData.longitude);

            if (!isNaN(lat) && !isNaN(lng)) {
                setMapPosition({ lat, lng });
            }
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // --- Date Change Handler ---
    const handleDateChange = (date: Date | null) => {
        setDateCreatedState(date);
        
        let formattedDate = '';
        if (date) {
            formattedDate = date.toLocaleDateString('en-CA', { 
                year: 'numeric', month: '2-digit', day: '2-digit' 
            }).replace(/\//g, '-'); 
        }

        setFormData(prev => ({ ...prev, dateCreated: formattedDate }));

        if (errors.dateCreated) {
            setErrors(prev => ({ ...prev, dateCreated: '' }));
        }
    };

    // --- Validation Logic ---
    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Site name is required';
        if (!formData.manager.trim()) newErrors.manager = 'Manager name is required'; 
        
        if (!formData.dateCreated.trim()) {
            newErrors.dateCreated = 'Date created is required';
        } else if (isNaN(new Date(formData.dateCreated).getTime())) {
            newErrors.dateCreated = 'Invalid date format';
        }

        if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Address is required'; 
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        if (!formData.phone.trim()) { 
             newErrors.phone = 'Phone number is required';
        } else if (formData.phone.length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (isNaN(Number(formData.latitude))) newErrors.latitude = 'Latitude must be a valid number';
        if (isNaN(Number(formData.longitude))) newErrors.longitude = 'Longitude must be a valid number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Submission Handler ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // --- DEBUGGING LOGS ---
        console.log("1. SUBMIT ATTEMPTED.");
        // ---

        if (!validate()) {
            // --- DEBUGGING LOGS ---
            console.log("2. VALIDATION FAILED. Current Errors:", errors);
            // ---
            return;
        }

        // --- DEBUGGING LOGS ---
        console.log("3. VALIDATION PASSED. SAVING...");
        // ---
        
        const updatedSiteData: Partial<SiteDetails> & Partial<SiteContact> = {
            id: site.id, 
            name: formData.name,
            manager: formData.manager,
            description: formData.description,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            fullAddress: formData.fullAddress,
            phone: formData.phone,
            email: formData.email,
        };

        onSave(updatedSiteData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-800">Edit Site: {site.name}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" /> 
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* --- MAIN FORM GRID CONTAINER --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        
                        {/* SECTION 1: General Details Header */}
                        <div className="md:col-span-2 pb-2 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <BuildingStorefrontIcon className="w-5 h-5 text-blue-600" />
                                Site Details
                            </h3>
                        </div>

                        {/* Site Name (Full Width) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter site name"
                            />
                            {errors.name && (<p className="mt-1 text-sm text-red-500">{errors.name}</p>)}
                        </div>

                        {/* Manager Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Manager Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="manager" value={formData.manager} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.manager ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter site manager name"
                            />
                            {errors.manager && (<p className="mt-1 text-sm text-red-500">{errors.manager}</p>)}
                        </div>

                        {/* Date Created */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <CalendarDaysIcon className="w-4 h-4 text-gray-500"/>
                                Date Created <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                                value={dateCreatedState} 
                                onChange={handleDateChange} 
                                placeholder="YYYY-MM-DD"
                            />
                            {errors.dateCreated && (<p className="text-red-500 text-sm mt-1">{errors.dateCreated}</p>)}
                        </div>
                        
                        
                        {/* SECTION 2: Contact Details Header */}
                        <div className="md:col-span-2 pt-4 pb-2 mt-4 border-t border-b border-gray-200">
                             <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                 <PhoneIcon className="w-5 h-5 text-blue-600" />
                                 Contact Details
                             </h3>
                        </div>

                        {/* Phone (Required) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={10}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter 10-digit phone number"
                            />
                            {errors.phone && (<p className="mt-1 text-sm text-red-500">{errors.phone}</p>)}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter email address"
                            />
                            {errors.email && (<p className="mt-1 text-sm text-red-500">{errors.email}</p>)}
                        </div>

                        {/* SECTION 3: Location Map (Spans 2 columns) */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-blue-600" />
                                Location Information
                            </h3>
                            {/* Interactive Map (Fixed Height) */}
                            <div className="h-64 rounded-lg overflow-hidden border border-gray-300 shadow-md mb-6">
                                <LocationMap
                                    position={mapPosition}
                                    onLocationChange={handleLocationChange}
                                />
                            </div>
                        </div>

                        {/* Full Address (Spans 2 columns) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="fullAddress" value={formData.fullAddress} onChange={handleChange} rows={3} 
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullAddress ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Auto-filled from map or enter manually"
                            />
                            {errors.fullAddress && (<p className="mt-1 text-sm text-red-500">{errors.fullAddress}</p>)}
                        </div>

                        {/* Latitude */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <GlobeAltIcon className="w-4 h-4 text-gray-500"/>
                                Latitude <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Auto-filled from map"
                            />
                            {errors.latitude && (<p className="mt-1 text-sm text-red-500">{errors.latitude}</p>)}
                        </div>

                        {/* Longitude */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <GlobeAltIcon className="w-4 h-4 text-gray-500"/>
                                Longitude <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Auto-filled from map"
                            />
                            {errors.longitude && (<p className="mt-1 text-sm text-red-500">{errors.longitude}</p>)}
                        </div>
                        
                        {/* SECTION 4: Description (Spans 2 columns) */}
                        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                             <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                 <DocumentTextIcon className="w-5 h-5 text-blue-600"/>
                                 Description
                             </h3>
                             <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Description <span className="text-red-500">*</span> 
                             </label>
                            <textarea
                                name="description" value={formData.description} onChange={handleChange} rows={4}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Provide a detailed description of the site (e.g., location type, security notes, access information)"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

                    </div>
                    {/* --- END MAIN FORM GRID CONTAINER --- */}

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
                        <Button type="button" variant="ghost" onClick={onClose} className="py-1.5 px-4 text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">Cancel</Button>
                        <Button type="submit" variant="primary" className="py-1.5 px-4 text-sm">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSitesModal;