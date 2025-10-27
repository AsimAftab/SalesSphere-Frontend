import React, { useState, useEffect } from 'react';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { LocationPickerModal } from '../superadmin/LocationPickerModal';
import { toast } from "sonner";
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import Button from '../../../components/UI/Button/Button';
import { getAllOrganizations } from '../../../api/services/superadmin/organizationService';
import { useModalClose } from '../../../hooks/useModalClose';

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
    gender: "Male" | "Female" | "Other";
    latitude: number;
    longitude: number;
    addressLink: string;
    status: "Active" | "Inactive";
    emailVerified: boolean;
    subscriptionStatus: "Active" | "Expired";
    subscriptionExpiry: string;
    dateOfJoining: string;
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
    gender: "Male" as "Male" | "Female" | "Other",
    latitude: 27.7172,
    longitude: 85.324,
    dateOfJoining: new Date().toISOString().split('T')[0],
    subscriptionDuration: 6,
  });

  const [isLocationPickerOpen, setLocationPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingOrganizations, setExistingOrganizations] = useState<any[]>([]);

  // Load existing organizations for duplicate checking
  useEffect(() => {
    if (isOpen) {
      getAllOrganizations().then(orgs => setExistingOrganizations(orgs)).catch(() => {});
    }
  }, [isOpen]);

  const handleClose = () => {
    setFormData({
      name: "",
      address: "",
      owner: "",
      ownerEmail: "",
      phone: "",
      panVat: "",
      gender: "Male" as "Male" | "Female" | "Other",
      latitude: 27.7172,
      longitude: 85.324,
      dateOfJoining: new Date().toISOString().split('T')[0],
      subscriptionDuration: 6,
    });
    setErrors({});
    onClose();
  };

  // Use modal close hook for ESC key and backdrop click
  const { handleBackdropClick } = useModalClose(isOpen, handleClose);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
    }));
    setLocationPickerOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle phone number - only numeric, max 10 digits
    if (name === 'phone') {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 10) {
            setFormData(prev => ({
                ...prev,
                phone: numericValue
            }));
        }
    }
    // Handle organization name - letters, numbers, spaces, and common symbols only
    else if (name === 'name') {
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s&.,'-]/g, '');
        if (sanitizedValue.length <= 100) {
            setFormData(prev => ({
                ...prev,
                name: sanitizedValue
            }));
        }
    }
    // Handle owner name - letters, spaces, dots, and hyphens only
    else if (name === 'owner') {
        const sanitizedValue = value.replace(/[^a-zA-Z\s.'-]/g, '');
        if (sanitizedValue.length <= 100) {
            setFormData(prev => ({
                ...prev,
                owner: sanitizedValue
            }));
        }
    }
    // Handle PAN/VAT - alphanumeric only
    else if (name === 'panVat') {
        const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (sanitizedValue.length <= 14) {
            setFormData(prev => ({
                ...prev,
                panVat: sanitizedValue
            }));
        }
    }
    // Handle email - convert to lowercase
    else if (name === 'ownerEmail') {
        setFormData(prev => ({
            ...prev,
            ownerEmail: value.toLowerCase().trim()
        }));
    }
    else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        dateOfJoining: date.toISOString().split('T')[0],
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Organization Name Validation
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = "Organization name is required";
    } else if (trimmedName.length < 3) {
      newErrors.name = "Organization name must be at least 3 characters long";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Organization name must not exceed 100 characters";
    } else if (!/^[a-zA-Z0-9\s&.,'-]+$/.test(trimmedName)) {
      newErrors.name = "Organization name contains invalid characters";
    } else {
      // Check for duplicate organization name
      const isDuplicateName = existingOrganizations.some(
        org => org.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (isDuplicateName) {
        newErrors.name = "An organization with this name already exists";
      }
    }

    // Address Validation
    const trimmedAddress = formData.address.trim();
    if (!trimmedAddress) {
      newErrors.address = "Address is required";
    } else if (trimmedAddress.length < 10) {
      newErrors.address = "Please provide a complete address (minimum 10 characters)";
    }

    // Owner Name Validation
    const trimmedOwner = formData.owner.trim();
    if (!trimmedOwner) {
      newErrors.owner = "Owner name is required";
    } else if (trimmedOwner.length < 3) {
      newErrors.owner = "Owner name must be at least 3 characters long";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedOwner)) {
      newErrors.owner = "Owner name should only contain letters, spaces, dots, hyphens, and apostrophes";
    } else if (/\d/.test(trimmedOwner)) {
      newErrors.owner = "Owner name cannot contain numbers";
    }

    // Email Validation
    const trimmedEmail = formData.ownerEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      newErrors.ownerEmail = "Owner email is required";
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmedEmail)) {
      newErrors.ownerEmail = "Please enter a valid email address";
    } else if (trimmedEmail.length > 100) {
      newErrors.ownerEmail = "Email address is too long";
    } else {
      // Check for duplicate email
      const isDuplicateEmail = existingOrganizations.some(
        org => org.ownerEmail.toLowerCase() === trimmedEmail
      );
      if (isDuplicateEmail) {
        newErrors.ownerEmail = "This email is already associated with another organization";
      }
    }

    // Phone Number Validation
    const trimmedPhone = formData.phone.trim();
    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(trimmedPhone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    } else if (/^0+$/.test(trimmedPhone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // PAN/VAT Validation (optional but if provided must be valid)
    const trimmedPanVat = formData.panVat.trim();
    if (trimmedPanVat) {
      if (trimmedPanVat.length < 9 || trimmedPanVat.length > 14) {
        newErrors.panVat = "PAN/VAT must be between 9 and 14 characters";
      } else if (!/^[A-Z0-9]+$/.test(trimmedPanVat)) {
        newErrors.panVat = "PAN/VAT must contain only uppercase letters and numbers";
      }
    }

    // Gender Validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    } else if (!["Male", "Female", "Other"].includes(formData.gender)) {
      newErrors.gender = "Please select a valid gender option";
    }

    // Date of Joining Validation
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Date of joining is required";
    } else {
      const joiningDate = new Date(formData.dateOfJoining);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(today.getMonth() + 1);

      if (joiningDate > oneMonthFromNow) {
        newErrors.dateOfJoining = "Date of joining cannot be more than 1 month in the future";
      } else if (joiningDate < oneYearAgo) {
        newErrors.dateOfJoining = "Date of joining cannot be more than 1 year in the past";
      }
    }

    // Location Validation
    if (isNaN(Number(formData.latitude)) || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = "Invalid latitude value (must be between -90 and 90)";
    }

    if (isNaN(Number(formData.longitude)) || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = "Invalid longitude value (must be between -180 and 180)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form", {
        description: "Check all required fields and correct any validation errors"
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const expiryDate = new Date(formData.dateOfJoining);
      expiryDate.setMonth(expiryDate.getMonth() + Number(formData.subscriptionDuration));

      // Trim and clean all string values before submission
      const cleanedData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        owner: formData.owner.trim(),
        ownerEmail: formData.ownerEmail.trim().toLowerCase(),
        phone: formData.phone.trim(),
        panVat: formData.panVat.trim().toUpperCase(),
        gender: formData.gender,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        addressLink: `https://maps.google.com/?q=${formData.latitude},${formData.longitude}`,
        status: "Inactive" as const,
        emailVerified: false,
        subscriptionStatus: "Active" as const,
        subscriptionExpiry: expiryDate.toISOString().split('T')[0],
        dateOfJoining: formData.dateOfJoining
      };

      onAdd(cleanedData);

      toast.success(`Organization "${cleanedData.name}" created successfully!`, {
        description: `Verification email sent to ${cleanedData.ownerEmail}`
      });

      // Reset form
      setFormData({
        name: "",
        address: "",
        owner: "",
        ownerEmail: "",
        phone: "",
        panVat: "",
        gender: "Male" as "Male" | "Female" | "Other",
        latitude: 27.7172,
        longitude: 85.324,
        dateOfJoining: new Date().toISOString().split('T')[0],
        subscriptionDuration: 6,
      });
      setErrors({});
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{ zIndex: 9999 }}
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-800">Add New Organization</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter organization name (min 3 characters)"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.name ? (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Only letters, numbers, spaces, and symbols (&.,'-) allowed</p>
                    )}
                    <span className="text-xs text-gray-400">{formData.name.length}/100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    maxLength={100}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.owner ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter owner name (min 3 characters)"
                  />
                  {errors.owner ? (
                    <p className="mt-1 text-sm text-red-500">{errors.owner}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Letters, spaces, dots, hyphens, and apostrophes only</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN/VAT Number <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="panVat"
                    value={formData.panVat}
                    onChange={handleChange}
                    maxLength={14}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
                      errors.panVat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter PAN/VAT number (9-14 chars)"
                  />
                  {errors.panVat ? (
                    <p className="mt-1 text-sm text-red-500">{errors.panVat}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Alphanumeric only, 9-14 characters</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={new Date(formData.dateOfJoining)}
                    onChange={handleDateChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateOfJoining ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfJoining && (
                    <p className="mt-1 text-sm text-red-500">{errors.dateOfJoining}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subscriptionDuration"
                    value={formData.subscriptionDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    pattern="\d{10}"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit phone number"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.phone ? (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Exactly 10 digits required</p>
                    )}
                    <span className="text-xs text-gray-400">{formData.phone.length}/10</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    maxLength={100}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent lowercase ${
                      errors.ownerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter owner email"
                  />
                  {errors.ownerEmail ? (
                    <p className="mt-1 text-sm text-red-500">{errors.ownerEmail}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Valid email address required</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                Location Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onClick={() => setLocationPickerOpen(true)}
                    readOnly
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Click to select location from map"
                  />
                  {errors.address ? (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Click to select location from map (min 10 characters)</p>
                  )}
                </div>

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
                      readOnly
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 ${
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
                      readOnly
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 ${
                        errors.longitude ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Auto-filled from map"
                    />
                    {errors.longitude && (
                      <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps Link
                  </label>
                  <input
                    type="text"
                    value={`https://maps.google.com/?q=${formData.latitude},${formData.longitude}`}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Auto-generated from coordinates</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Organization"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}

