import React, { useState, useCallback } from 'react';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { LocationMap } from '../../maps/LocationMap';
import toast from "react-hot-toast";
import CustomButton from "../../UI/Button/Button";
interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (organization: {
    name: string;
    address: string;
    owner: string;
    ownerEmail: string;
    phone: string;
    panVat: string;
    latitude: number;
    longitude: number;
    addressLink: string;
    status: "Active" | "Inactive";
    emailVerified: boolean;
    subscriptionStatus: "Active" | "Expired";
    subscriptionExpiry: string;
  }) => void;
}

export function AddOrganizationModal({ isOpen, onClose, onAdd }: AddOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    owner: "",
    ownerEmail: "",
    phone: "",
    panVat: "",
    latitude: 27.7172,
    longitude: 85.324,
  });

  const [mapPosition, setMapPosition] = useState({
    lat: 27.7172,
    lng: 85.324,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddressGeocoded = useCallback((address: string) => {
    setFormData(prev => ({
      ...prev,
      address: address,
    }));
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  }, [errors.address]);

  // Handle location change from map click
   const handleLocationChange = useCallback((location: { lat: number; lng: number }) => {
    setMapPosition(location); // Update map's center
    setFormData(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.owner.trim()) {
      newErrors.owner = "Owner name is required";
    }

    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = "Owner email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be 10 digits.";
    }

    // Validate latitude and longitude
    if (isNaN(Number(formData.latitude))) {
      newErrors.latitude = "Latitude must be a valid number";
    }

    if (isNaN(Number(formData.longitude))) {
      newErrors.longitude = "Longitude must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Calculate subscription expiry - default 1 month
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      onAdd({
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        addressLink: `https://maps.google.com/?q=${formData.latitude},${formData.longitude}`,
        status: "Inactive", // New organizations start inactive until email is verified
        emailVerified: false,
        subscriptionStatus: "Active",
        subscriptionExpiry: expiryDate.toISOString().split('T')[0]
      });

      toast.success(`Organization "${formData.name}" created successfully! Verification email sent to ${formData.ownerEmail}`);

      // Reset form
      setFormData({
        name: "",
        address: "",
        owner: "",
        ownerEmail: "",
        phone: "",
        panVat: "",
        latitude: 27.7172,
        longitude: 85.324,
      });
      setMapPosition({ lat: 27.7172, lng: 85.324 });
      setErrors({});
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      name: "",
      address: "",
      owner: "",
      ownerEmail: "",
      phone: "",
      panVat: "",
      latitude: 27.7172,
      longitude: 85.324,
    });
    setMapPosition({ lat: 27.7172, lng: 85.324 });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto z-[10000]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Add New Organization</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Organization Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.owner ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter owner name"
                />
                {errors.owner && (
                  <p className="mt-1 text-sm text-red-500">{errors.owner}</p>
                )}
              </div>

              {/* PAN/VAT Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN/VAT Number
                </label>
                <input
                  type="text"
                  name="panVat"
                  value={formData.panVat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter PAN/VAT number"
                />
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.ownerEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter owner email"
                />
                {errors.ownerEmail && (
                  <p className="mt-1 text-sm text-red-500">{errors.ownerEmail}</p>
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
            <div className="mb-6 h-80 md:h-96 w-full">
              <LocationMap
                position={mapPosition}
                onLocationChange={handleLocationChange}
                onAddressGeocoded={handleAddressGeocoded}
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
                <label htmlFor="googleMapsLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps Link
                </label>
                <input
                  id="googleMapsLink"
                  type="text"
                  value={`https://maps.google.com/?q=${formData.latitude},${formData.longitude}`}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  aria-label="Google Maps link (read-only)"
                />
                <p className="mt-1 text-xs text-gray-500">Auto-generated from coordinates</p>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => handleClose}
            disabled={isSubmitting}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
             disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Adding..." : "Add Organization"}
            </CustomButton>
        </div>
        </form>
      </div>
    </div>
  );
}
