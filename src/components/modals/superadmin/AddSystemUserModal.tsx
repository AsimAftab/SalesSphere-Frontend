import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../uix/dialog";
import CustomButton from "../../UI/Button/Button";
import { Input } from "../../uix/input";
import { Label } from "../../uix/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../uix/select";
import { UserPlus, Mail, User, AlertCircle, Shield, Phone } from "lucide-react";
import { Alert, AlertDescription } from "../../uix/alert";

interface AddSystemUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: {
    name: string;
    email: string;
    phone: string;
    role: "Super Admin" | "Developer";
    position: string;
  }) => void;
}

export function AddSystemUserModal({ isOpen, onClose, onAdd }: AddSystemUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as "Super Admin" | "Developer" | "",
    position: ""
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
      // Auto-set position based on role
      const position = formData.role ? positions[formData.role] : "Staff";

      onAdd({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as "Super Admin" | "Developer",
        position: position
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        position: ""
      });
      setErrors({});
      setIsSubmitting(false);
      onClose();
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-slate-900">Add System User</DialogTitle>
              <DialogDescription>
                Add a new super admin or developer to the system
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              A verification email with a temporary password will be sent to the user.
              They can complete their profile and change their password after verification.
            </AlertDescription>
          </Alert>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              Full Name *
            </Label>
            <Input
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
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="userEmail" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              Email Address *
            </Label>
            <Input
              id="userEmail"
              type="email"
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
              Phone Number *
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

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="userRole" className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              Role *
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

          {/* Info about optional fields */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              <p className="font-medium mb-1">Additional Profile Information</p>
              <p className="text-xs">
                The user will complete their profile (DOB, Gender, Photo, etc.)
                after email verification and first login.
              </p>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
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
