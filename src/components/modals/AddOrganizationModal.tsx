import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Building2, Mail, MapPin, Link as LinkIcon, Map, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { toast } from "sonner";

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (organization: {
    name: string;
    address: string;
    owner: string;
    ownerEmail: string;
    mapVersion: string;
    addressLink: string;
    status: "Active" | "Inactive";
    emailVerified: boolean;
    subscriptionStatus: "Active" | "Expired" | "Trial";
    subscriptionExpiry: string;
  }) => void;
}

export function AddOrganizationModal({ isOpen, onClose, onAdd }: AddOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    owner: "",
    ownerEmail: "",
    mapVersion: "",
    addressLink: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapVersions = [
    "Google Maps API v3.52",
    "Google Maps API v3.51",
    "Mapbox GL v2.14",
    "Mapbox GL v2.13",
    "OpenStreetMap",
    "Leaflet v1.9"
  ];

  const validateForm = () => {
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

    if (!formData.mapVersion) {
      newErrors.mapVersion = "Map version is required";
    }

    if (!formData.addressLink.trim()) {
      newErrors.addressLink = "Address link is required";
    } else if (!/^https?:\/\/.+/.test(formData.addressLink)) {
      newErrors.addressLink = "Please enter a valid URL (starting with http:// or https://)";
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
      // Calculate subscription expiry - default 1 month
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      onAdd({
        ...formData,
        status: "Inactive", // New organizations start inactive until email is verified
        emailVerified: false,
        subscriptionStatus: "Active",
        subscriptionExpiry: expiryDate.toISOString().split('T')[0]
      });

      toast.success(`Organization "${formData.name}" created successfully!`, {
        description: `Verification email sent to ${formData.ownerEmail}`
      });

      // Reset form
      setFormData({
        name: "",
        address: "",
        owner: "",
        ownerEmail: "",
        mapVersion: "",
        addressLink: ""
      });
      setErrors({});
      setIsSubmitting(false);
      onClose();
    }, 1500);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-slate-900">Add New Organization</DialogTitle>
              <DialogDescription>
                Create a new organization and configure initial settings
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <div className="space-y-1">
                <p className="font-medium">Email Verification Process:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>A verification email will be sent to the owner's email address</li>
                  <li>The organization will remain inactive until the owner verifies their email</li>
                  <li>Once verified, a default password will be automatically sent to the owner</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              Organization Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., TechCorp Solutions"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              Address *
            </Label>
            <Textarea
              id="address"
              placeholder="e.g., 123 Business Street, San Francisco, CA 94105"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={3}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Owner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner" className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                Owner Name *
              </Label>
              <Input
                id="owner"
                placeholder="e.g., John Anderson"
                value={formData.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
                className={errors.owner ? "border-red-500" : ""}
              />
              {errors.owner && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.owner}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                Owner Email *
              </Label>
              <Input
                id="ownerEmail"
                type="email"
                placeholder="e.g., john@techcorp.com"
                value={formData.ownerEmail}
                onChange={(e) => handleChange("ownerEmail", e.target.value)}
                className={errors.ownerEmail ? "border-red-500" : ""}
              />
              {errors.ownerEmail && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.ownerEmail}
                </p>
              )}
            </div>
          </div>

          {/* Map Configuration */}
          <div className="space-y-2">
            <Label htmlFor="mapVersion" className="flex items-center gap-2">
              <Map className="w-4 h-4 text-slate-500" />
              Geographical Map Version *
            </Label>
            <Select
              value={formData.mapVersion}
              onValueChange={(value) => handleChange("mapVersion", value)}
            >
              <SelectTrigger className={errors.mapVersion ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a map version" />
              </SelectTrigger>
              <SelectContent>
                {mapVersions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mapVersion && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.mapVersion}
              </p>
            )}
          </div>

          {/* Address Link */}
          <div className="space-y-2">
            <Label htmlFor="addressLink" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-slate-500" />
              Address Link *
            </Label>
            <Input
              id="addressLink"
              type="url"
              placeholder="e.g., https://maps.google.com/?q=..."
              value={formData.addressLink}
              onChange={(e) => handleChange("addressLink", e.target.value)}
              className={errors.addressLink ? "border-red-500" : ""}
            />
            {errors.addressLink && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.addressLink}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4 mr-2" />
                  Create Organization
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
