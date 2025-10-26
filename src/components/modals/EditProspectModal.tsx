import React, { useState, useEffect } from 'react';
import { 
    XMarkIcon as X, 
    MapPinIcon, 
    UserIcon, 
    PhoneIcon, 
    DocumentTextIcon, 
    CalendarDaysIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { type Prospect } from '../../api/prospectService'; 
import { LocationMap } from '../maps/LocationMap'; 
import Button from '../UI/Button/Button'; 
import DatePicker from '../UI/DatePicker/DatePicker'; 

interface EditProspectModalProps {
    prospect: Prospect;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProspect: Partial<Prospect>) => void;
}

// Custom interface mirroring Prospect but making coordinates and date string explicit
interface EditProspectFormData {
    name: string;
    ownerName: string;
    dateJoined: string;
    address: string;
    description: string;
    latitude: number;
    longitude: number;
    email: string;
    phone: string;
}

const EditProspectModal: React.FC<EditProspectModalProps> = ({ prospect, isOpen, onClose, onSave }) => {
    
    // Initialize formData from prospect prop
    const [formData, setFormData] = useState<EditProspectFormData>({
        name: prospect.name,
        ownerName: prospect.ownerName,
        dateJoined: prospect.dateJoined, 
        address: prospect.address,
        description: prospect.description,
        latitude: prospect.latitude || 27.7172,
        longitude: prospect.longitude || 85.324,
        email: prospect.email || '', 
        phone: prospect.phone || '', 
    });

    // New state to manage the Date object required by DatePicker component
    const [dateJoinedState, setDateJoinedState] = useState<Date | null>(null); 

    // Initialize mapPosition from prospect prop
    const [mapPosition, setMapPosition] = useState({
        lat: prospect.latitude || 27.7172,
        lng: prospect.longitude || 85.324,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form data when modal is opened or prospect changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: prospect.name,
                ownerName: prospect.ownerName,
                dateJoined: prospect.dateJoined,
                address: prospect.address,
                description: prospect.description,
                latitude: prospect.latitude || 27.7172,
                longitude: prospect.longitude || 85.324,
                email: prospect.email || '',
                phone: prospect.phone || '',
            });

            // Initialize Date object for DatePicker
            const dateStr = prospect.dateJoined.split('T')[0];
            const initialDate = dateStr ? new Date(dateStr + 'T00:00:00') : null;
            setDateJoinedState(initialDate); 
            
            setMapPosition({
                lat: prospect.latitude || 27.7172,
                lng: prospect.longitude || 85.324,
            });
            setErrors({});
        }
    }, [isOpen, prospect]);

    // Reverse geocode to get address from coordinates
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();

            if (data && data.display_name) {
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

    // Handle form field changes for non-date fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;

        // Restrict phone number to 10 digits and only numbers
        if (name === 'phone') {
            value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            if (value.length > 10) {
                value = value.slice(0, 10); // Enforce 10 digit limit
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value as any
        }));

        // Update map position if latitude or longitude changes manually
        if (name === 'latitude' || name === 'longitude') {
            const lat = name === 'latitude' ? parseFloat(value) : Number(formData.latitude);
            const lng = name === 'longitude' ? parseFloat(value) : Number(formData.longitude);

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

    // Handler for DatePicker
    const handleDateChange = (date: Date | null) => {
        setDateJoinedState(date);
        
        // Format the date back to a YYYY-MM-DD string for internal formData consistency
        let formattedDate = '';
        if (date) {
            formattedDate = date.toLocaleDateString('en-CA', { 
                year: 'numeric', month: '2-digit', day: '2-digit' 
            }).replace(/\//g, '-'); 
        }

        setFormData(prev => ({ ...prev, dateJoined: formattedDate }));

        if (errors.dateJoined) {
            setErrors(prev => ({ ...prev, dateJoined: '' }));
        }
    };

    // Validate form data
    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Prospect name is required';
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        
        if (!formData.dateJoined.trim()) {
            newErrors.dateJoined = 'Date joined is required';
        } else if (isNaN(new Date(formData.dateJoined).getTime())) {
            newErrors.dateJoined = 'Invalid date format';
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        // Phone number is required
        if (!formData.phone.trim()) { 
             newErrors.phone = 'Phone number is required';
        } else if (formData.phone.length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        // Email is optional, but validate if present
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Validate latitude and longitude
        if (isNaN(Number(formData.latitude))) newErrors.latitude = 'Latitude must be a valid number';
        if (isNaN(Number(formData.longitude))) newErrors.longitude = 'Longitude must be a valid number';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // Convert latitude and longitude to numbers before saving
        const updatedProspect: Partial<Prospect> = {
            ...formData,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
        };

        onSave(updatedProspect);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
                {/* Header (UPDATED TO MATCH SNIPPET) */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-800">Edit Prospect</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                        aria-label="Close modal"
                    >
                        {/* Using size prop based on the snippet's X size={20} */}
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
                                <UserIcon className="w-5 h-5 text-blue-600" />
                                General Details
                            </h3>
                        </div>

                        {/* Prospect Name (Full Width) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prospect Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter prospect name"
                            />
                            {errors.name && (<p className="mt-1 text-sm text-red-500">{errors.name}</p>)}
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

                        {/* Date Joined (Now using DatePicker) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <CalendarDaysIcon className="w-4 h-4 text-gray-500"/>
                                Date Joined <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                                value={dateJoinedState} // Use the Date object state
                                onChange={handleDateChange} // Use the new handler
                                placeholder="YYYY-MM-DD"
                            />
                            {errors.dateJoined && (<p className="text-red-500 text-sm mt-1">{errors.dateJoined}</p>)}
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

                        {/* Address (Spans 2 columns) */}
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
                                placeholder="Provide a detailed description of the prospect (e.g., business type, size, interest level)"
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

export default EditProspectModal;