import React, { useState, useEffect } from 'react';
import {
  XMarkIcon as X,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  IdentificationIcon,
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
  onSave: (updatedData: EditEntityData) => Promise<void>;
  initialData: EditEntityData;
  title: string;
  nameLabel: string;
  ownerLabel: string;
  panVatMode: 'required' | 'optional' | 'hidden';
  descriptionMode: 'required' | 'hidden' | 'optional';
}

interface FormData {
  name: string;
  ownerName: string;
  dateJoined: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  panVat: string;
}

// --- Date Formatting Function ---
const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'N/A';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return dateString;
  }
};
// ---

const EditEntityModal: React.FC<EditEntityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  nameLabel,
  ownerLabel,
  panVatMode,
  descriptionMode,
}) => {
  const defaultPosition = { lat: 27.7172, lng: 85.324 };

  const mapInitialToFormData = (data: EditEntityData): FormData => ({
    name: data.name ?? '',
    ownerName: data.ownerName ?? '',
    dateJoined: data.dateJoined ?? '',
    address: data.address ?? '',
    description: data.description ?? '',
    latitude: data.latitude ?? defaultPosition.lat,
    longitude: data.longitude ?? defaultPosition.lng,
    email: data.email ?? '',
    phone: (data.phone ?? '').replace(/[^0-9]/g, ''),
    panVat: data.panVat ?? '',
  });

  const [formData, setFormData] = useState<FormData>(mapInitialToFormData(initialData));
  const [mapPosition, setMapPosition] = useState(defaultPosition);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const mapped = mapInitialToFormData(initialData);
      setFormData(mapped);
      setMapPosition({ lat: mapped.latitude, lng: mapped.longitude });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleMapSync = (location: { lat: number; lng: number }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));
    setMapPosition(location);
  };

  const handleAddressSync = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;

    if (name === 'phone') value = value.replace(/[^0-9]/g, '').slice(0, 10);
    if (name === 'panVat') value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 14);

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = `${nameLabel} is required`;
    if (!formData.ownerName.trim()) newErrors.ownerName = `${ownerLabel} is required`;
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (panVatMode === 'required' && !formData.panVat.trim())
      newErrors.panVat = 'PAN/VAT number is required';
    else if (formData.panVat.trim() && formData.panVat.length > 14)
      newErrors.panVat = 'PAN/VAT must be 14 characters or less';

    if (descriptionMode === 'required' && !formData.description.trim())
      newErrors.description = 'Description is required';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (formData.phone.length !== 10) newErrors.phone = 'Phone number must be 10 digits';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';

    if (isNaN(Number(formData.latitude))) newErrors.latitude = 'Invalid latitude';
    if (isNaN(Number(formData.longitude))) newErrors.longitude = 'Invalid longitude';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedData: EditEntityData = {
      ...formData,
      dateJoined: formData.dateJoined,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    await onSave(updatedData);
    onClose();
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
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            {/* --- Section 1: General Details --- */}
            <div className="md:col-span-2 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-600" />
                General Details
              </h3>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {nameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Enter ${nameLabel.toLowerCase()}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ownerLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.ownerName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
            </div>

            {/* Date Joined (display only) */}
            {/* --- FIX: Removed md:col-span-2 --- */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                Date Joined
              </label>
              <p className={readOnlyFieldClass}>
                {formatDate(formData.dateJoined)}
              </p>
            </div>

            {/* PAN/VAT */}
            {panVatMode !== 'hidden' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <IdentificationIcon className="w-4 h-4 text-gray-500" />
                  PAN/VAT Number
                  {panVatMode === 'required' && <span className="text-red-500">*</span>}
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
                />
                {errors.panVat && <p className="text-red-500 text-sm mt-1">{errors.panVat}</p>}
              </div>
            )}

            {/* --- Section 2: Contact Details --- */}
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
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* --- Section 3: Map + Address --- */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                Location Map
              </h3>
              <div className="h-72 rounded-lg"
                style={{ pointerEvents: 'auto' }}>
                <LocationMap
                  position={mapPosition}
                  onLocationChange={handleMapSync}
                  onAddressGeocoded={handleAddressSync}
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <p
                className={`${readOnlyFieldClass} min-h-[78px]`}
              >
                {formData.address || 'N/A'}
              </p>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Lat/Long (readonly) */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <GlobeAltIcon className="w-4 h-4 text-gray-500" /> Latitude
              </label>
              <p className={readOnlyFieldClass}>
                {formData.latitude}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <GlobeAltIcon className="w-4 h-4 text-gray-500" /> Longitude
              </label>
              <p className={readOnlyFieldClass}>
                {formData.longitude}
              </p>
            </div>

            {/* Description */}
            {descriptionMode !== 'hidden' && (
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" /> Description
                </h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="py-1.5 px-4 text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="py-1.5 px-4 text-sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntityModal;