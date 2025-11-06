import React, { useState, useEffect } from 'react';
import {
    XMarkIcon as X,
    MapPinIcon,
    UserIcon,
    CalendarDaysIcon,
    GlobeAltIcon,
    PhoneIcon,
    IdentificationIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { LocationMap } from '../maps/LocationMap'; 
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';

/**
 * A standardized data shape that this modal will return.
 */
export interface NewEntityData {
    name: string;
    ownerName: string;
    dateJoined: string; // Formatted as YYYY-MM-DD
    address: string;
    description: string;
    latitude?: number;
    longitude?: number;
    email?: string;
    phone?: string;
    panVat?: string;
}

interface AddEntityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: NewEntityData) => Promise<void>;
    title: string; 
    nameLabel: string;
    ownerLabel: string;
    panVatMode: 'required' | 'optional' | 'hidden';
    namePlaceholder?: string;
    ownerPlaceholder?: string;
}

// Internal form state
interface FormData {
    name: string;
    ownerName: string;
    address: string;
    latitude: number;
    longitude: number;
    email: string;
    phone: string;
    panVat: string;
    description: string;
}

const AddEntityModal: React.FC<AddEntityModalProps> = ({
    isOpen,
    onClose,
    onSave,
    title,
    nameLabel,
    ownerLabel,
    panVatMode,
    namePlaceholder,
    ownerPlaceholder
}) => {
    const defaultPosition = { lat: 27.7172, lng: 85.324 }; // Default to Kathmandu

    const [formData, setFormData] = useState<FormData>({
        name: '',
        ownerName: '',
        address: '',
        latitude: defaultPosition.lat,
        longitude: defaultPosition.lng,
        email: '',
        phone: '',
        panVat: '',
        description: '',
    });

    const [dateJoined, setDateJoined] = useState<Date | null>(null);
    const [mapPosition, setMapPosition] = useState(defaultPosition);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            handleClose(false); // Reset form without closing
        }
    }, [isOpen]);

    // This function syncs coordinates from the map
    const handleMapSync = (location: { lat: number; lng: number }) => {
        setFormData(prev => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
        }));
        setMapPosition(location); 
    };

    // This handler receives the text address from the map
    const handleAddressSync = (address: string) => {
        setFormData(prev => ({
            ...prev,
            address: address,
        }));
        if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;

        if (name === 'phone') {
            value = value.replace(/[^0-9]/g, '').slice(0, 10);
        }
        if (name === 'panVat') {
            value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 14);
        }

        setFormData(prev => ({ ...prev, [name]: value as any }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleDateChange = (date: Date | null) => {
        setDateJoined(date);
        if (errors.dateJoined) setErrors(prev => ({ ...prev, dateJoined: '' }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = `${nameLabel} is required`;
        if (!formData.ownerName.trim()) newErrors.ownerName = `${ownerLabel} is required`;
        if (!dateJoined) newErrors.dateJoined = 'Date joined is required';

        if (panVatMode === 'required' && !formData.panVat.trim()) {
             newErrors.panVat = 'PAN/VAT number is required';
        } else if (formData.panVat.trim() && formData.panVat.length > 14) {
             newErrors.panVat = 'PAN/VAT must be 14 characters or less';
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (formData.phone.length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (isNaN(Number(formData.latitude))) newErrors.latitude = 'Latitude must be valid';
        if (isNaN(Number(formData.longitude))) newErrors.longitude = 'Longitude must be valid';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const formattedDate = dateJoined!.toLocaleDateString('en-CA', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        }).replace(/\//g, '-');

        const dataToSave: NewEntityData = {
            name: formData.name,
            ownerName: formData.ownerName,
            dateJoined: formattedDate,
            panVat: formData.panVat || undefined,
            address: formData.address,
            description: formData.description,
            latitude: Number(formData.latitude) || undefined,
            longitude: Number(formData.longitude) || undefined,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
        };

        await onSave(dataToSave);
        handleClose(true);
    };

    const handleClose = (shouldCloseModal: boolean = true) => {
        setFormData({
            name: '',
            ownerName: '',
            address: '',
            latitude: defaultPosition.lat,
            longitude: defaultPosition.lng,
            email: '',
            phone: '',
            panVat: '',
            description: '',
        });
        setDateJoined(null);
        setMapPosition(defaultPosition);
        setErrors({});
        if (shouldCloseModal) {
            onClose();
        }
    };

    if (!isOpen) return null;

    // Define the style for non-clickable fields
    const readOnlyFieldClass = "w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 border-gray-300 min-h-[42px]";

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 pointer-events-none"
            style={{ zIndex: 9999 }}
            >
            <div
                className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                style={{ zIndex: 10000 }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={() => handleClose(true)}
                        className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

                        {/* SECTION 1: General Details Header */}
                        <div className="md:col-span-2 pb-2 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                                General Details
                            </h3>
                        </div>

                        {/* Row 1, Col 1: Dynamic Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {nameLabel} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={namePlaceholder || `Enter ${nameLabel.toLowerCase()}`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Row 1, Col 2: Dynamic Owner Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {ownerLabel} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="ownerName" value={formData.ownerName} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={ownerPlaceholder || `Enter ${ownerLabel.toLowerCase()}`}
                            />
                            {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
                        </div>

                        {/* Row 2, Col 1: Date Joined */}
                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <CalendarDaysIcon className="w-4 h-4 text-gray-500"/>
                                Date Joined <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                                value={dateJoined}
                                onChange={handleDateChange}
                                placeholder="YYYY-MM-DD"
                            />
                            {errors.dateJoined && <p className="text-red-500 text-sm mt-1">{errors.dateJoined}</p>}
                        </div>

                        {/* Row 2, Col 2: Conditional PAN/VAT */}
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
                        
                        {/* SECTION 2: Contact Details Header */}
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
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
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
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>


                        {/* SECTION 3: Location Map */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-blue-600" />
                                Location Map
                            </h3>
                            
                            {/* --- FIX: Removed border, shadow, overflow --- */}
                            <div className="h-72 rounded-lg"
                                style={{ pointerEvents: 'auto' }}
                            >
                                <LocationMap 
                                  position={mapPosition} 
                                  onLocationChange={handleMapSync} 
                                  onAddressGeocoded={handleAddressSync}
                                />
                            </div>
                        </div>

                        {/* SECTION 4: Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            {/* --- FIX: Changed from <textarea> to <p> --- */}
                            <p
                                className={`${readOnlyFieldClass} min-h-[78px]`}
                            >
                                {formData.address || 'Auto-filled from map'}
                            </p>
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                        </div>
                        
                        {/* SECTION 5: Latitude & Longitude */}
                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <GlobeAltIcon className="w-4 h-4 text-gray-500"/>
                                Latitude <span className="text-red-500">*</span>
                            </label>
                            {/* --- FIX: Changed from <input> to <p> --- */}
                            <p className={readOnlyFieldClass}>
                                {formData.latitude}
                            </p>
                            {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>}
                        </div>
                        
                        <div>
                            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <GlobeAltIcon className="w-4 h-4 text-gray-500"/>
                                Longitude <span className="text-red-500">*</span>
                            </label>
                            {/* --- FIX: Changed from <input> to <p> --- */}
                            <p className={readOnlyFieldClass}>
                                {formData.longitude}
                            </p>
                            {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>}
                        </div>

                         {/* SECTION 6: Description */}
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
                                placeholder="Provide a description..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                         </div>

                    </div>
                    {/* --- END MAIN FORM GRID CONTAINER --- */}

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
                        <Button type="button" variant="ghost" onClick={() => handleClose(true)} className="py-1.5 px-4 text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">Cancel</Button>
                        <Button type="submit" variant="primary" className="py-1.5 px-4 text-sm">
                            {title.replace('New ', '')} {/* e.g., "Add Party" */}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEntityModal;