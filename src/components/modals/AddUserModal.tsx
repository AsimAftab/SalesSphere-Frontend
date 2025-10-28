import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../uix/dialog";
import CustomButton from "../UI/Button/Button";
import { Input } from "../uix/input";
import { Label } from "../uix/label";
import { Textarea } from "../uix/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../uix/select";
import { UserPlus, Mail, User, AlertCircle, Shield, Phone, MapPin, Calendar, CreditCard, IdCard } from "lucide-react";
import { Alert, AlertDescription } from "../uix/alert";
import { LocationMap } from "../maps/LocationMap";
import DatePicker from "../UI/DatePicker/DatePicker";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: {
    name: string;
    email: string;
    phone: string;
    role: "Owner" | "Manager" | "Admin" | "Sales Rep";
    dob: string;
    gender: "Male" | "Female" | "Other";
    citizenshipNumber: string;
    panNumber: string;
    address: string;
    latitude: number;
    longitude: number;
    emailVerified: boolean;
    isActive: boolean;
  }) => void;
  organizationName: string;
}

export function AddUserModal({ isOpen, onClose, onAdd, organizationName }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as "Owner" | "Manager" | "Admin" | "Sales Rep" | "",
    dob: null as Date | null,
    gender: "" as "Male" | "Female" | "Other" | "",
    citizenshipNumber: "",
    panNumber: "",
    address: "",
    latitude: 27.7172,
    longitude: 85.324
  });

  const [mapPosition, setMapPosition] = useState({
    lat: 27.7172,
    lng: 85.324,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input validation and sanitization functions
  const sanitizeInput = (input: string): string => {
    // Remove SQL injection patterns and dangerous characters
    const dangerous = /['";\\<>{}()=]/g;
    return input.replace(dangerous, '');
  };

  const validateName = (name: string): boolean => {
    // Allow only letters, spaces, apostrophes (for names like O'Brien), hyphens, and periods
    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email: string): boolean => {
    // Standard email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePanNumber = (pan: string): boolean => {
    // Allow only digits, max 14 characters
    const panRegex = /^\d{0,14}$/;
    return panRegex.test(pan);
  };

  const validateCitizenshipNumber = (citizenship: string): boolean => {
    // Allow only alphanumeric characters and hyphens, max 20 characters
    const citizenshipRegex = /^[a-zA-Z0-9-]{0,20}$/;
    return citizenshipRegex.test(citizenship);
  };

  const validateAge = (dob: Date | null): boolean => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }

    return age >= 18;
  };

  const roles = [
    { value: "Admin", label: "Admin", description: "Full access to organization settings" },
    { value: "Manager", label: "Manager", description: "Manage teams and view reports" },
    { value: "Sales Rep", label: "Sales Rep", description: "Basic sales access" }
  ];

  const genders = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!validateName(formData.name)) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and periods";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (!validateAge(formData.dob)) {
      newErrors.dob = "User must be at least 18 years old";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.citizenshipNumber.trim()) {
      newErrors.citizenshipNumber = "Citizenship number is required";
    } else if (!validateCitizenshipNumber(formData.citizenshipNumber)) {
      newErrors.citizenshipNumber = "Citizenship number can only contain alphanumeric characters and hyphens (max 20)";
    }

    if (formData.panNumber && !validatePanNumber(formData.panNumber)) {
      newErrors.panNumber = "PAN number can only contain digits (max 14)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (isNaN(Number(formData.latitude))) {
      newErrors.latitude = "Latitude must be a valid number";
    }

    if (isNaN(Number(formData.longitude))) {
      newErrors.longitude = "Longitude must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onAdd({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as "Owner" | "Manager" | "Admin" | "Sales Rep",
        dob: formData.dob ? formData.dob.toISOString().split('T')[0] : "",
        gender: formData.gender as "Male" | "Female" | "Other",
        citizenshipNumber: formData.citizenshipNumber,
        panNumber: formData.panNumber,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        emailVerified: false,
        isActive: true
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        dob: null,
        gender: "",
        citizenshipNumber: "",
        panNumber: "",
        address: "",
        latitude: 27.7172,
        longitude: 85.324
      });
      setMapPosition({ lat: 27.7172, lng: 85.324 });
      setErrors({});
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[90vw] !max-w-[90vw] !h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-slate-900">Add New User</DialogTitle>
              <DialogDescription>
                Add a user to {organizationName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4 overflow-y-auto flex-1">
          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              A verification email will be sent to the user. Once they verify their email,
              they will automatically receive a default password to access the system.
            </AlertDescription>
          </Alert>

          {/* Personal Information Section */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userName"
                  placeholder="e.g., Sarah Mitchell"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || validateName(value)) {
                      const sanitized = sanitizeInput(value);
                      setFormData(prev => ({ ...prev, name: sanitized }));
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.name;
                        return newErrors;
                      });
                    } else {
                      setErrors(prev => ({ ...prev, name: "Name can only contain letters, spaces, hyphens, and periods" }));
                    }
                  }}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="userDob" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  value={formData.dob}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, dob: date }));
                    if (errors.dob) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.dob;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="Select date of birth"
                  className={errors.dob ? "border-red-500" : ""}
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dob}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="userGender" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange("gender", value)}
                >
                  <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Citizenship Number */}
              <div className="space-y-2">
                <Label htmlFor="userCitizenship" className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-slate-500" />
                  Citizenship Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userCitizenship"
                  placeholder="Enter citizenship number"
                  value={formData.citizenshipNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || validateCitizenshipNumber(value)) {
                      setFormData(prev => ({ ...prev, citizenshipNumber: value }));
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.citizenshipNumber;
                        return newErrors;
                      });
                    } else {
                      setErrors(prev => ({ ...prev, citizenshipNumber: "Citizenship number can only contain alphanumeric characters and hyphens (max 20)" }));
                    }
                  }}
                  className={errors.citizenshipNumber ? "border-red-500" : ""}
                  maxLength={20}
                />
                {errors.citizenshipNumber && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.citizenshipNumber}
                  </p>
                )}
              </div>

              {/* PAN Number */}
              <div className="space-y-2">
                <Label htmlFor="userPan" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  PAN Number
                </Label>
                <Input
                  id="userPan"
                  placeholder="Enter PAN number"
                  value={formData.panNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || validatePanNumber(value)) {
                      setFormData(prev => ({ ...prev, panNumber: value }));
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.panNumber;
                        return newErrors;
                      });
                    } else {
                      setErrors(prev => ({ ...prev, panNumber: "PAN number can only contain digits (max 14)" }));
                    }
                  }}
                  className={errors.panNumber ? "border-red-500" : ""}
                  maxLength={14}
                />
                {errors.panNumber && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.panNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="userEmail" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="e.g., sarah.mitchell@company.com"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    const sanitized = sanitizeInput(value);
                    setFormData(prev => ({ ...prev, email: sanitized }));
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.email;
                      return newErrors;
                    });
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value && !validateEmail(value)) {
                      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
                    }
                  }}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="userPhone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userPhone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '');
                    if (numericValue.length <= 10) {
                      setFormData(prev => ({ ...prev, phone: numericValue }));
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.phone;
                        return newErrors;
                      });
                    }
                  }}
                  className={errors.phone ? "border-red-500" : ""}
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Role Section */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">Role & Permissions</h4>
            <div className="space-y-2">
              <Label htmlFor="userRole" className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col items-start">
                        <span>{role.label}</span>
                        <span className="text-xs text-slate-500">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.role}
                </p>
              )}
            </div>
          </div>

          {/* Location Information Section */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location Information
            </h4>

            {/* Interactive Map */}
            <div className="mb-4">
              <LocationMap
                position={mapPosition}
                onLocationChange={handleLocationChange}
              />
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              {/* Address */}
              <div>
                <Label htmlFor="userAddress" className="text-sm font-medium mb-2 block">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="userAddress"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, address: e.target.value }));
                    if (errors.address) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.address;
                        return newErrors;
                      });
                    }
                  }}
                  rows={3}
                  className={errors.address ? "border-red-500" : ""}
                  placeholder="Auto-filled from map or enter manually"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Latitude & Longitude */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userLatitude" className="text-sm font-medium mb-2 block">
                    Latitude <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="userLatitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => {
                      const lat = parseFloat(e.target.value);
                      setFormData(prev => ({ ...prev, latitude: lat }));
                      if (!isNaN(lat)) {
                        setMapPosition({ lat, lng: formData.longitude });
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.latitude;
                          return newErrors;
                        });
                      }
                    }}
                    className={errors.latitude ? "border-red-500" : ""}
                    placeholder="Auto-filled from map"
                  />
                  {errors.latitude && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.latitude}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="userLongitude" className="text-sm font-medium mb-2 block">
                    Longitude <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="userLongitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => {
                      const lng = parseFloat(e.target.value);
                      setFormData(prev => ({ ...prev, longitude: lng }));
                      if (!isNaN(lng)) {
                        setMapPosition({ lat: formData.latitude, lng });
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.longitude;
                          return newErrors;
                        });
                      }
                    }}
                    className={errors.longitude ? "border-red-500" : ""}
                    placeholder="Auto-filled from map"
                  />
                  {errors.longitude && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.longitude}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0">
          <CustomButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="button"
            variant="primary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </>
            )}
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
