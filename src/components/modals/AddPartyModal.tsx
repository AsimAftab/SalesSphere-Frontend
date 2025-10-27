import React, { useState } from 'react';
import { 
    XMarkIcon as X, 
    MapPinIcon, 
    UserIcon, 
    GlobeAltIcon,
    PhoneIcon,    
} from '@heroicons/react/24/outline';
import { LocationMap } from '../maps/LocationMap';
import { useModalClose } from '../../hooks/useModalClose';
import Button from '../UI/Button/Button';

// Define the shape of the form data
interface PartyFormData {
    companyName: string;
    ownerName: string;
    address: string;
    latitude: number;
    longitude: number;
    email: string; 
    phone: string;
    panVat: string;
}

interface AddPartyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newParty: any) => void; 
}

const defaultPosition = { lat: 27.7172, lng: 85.324 };

const AddPartyModal: React.FC<AddPartyModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<PartyFormData>({
        companyName: '',
        ownerName: '',
        address: '',
        latitude: defaultPosition.lat,
        longitude: defaultPosition.lng, 
        email: '',
        phone: '',
        panVat: '',
    });

    const [mapPosition, setMapPosition] = useState(defaultPosition);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Use modal close hook for ESC key and backdrop click
    const { handleBackdropClick } = useModalClose(isOpen, onClose);

    // Reverse geocode to get address from coordinates
    const reverseGeocode = async (lat: number, lng: number) => {
        const mockAddress = `Mock Address near Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

        setFormData(prev => ({
            ...prev,
            address: mockAddress,
            latitude: lat,
            longitude: lng,
        }));
    };

    // Handle location change from map click
    const handleLocationChange = (location: { lat: number; lng: number }) => {
        setMapPosition(location);
        reverseGeocode(location.lat, location.lng);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prev => ({
                    ...prev,
                    phone: numericValue
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Update map position if latitude or longitude changes
        if (name === 'latitude' || name === 'longitude') {
            const lat = name === 'latitude' ? parseFloat(value) : Number(formData.latitude);
            const lng = name === 'longitude' ? parseFloat(value) : Number(formData.longitude);

            if (!isNaN(lat) && !isNaN(lng)) setMapPosition({ lat, lng });
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        
        // Email is OPTIONAL, but validate format if a value is present
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
             newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits.';
        }

        if (!formData.panVat.trim()) newErrors.panVat = 'PAN/VAT number is required';
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

        if (!validate()) return;

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
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            companyName: '',
            ownerName: '',
            address: '',
            latitude: defaultPosition.lat,
            longitude: defaultPosition.lng,
            email: '',
            phone: '',
            panVat: '',
        });
        setMapPosition(defaultPosition);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }} onClick={handleBackdropClick}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Party</h2>
                    <button
                        onClick={handleClose}
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

                        {/* Company Name (FULL WIDTH) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter company name"
                            />
                            {errors.companyName && (<p className="mt-1 text-sm text-red-500">{errors.companyName}</p>)}
                        </div>

                        {/* Owner Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="ownerName" value={formData.ownerName} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter owner name"
                            />
                            {errors.ownerName && (<p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>)}
                        </div>

                        {/* PAN/VAT Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                PAN/VAT Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="panVat" value={formData.panVat} onChange={handleChange}
                                maxLength={14} 
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.panVat ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter PAN/VAT number"
                            />
                            {errors.panVat && (<p className="mt-1 text-sm text-red-500">{errors.panVat}</p>)}
                        </div>
                        
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

                        {/* Email (Optional) */}
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

                        {/* SECTION 3: Location Map */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-blue-600" />
                                Location Map
                            </h3>
                            <div className="h-96 rounded-lg overflow-hidden border border-gray-300 shadow-md">
                                <LocationMap position={mapPosition} onLocationChange={handleLocationChange} />
                            </div>
                        </div>

                        {/* Address (FULL WIDTH) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address <span className="text-red-500">*</span>
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

                         {/* Google Maps Link (Auto-generated - FULL WIDTH) */}
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Google Maps Link
                            </label>
                            <input
                                type="text"
                                value={`https://www.google.com/maps/search/?api=1&query=${formData.latitude},${formData.longitude}`}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">Auto-generated from coordinates</p>
                        </div>

                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            className="py-1.5 px-4 text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="py-1.5 px-4 text-sm"
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