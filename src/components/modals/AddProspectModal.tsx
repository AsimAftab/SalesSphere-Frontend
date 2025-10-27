import React, { useState } from 'react';
import { 
    XMarkIcon as X, 
    MapPinIcon, 
    UserIcon, 
    CalendarDaysIcon, 
    GlobeAltIcon,
    DocumentTextIcon, 
    PhoneIcon 
} from '@heroicons/react/24/outline';
import { LocationMap } from '../maps/LocationMap'; 
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';
import { type NewProspectData } from '../../api/services/prospect/prospectService';

interface AddProspectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newProspect: NewProspectData) => void;
}

// --- UPDATED FORM DATA STRUCTURE with 'description' ---
interface ProspectFormData {
    name: string;
    ownerName: string;
    address: string;
    description: string; 
    latitude: number;
    longitude: number;
    email: string;
    phone: string;
}
// ---

const AddProspectModal: React.FC<AddProspectModalProps> = ({ isOpen, onClose, onSave }) => {
    const defaultPosition = { lat: 27.7172, lng: 85.324 };
    
    const [formData, setFormData] = useState<ProspectFormData>({
        name: '',
        ownerName: '',
        address: '',
        description: '', 
        latitude: defaultPosition.lat,
        longitude: defaultPosition.lng,
        email: '',
        phone: '',
    });
    
    const [dateJoined, setDateJoined] = useState<Date | null>(null);

    const [mapPosition, setMapPosition] = useState(defaultPosition);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setFormData(prev => ({
                    ...prev,
                    address: data.display_name,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;
        
        if (name === 'phone') {
            value = value.replace(/[^0-9]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: value as any }));

        if (name === 'latitude' || name === 'longitude') {
            const lat = name === 'latitude' ? parseFloat(value) : Number(formData.latitude);
            const lng = name === 'longitude' ? parseFloat(value) : Number(formData.longitude);
            if (!isNaN(lat) && !isNaN(lng)) setMapPosition({ lat, lng });
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleDateChange = (date: Date | null) => {
        setDateJoined(date);
        if (errors.dateJoined) {
            setErrors(prev => ({ ...prev, dateJoined: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) newErrors.name = 'Prospect name is required';
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        
        if (!dateJoined) newErrors.dateJoined = 'Date joined is required'; 
        
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        
        // --- ADDED REQUIRED DESCRIPTION VALIDATION ---
        if (!formData.description.trim()) newErrors.description = 'Description is required'; 
        // ---------------------------------------------
        
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Format the date to YYYY-MM-DD for the API
        const formattedDate = dateJoined!.toLocaleDateString('en-CA', { 
            year: 'numeric', month: '2-digit', day: '2-digit' 
        }).replace(/\//g, '-'); 
        
        const newProspect: NewProspectData = {
            name: formData.name,
            ownerName: formData.ownerName,
            dateJoined: formattedDate,
            address: formData.address,
            description: formData.description, 
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            email: formData.email,
            phone: formData.phone,
        };

        onSave(newProspect);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: '', 
            ownerName: '',
            address: '',
            description: '', 
            latitude: defaultPosition.lat, 
            longitude: defaultPosition.lng,
            email: '', 
            phone: '', 
        });
        
        setDateJoined(null); 
        
        setMapPosition(defaultPosition);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            {/* MATCHES AddSiteModal width */}
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
                {/* Header (UPDATED TO MATCH SNIPPET) */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-800">Add New Prospect</h3>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        aria-label="Close modal"
                    >
                        {/* Using size prop based on the snippet's X size={20} */}
                        <X className="h-5 w-5" /> 
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* --- MAIN FORM GRID CONTAINER (Replicating AddSiteModal structure) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        
                        {/* SECTION 1: General Details Header */}
                        <div className="md:col-span-2 pb-2 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                                General Details
                            </h3>
                        </div>

                        {/* 1ST ROW: Prospect Name (FULL WIDTH) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prospect Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter prospect name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                        
                        {/* 2ND ROW, LEFT: Owner Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="ownerName" value={formData.ownerName} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter owner name"
                            />
                            {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
                        </div>

                        {/* 2ND ROW, RIGHT: Date Joined */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
                        
                        
                        {/* SECTION 2: Contact Details Header (Matching AddSiteModal structure) */}
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


                        {/* SECTION 3: Location Map (Spans 2 columns) */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-blue-600" />
                                Location Map
                            </h3>
                            {/* MATCHES AddSiteModal height */}
                            <div className="h-64 rounded-lg overflow-hidden border border-gray-300 shadow-md">
                                <LocationMap position={mapPosition} onLocationChange={handleLocationChange} />
                            </div>
                        </div>

                        {/* SECTION 4: Address (Spans 2 columns) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="address" value={formData.address} onChange={handleChange} rows={3}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Auto-filled from map or enter manually"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                        </div>
                        
                        {/* SECTION 5: Latitude & Longitude */}
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
                            {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>}
                        </div>
                        
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
                            {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>}
                        </div>

                        {/* SECTION 6: Description (Spans 2 columns) - ADDED to match AddSiteModal */}
                        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <DocumentTextIcon className="w-5 h-5 text-blue-600"/>
                                Description
                            </h3>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span> {/* Marked as required */}
                            </label>
                            <textarea
                                name="description" value={formData.description} onChange={handleChange} rows={4}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Provide a detailed description of the prospect (e.g., business type, size, interest level)"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

                    </div>
                    {/* --- END MAIN FORM GRID CONTAINER --- */}

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
                        <Button type="button" variant="ghost" onClick={handleClose} className="py-1.5 px-4 text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">Cancel</Button>
                        <Button type="submit" variant="primary" className="py-1.5 px-4 text-sm">Add Prospect</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProspectModal;
