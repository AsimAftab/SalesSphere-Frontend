// src/components/modals/EditEntityModal.tsx

import React, { useState, useEffect } from 'react';
import {
    XMarkIcon as X,
    MapPinIcon,
    UserIcon,
    PhoneIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    GlobeAltIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';
import { LocationMap } from '../maps/LocationMap';
import Button from '../UI/Button/Button';

export interface EditEntityData {
    name: string;
    ownerName: string;
    dateJoined: string;
    address: string;
    description?: string;
    latitude: number;
    longitude: number;
    email: string;
    phone: string;
    panVat?: string;
}

interface EditEntityModalProps {
    isOpen: boolean;
    onClose: () => void;
    // --- FIX 1: Expect the full object, not Partial ---
    onSave: (updatedData: EditEntityData) => Promise<void>; 
    initialData: EditEntityData;
    title: string;
    nameLabel: string;
    ownerLabel: string;
    panVatMode: 'required' | 'optional' | 'hidden';
    descriptionMode: 'required' | 'hidden' | 'optional'; // Added optional
}

// Internal form state
interface FormData {
    name: string;
    ownerName: string;
    dateJoined: string; // Keep for display
    address: string;
    description: string; // Always string, even if optional
    latitude: number;
    longitude: number;
    email: string;
    phone: string;
    panVat: string; // Always string, even if optional
}

const EditEntityModal: React.FC<EditEntityModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    title,
    nameLabel,
    ownerLabel,
    panVatMode,
    descriptionMode
}) => {

    // Map initial data (which can have undefineds) to a full FormData object
    const mapInitialToFormData = (data: EditEntityData): FormData => ({
        name: data.name ?? '',
        ownerName: data.ownerName ?? '',
        dateJoined: data.dateJoined ?? '', // This is just for display
        address: data.address ?? '',
        description: data.description ?? '',
        latitude: data.latitude ?? 27.7172,
        longitude: data.longitude ?? 85.324,
        email: data.email ?? '',
        phone: (data.phone ?? '').replace(/[^0-9]/g, ''), // Clean phone number on load
        panVat: data.panVat ?? ''
    });

    const [formData, setFormData] = useState<FormData>(mapInitialToFormData(initialData));
    const [mapPosition, setMapPosition] = useState({ lat: 0, lng: 0 });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const formatDisplayDate = (dateString: string | undefined | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch { return 'Invalid Date'; }
    };

    useEffect(() => {
        if (isOpen) {
            const mappedData = mapInitialToFormData(initialData);
            setFormData(mappedData);
            setMapPosition({
                lat: mappedData.latitude || 27.7172,
                lng: mappedData.longitude || 85.324,
            });
            setErrors({});
        }
    }, [isOpen, initialData]);

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
            const data = await response.json();
            if (data && data.display_name) {
                setFormData(prev => ({ ...prev, address: data.display_name, latitude: lat, longitude: lng }));
            }
        } catch (error) { console.error('Error reverse geocoding:', error); }
    };

    const handleLocationChange = (location: { lat: number; lng: number }) => {
        setMapPosition(location);
        reverseGeocode(location.lat, location.lng);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;

        if (name === 'phone') {
            value = value.replace(/[^0-9]/g, '').slice(0, 10);
        }
        if (name === 'panVat') {
            value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 14);
        }

        setFormData(prev => ({ ...prev, [name]: value })); // Use full string value

        if (name === 'latitude' || name === 'longitude') {
            const lat = name === 'latitude' ? parseFloat(value) : Number(formData.latitude);
            const lng = name === 'longitude' ? parseFloat(value) : Number(formData.longitude);
            if (!isNaN(lat) && !isNaN(lng)) setMapPosition({ lat, lng });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = `${nameLabel} is required`;
        if (!formData.ownerName.trim()) newErrors.ownerName = `${ownerLabel} is required`;

        if (panVatMode === 'required' && !formData.panVat.trim()) {
            newErrors.panVat = 'PAN/VAT number is required';
        } else if (formData.panVat.trim() && formData.panVat.length > 14) {
            newErrors.panVat = 'PAN/VAT must be 14 characters or less';
        }
        
        if (descriptionMode === 'required' && !formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required';
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
        return newErrors;
    };

    // --- FIX 2: handleSubmit now sends the FULL form data ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("1. SUBMIT ATTEMPTED.");

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            console.log("2. VALIDATION FAILED. Errors:", validationErrors);
            return;
        }

        console.log("3. VALIDATION PASSED. SAVING...");

        // Create the payload with ALL form data, converting types as needed
        const updatedData: EditEntityData = {
            ...formData, // Send all form data (name, ownerName, address, description, email, phone, panVat)
            dateJoined: initialData.dateJoined, // Send back the original dateJoined
            latitude: Number(formData.latitude) || 0, // Ensure numbers
            longitude: Number(formData.longitude) || 0, // Ensure numbers
        };

        console.log("4. Saving data:", updatedData);

        await onSave(updatedData); // Sends the FULL object
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

                        {/* SECTION 1: General Details */}
                        <div className="md:col-span-2 pb-2 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                                General Details
                            </h3>
                        </div>

                        {/* Name (Full Width) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {nameLabel} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={`Enter ${nameLabel.toLowerCase()}`}
                            />
                            {errors.name && (<p className="mt-1 text-sm text-red-500">{errors.name}</p>)}
                        </div>

                        {/* Owner Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {ownerLabel} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="ownerName" value={formData.ownerName} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={`Enter ${ownerLabel.toLowerCase()}`}
                            />
                            {errors.ownerName && (<p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>)}
                        </div>

                        {/* Date Joined (Display Only) */}
                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <CalendarDaysIcon className="w-4 h-4 text-gray-500"/>
                                Date Joined
                            </label>
                            <p className="mt-1 text-sm text-gray-900 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 h-10 flex items-center">
                                {formatDisplayDate(formData.dateJoined)}
                            </p>
                        </div>
                        
                        {/* Conditional PAN/VAT (if not hidden) */}
                        {panVatMode !== 'hidden' && (
                            <div>
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <IdentificationIcon className="w-4 h-4 text-gray-500"/>
                                    PAN/VAT Number
                                    {panVatMode === 'required' && <span className="text-red-500"> *</span>}
                                </label>
                                <input
                                    type="text"
                                    name="panVat"
                                    value={formData.panVat}
                                    onChange={handleChange}
                                    maxLength={14}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.panVat ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter PAN/VAT (max 14)"
                                />
                                {errors.panVat && <p className="text-red-500 text-sm mt-1">{errors.panVat}</p>}
                            </div>
                        )}
                        
                        {/* Empty div for layout if PAN/VAT is hidden */}
                        {panVatMode === 'hidden' && ( <div /> )}


                        {/* SECTION 2: Contact Details */}
                        <div className="md:col-span-2 pt-4 pb-2 mt-4 border-t border-b border-gray-200">
                             <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                 <PhoneIcon className="w-5 h-5 text-blue-600" />
                                 Contact Details
                             </h3>
                        </div>

                        {/* Phone */}
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

                        {/* SECTION 3: Location */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-blue-600" />
                                Location Information
                            </h3>
                            {/* Search bar can be added here if needed */}
                            <div className="h-64 rounded-lg overflow-hidden border border-gray-300 shadow-md mb-6">
                                <LocationMap
                                    position={mapPosition}
                                    onLocationChange={handleLocationChange}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="address" value={formData.address} onChange={handleChange} rows={3}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Auto-filled from map or enter manually"
                            />
                            {errors.address && (<p className="mt-1 text-sm text-red-500">{errors.address}</p>)}
                        </div>

                        {/* Latitude */}
                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
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
                            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
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

                        {/* SECTION 4: Description (Conditional) */}
                        {descriptionMode !== 'hidden' && (
                            <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <DocumentTextIcon className="w-5 h-5 text-blue-600"/>
                                    Description
                                </h3>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                    {descriptionMode === 'required' && <span className="text-red-500"> *</span>}
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Provide a description..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>
                        )}

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

export default EditEntityModal;