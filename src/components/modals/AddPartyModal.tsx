import React, { useState } from 'react';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';
// Adjusted import path to be consistent with EditPartyModal
import { LocationMap } from '../maps/LocationMap'; 
// Adjusted import path to be consistent with EditPartyModal
import Button from '../UI/Button/Button'; 

interface AddPartyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newParty: any) => void; 
}

const AddPartyModal: React.FC<AddPartyModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        ownerName: '',
        address: '',
        latitude: 27.7172,
        longitude: 85.324,
        email: '',
        phone: '',
        panVat: '',
    });

    const [mapPosition, setMapPosition] = useState({
        lat: 27.7172,
        lng: 85.324,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reverse geocode to get address from coordinates
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();

            if (data && data.address) {
                const address = data.display_name || '';

                setFormData(prev => ({
                    ...prev,
                    address,
                    latitude: lat,
                    longitude: lng,
                }));
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    };

    // Handle location change from map click
    const handleLocationChange = (location: { lat: number; lng: number }) => {
        setMapPosition(location);
        reverseGeocode(location.lat, location.lng);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;

        // Restrict phone number to ONLY numbers.
        if (name === 'phone') {
            value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        }

        // maxLength on the input fields will handle length restrictions

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Update map position if latitude or longitude changes
        if (name === 'latitude' || name === 'longitude') {
            const lat = name === 'latitude' ? parseFloat(value) : formData.latitude;
            const lng = name === 'longitude' ? parseFloat(value) : formData.longitude;

            if (!isNaN(lat) && !isNaN(lng)) {
                setMapPosition({ lat, lng });
            }
        }

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }

        if (!formData.ownerName.trim()) {
            newErrors.ownerName = 'Owner name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (formData.phone.length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        // Add validation for PAN/VAT
        if (!formData.panVat.trim()) {
            newErrors.panVat = 'PAN/VAT number is required';
        }

        // Validate latitude and longitude
        if (isNaN(Number(formData.latitude))) {
            newErrors.latitude = 'Latitude must be a valid number';
        }

        if (isNaN(Number(formData.longitude))) {
            newErrors.longitude = 'Longitude must be a valid number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // Create new party object
        const newParty = {
            id: `party-${Date.now()}`,
            companyName: formData.companyName,
            ownerName: formData.ownerName,
            address: formData.address,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            email: formData.email,
            phone: formData.phone,
            panVat: formData.panVat,
            dateCreated: new Date().toISOString(),
        };

        onSave(newParty);

        // Reset form
        setFormData({
            companyName: '',
            ownerName: '',
            address: '',
            latitude: 27.7172,
            longitude: 85.324,
            email: '',
            phone: '',
            panVat: '',
        });
        setMapPosition({ lat: 27.7172, lng: 85.324 });
        setErrors({});

        onClose();
    };

    const handleClose = () => {
        // Reset form on close
        setFormData({
            companyName: '',
            ownerName: '',
            address: '',
            latitude: 27.7172,
            longitude: 85.324,
            email: '',
            phone: '',
            panVat: '',
        });
        setMapPosition({ lat: 27.7172, lng: 85.324 });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Party</h2>
                    <Button
                        type="button"
                        onClick={handleClose}
                        className="bg-transparent p-1 rounded-full hover:bg-red-100"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-red-500" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Company Information Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter company name"
                                />
                                {errors.companyName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                                )}
                            </div>

                            {/* Owner Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.ownerName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter owner name"
                                />
                                {errors.ownerName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>

                                )}
                            </div>

                            {/* PAN/VAT Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PAN/VAT Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="panVat"
                                    value={formData.panVat}
                                    onChange={handleChange}
                                    maxLength={14} 
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.panVat ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter PAN/VAT number"
                                />
                                {errors.panVat && (
                                    <p className="mt-1 text-sm text-red-500">{errors.panVat}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    maxLength={10} 
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter 10-digit phone number"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Information Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPinIcon className="w-5 h-5 text-blue-600" />
                            Location Information
                        </h3>

                        {/* Interactive Map with Search */}
                        <div className="mb-6">
                            <LocationMap
                                position={mapPosition}
                                onLocationChange={handleLocationChange}
                            />
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-6">
                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Auto-filled from map or enter manually"
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                )}
                            </div>

                            {/* Latitude & Longitude */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Latitude <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.latitude ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Auto-filled from map"
                                    />
                                    {errors.latitude && (
                                        <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Longitude <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.longitude ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Auto-filled from map"
                                    />
                                    {errors.longitude && (
                                        <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>
                                    )}
                                </div>
                            </div>

                            {/* Google Maps Link (Auto-generated) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Google Maps Link
                                </label>
                                <input
                                    type="text"
                                    // FIXED: Corrected the URL format
                                    value={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-500">Auto-generated from coordinates</p>
                                {/* REMOVED: Extraneous text was here */}
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary" // Assuming 'primary' for the main action
                        >
                            Add Party
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPartyModal;