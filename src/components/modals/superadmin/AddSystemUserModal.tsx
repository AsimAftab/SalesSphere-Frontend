import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../ui/SuperadminComponents/dialog";
import { Mail, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/SuperadminComponents/alert";
import { Button as CustomButton, DatePicker } from '@/components/ui';

interface AddSystemUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: {
    name: string;
    email: string;
    phone: string;
    role: "superadmin" | "Developer";
    position: string;
    dob?: string;
    citizenship?: string;
    gender?: string;
    location?: string;
  }) => void;
}

export function AddSystemUserModal({ isOpen, onClose, onAdd }: AddSystemUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as "Super Admin" | "Developer" | "",
    position: "",
    dob: "",
    citizenship: "",
    gender: "Male",
    location: ""
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
    // Allow only letters, spaces, apostrophes, hyphens, and periods
    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email: string): boolean => {
    // Standard email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const roles = [
    {
      value: "Super Admin",
      label: "Super Admin",
      description: "Full system access and control"
    },
    {
      value: "Developer",
      label: "Developer",
      description: "Development and technical access"
    }
  ];

  const positions = {
    "Super Admin": "System Administrator",
    "Developer": "Software Developer"
  };

  const handleCitizenshipChange = (val: string) => {
    if (/^\d{0,14}$/.test(val)) {
      handleChange("citizenship", val);
    }
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

    // Optional field validations
    if (formData.citizenship && formData.citizenship.length < 14) {
      newErrors.citizenship = "Citizenship number must be 14 digits if provided";
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

    // Auto-set position based on role
    const position = formData.role ? positions[formData.role] : "Staff";

    // Call the onAdd callback with the data - parent will handle API call
    onAdd({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role as "superadmin" | "Developer",
      position: position,
      dob: formData.dob,
      citizenship: formData.citizenship,
      gender: formData.gender,
      location: formData.location
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      position: "",
      dob: "",
      citizenship: "",
      gender: "Male",
      location: ""
    });
    setErrors({});
    setIsSubmitting(false);
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] w-full max-h-[90vh] overflow-y-auto p-10">
        <DialogHeader className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-slate-900 text-2xl">Add System User</DialogTitle>
              <DialogDescription className="text-base">
                Add a new super admin or developer to the system
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              A verification email with a temporary password will be sent to the user.
              They can complete their profile and change their password after verification.
            </AlertDescription>
          </Alert>

          {/* Form Fields - Custom Row Layout */}
          <div className="space-y-6">
            {/* Row 1: Name only */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userName"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  // Validate name format
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
                className={`block w-full appearance-none rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                  errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Row 2: Email Address only */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="userEmail"
                placeholder="e.g., john.doe@salessphere.com"
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  // Sanitize email input
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
                className={`block w-full appearance-none rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                  errors.email ? 'border-red-500 ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Row 3: Phone Number and Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="userPhone"
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
                  maxLength={10}
                  className={`block w-full appearance-none rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                    errors.phone ? 'border-red-500 ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="userRole" className="block text-sm font-medium text-gray-600 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="userRole"
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  aria-label="Select user role"
                  className={`block w-full appearance-none rounded-lg border px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white ${
                    errors.role ? 'border-red-500 ring-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Row 4: Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date of Birth
                </label>
                <DatePicker
                  value={formData.dob ? new Date(formData.dob) : null}
                  onChange={(date) => handleChange("dob", date ? date.toLocaleDateString('en-CA') : '')}
                  placeholder="Select Date of Birth"
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="userGender" className="block text-sm font-medium text-gray-600 mb-1">
                  Gender
                </label>
                <select
                  id="userGender"
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  aria-label="Select gender"
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 5: Citizenship Number only */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Citizenship Number
              </label>
              <input
                type="text"
                id="userCitizenship"
                placeholder="14-digit citizenship number"
                value={formData.citizenship}
                onChange={(e) => handleCitizenshipChange(e.target.value)}
                maxLength={14}
                className={`block w-full appearance-none rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                  errors.citizenship ? 'border-red-500 ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors.citizenship && (
                <p className="text-red-500 text-xs mt-1">{errors.citizenship}</p>
              )}
            </div>

            {/* Row 6: Location only */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Location
              </label>
              <input
                type="text"
                id="userLocation"
                placeholder="Enter location address"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-gray-200">
            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-3 text-base"
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="px-8 py-3 text-base"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add System User
                </>
              )}
            </CustomButton>
          </div>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}
