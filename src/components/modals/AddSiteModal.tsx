import React, { useState } from 'react';
import { 
    XMarkIcon, 
    MapPinIcon, 
    UserIcon, 
    PhoneIcon, 
    DocumentTextIcon, 
    GlobeAltIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { LocationMap } from '../maps/LocationMap'; 
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker'; 
import { type NewSiteData } from '../../api/siteService'; 

interface AddSiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newSite: NewSiteData) => void;
}

// --- SITE FORM DATA STRUCTURE ---
interface SiteFormData {
    name: string;
    ownerName: string;
    address: string;
    description: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
}
// ---

const AddSiteModal: React.FC<AddSiteModalProps> = ({ isOpen, onClose, onSave }) => {
    
    const defaultPosition = { lat: 27.7172, lng: 85.324 };

    const [formData, setFormData] = useState<SiteFormData>({
        name: '',
        ownerName: '', 
        address: '',
        description: '', 
        phone: '',
        email: '',
        latitude: defaultPosition.lat,
        longitude: defaultPosition.lng,
    });

    // 💡 CHANGED state name from dateCreated to dateJoined
    const [dateJoined, setDateJoined] = useState<Date | null>(null);

    const [mapPosition, setMapPosition] = useState(defaultPosition);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
            const data = await response.json();
            if (data && data.display_name) {
                setFormData(prev => ({
                    ...prev,
                    address: data.display_name,
                    latitude: lat,
                    longitude: lng,
                }));
            }
        } catch (error) { console.error('Error reverse geocoding:', error); }
    };

    const handleLocationChange = (location: { lat: number; lng: number }) => {
        setMapPosition(location);
        reverseGeocode(location.lat, location.lng);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'latitude' || name === 'longitude') {
             setFormData(prev => ({ ...prev, [name]: value as any })); 

             const lat = name === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude as any);
             const lng = name === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude as any);
             
             if (!isNaN(lat) && !isNaN(lng)) {
                 setMapPosition({ lat, lng });
             }

        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // 💡 CHANGED function name and uses dateJoined
    const handleDateChange = (date: Date | null) => {
        setDateJoined(date);
        if (errors.dateJoined) {
            setErrors(prev => ({ ...prev, dateJoined: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) newErrors.name = 'Site name is required';
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        if (!dateJoined) newErrors.dateJoined = 'Date joined is required'; 
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Valid email is required if provided';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        
        if (isNaN(Number(formData.latitude))) newErrors.latitude = 'Latitude must be a valid number';
        if (isNaN(Number(formData.longitude))) newErrors.longitude = 'Longitude must be a valid number';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // 💡 Formats dateJoined
        const formattedDate = dateJoined!.toLocaleDateString('en-CA', { 
            year: 'numeric', month: '2-digit', day: '2-digit' 
        }).replace(/\//g, '-'); 
        
        const newSite: NewSiteData = {
            name: formData.name,
            ownerName: formData.ownerName, 
            dateJoined: formattedDate, 
            address: formData.address,
            description: formData.description, 
            phone: formData.phone, 
            email: formData.email, 
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
        };

        onSave(newSite);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: '', ownerName: '', address: '', description: '', phone: '', email: '',
            latitude: defaultPosition.lat, longitude: defaultPosition.lng,
        });
        // 💡 CLEARED dateJoined state
        setDateJoined(null); 
        setMapPosition(defaultPosition);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
                {/* Header */}
                <div className="flex items-center justify-between py-2 px-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Site</h2>
                    <Button type="button" onClick={handleClose} className="bg-transparent p-1 rounded-full hover:bg-red-100">
                        <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-red-500" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    
                    {/* --- MAIN FORM GRID CONTAINER --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        
                        {/* SECTION 1: General Details Header (Spans 2 columns) */}
                        <div className="md:col-span-2 pb-2 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                                General Details
                            </h3>
                        </div>

                        {/* 1ST ROW: Site Name (FULL WIDTH) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., Main Warehouse"
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
                                placeholder="Enter site owner/manager name"
                            />
                            {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
                        </div>

                        {/* 2ND ROW, RIGHT: Date Joined */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <CalendarDaysIcon className="w-4 h-4 text-gray-500"/>
                                Date Joined <span className="text-red-500">*</span> {/* 💡 CHANGED label */}
                            </label>
                            <DatePicker
                                value={dateJoined}
                                onChange={handleDateChange}
                                placeholder="YYYY-MM-DD"
                            />
                            {errors.dateJoined && <p className="text-red-500 text-sm mt-1">{errors.dateJoined}</p>} {/* 💡 CHANGED error key */}
                        </div>


                        {/* SECTION 2: Contact Details Header (Spans 2 columns, with top margin) */}
                        <div className="md:col-span-2 pt-4 pb-2 mt-4 border-t border-b border-gray-200">
                             <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                 <PhoneIcon className="w-5 h-5 text-blue-600" />
                                 Contact Details
                             </h3>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone <span className="text-red-500">*</span></label>
                            <input
                                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter phone number"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="contact@site.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* SECTION 3: Location Map (Spans 2 columns) */}
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-blue-600" />
                                Location Map
                            </h3>
                            {/* Reduced map height from h-80 to h-64 */}
                            <div className="h-64 rounded-lg overflow-hidden border border-gray-300 shadow-md">
                                <LocationMap position={mapPosition} onLocationChange={handleLocationChange} />
                            </div>
                        </div>

                        {/* SECTION 4: Address (Spans 2 columns) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Address <span className="text-red-500">*</span>
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

                        {/* SECTION 6: Description (Spans 2 columns) */}
                        <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                 <DocumentTextIcon className="w-5 h-5 text-blue-600"/>
                                 Description <span className="text-red-500">*</span>
                             </h3>
                            <textarea
                                name="description" value={formData.description} onChange={handleChange} rows={4}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Provide a detailed description of the site (e.g., regional hub, inventory capacity, specialized equipment)"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

                    </div>
                    {/* --- END MAIN FORM GRID CONTAINER --- */}

                    {/* Footer Buttons (REDUCED HEIGHT) */}
                    <div className="flex items-center justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
                        <Button type="button" variant="ghost" onClick={handleClose} className="py-1.5 px-4 text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">Cancel</Button>
                        <Button type="submit" variant="primary" className="py-1.5 px-4 text-sm">Add Prospect</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSiteModal;





