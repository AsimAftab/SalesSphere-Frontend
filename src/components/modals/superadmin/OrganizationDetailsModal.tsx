import { useState, useEffect,useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../uix/dialog";
import { Badge } from "../../uix/badge";
import CustomButton from "../../UI/Button/Button";
import { Separator } from "../../uix/separator";
import {
  MapPin,
  Mail,
  Link as LinkIcon,
  Shield,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  Send,
  Ban,
  UserPlus,
  Trash2,
  Edit,
  Save,
  X as XIcon,
  AlertCircle,
  RefreshCw,
  Loader2
} from "lucide-react";
import { getOrganizationById, updateOrganization, deactivateOrganization, activateOrganization } from "../../../api/services/superadmin/organizationService";
import { Input } from "../../uix/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../uix/table";
import { Alert, AlertDescription } from "../../uix/alert";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../uix/alert-dialog";
import { AddUserModal } from "../AddUserModal";
import { Textarea } from "../../uix/textarea";
import { Label } from "../../uix/label";
import { CreditCard, FileSpreadsheet } from "lucide-react";
import { SubscriptionManagementModal } from "./SubscriptionManagementModal";
import { BulkUploadPartiesModal } from "./BulkUploadPartiesModal";
import { LocationMap } from "../../maps/LocationMap";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Admin" | "Sales Rep";
  emailVerified: boolean;
  isActive: boolean;
  lastActive: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  citizenshipNumber?: string;
  panNumber?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface Organization {
  id: string;
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
  users: User[];
  createdDate: string;
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
  deactivationReason?: string;
  deactivatedDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  halfDayCheckOutTime?: string;
  weeklyOffDay?: string;
  timezone?: string;
  subscriptionType?: string;
}

interface OrganizationDetailsModalProps {
  organization: Organization;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updatedOrg: Organization) => void;
}

export function OrganizationDetailsModal({
  organization,
  isOpen,
  onClose,
  onUpdate
}: OrganizationDetailsModalProps) {
  const [sendingVerification, setSendingVerification] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [revokeUserId, setRevokeUserId] = useState<string | null>(null);
  const [grantUserId, setGrantUserId] = useState<string | null>(null);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [localOrg, setLocalOrg] = useState(organization);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrg, setEditedOrg] = useState(organization);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [transferOwnershipOpen, setTransferOwnershipOpen] = useState(false);
  const [transferType, setTransferType] = useState<"existing" | "new">("existing");
  const [selectedNewOwnerId, setSelectedNewOwnerId] = useState<string | null>(null);
  const [newOwnerData, setNewOwnerData] = useState({
    name: "",
    email: "",
    phone: "",
    panVat: "",
    citizenshipNumber: "",
    address: "",
    latitude: 27.7172,
    longitude: 85.324
  });
  const [transferErrors, setTransferErrors] = useState<Record<string, string>>({});
  const [mapPosition, setMapPosition] = useState({
    lat: organization.latitude,
    lng: organization.longitude,
  });
  const [transferMapPosition, setTransferMapPosition] = useState({
    lat: 27.7172,
    lng: 85.324,
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [orgDetails, setOrgDetails] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<'cancel' | 'close'>('cancel');

  // Get current system user for role-based access control
  const currentSystemUser = JSON.parse(localStorage.getItem('systemUser') || '{}');
  const isDeveloper = currentSystemUser.role === "Developer";

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


  const validateOrganizationName = (name: string): boolean => {
    // Allow only letters and spaces (same as settings page)
    const orgNameRegex = /^[a-zA-Z\s]+$/;
    return orgNameRegex.test(name);
  };

  const validatePanVat = (panVat: string): boolean => {
    // Allow only digits, max 14 characters (same as settings page)
    const panVatRegex = /^\d{0,14}$/;
    return panVatRegex.test(panVat);
  };

  const validateCitizenshipNumber = (citizenship: string): boolean => {
    // Allow only alphanumeric characters and hyphens, max 20 characters
    const citizenshipRegex = /^[a-zA-Z0-9-]{0,20}$/;
    return citizenshipRegex.test(citizenship);
  };

  const sanitizeUrl = (url: string | undefined): string => {
    // Return empty string if URL is undefined or empty
    if (!url || typeof url !== 'string') return '#';

    // Remove any whitespace
    const trimmedUrl = url.trim();

    // Only allow http:// and https:// protocols to prevent XSS via javascript: protocol
    const urlPattern = /^https?:\/\/.+/i;

    if (!urlPattern.test(trimmedUrl)) {
      // If it doesn't start with http:// or https://, return a safe default
      return '#';
    }

    // Additional check to prevent javascript: or data: URIs that might be disguised
    const lowerUrl = trimmedUrl.toLowerCase();
    if (lowerUrl.includes('javascript:') || lowerUrl.includes('data:') || lowerUrl.includes('vbscript:')) {
      return '#';
    }

    return trimmedUrl;
  };



  const handleLocationChange = useCallback((location: { lat: number; lng: number }) => {
    setMapPosition(location);
    setEditedOrg(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
      addressLink: `https://maps.google.com/?q=$${location.lat},${location.lng}`,
    }));
  }, []);

  const handleAddressGeocoded = useCallback((address: string) => {
    setEditedOrg(prev => ({
      ...prev,
      address: address,
    }));
    if (editErrors.address) {
      setEditErrors(prev => ({ ...prev, address: '' }));
    }
  }, [editErrors.address]);

  // Handle location change from transfer ownership map
  const handleTransferLocationChange = useCallback((location: { lat: number; lng: number }) => {
    setTransferMapPosition(location);
    setNewOwnerData(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));
  }, []);


  const handleTransferAddressGeocoded = useCallback((address: string) => {
    setNewOwnerData(prev => ({
      ...prev,
      address: address,
    }));
    if (transferErrors.address) {
      setTransferErrors(prev => ({ ...prev, address: '' }));
    }
  }, [transferErrors.address]);

  // Fetch organization details from API when modal opens
  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      if (isOpen && organization.id) {
        setIsLoadingDetails(true);
        try {
          const response = await getOrganizationById(organization.id);
          console.log('Fetched organization details:', response.data);

          // Extract coordinates from googleMapLink if latitude/longitude are 0
          let fetchedData = response.data;
          if ((fetchedData.latitude === 0 || fetchedData.longitude === 0) && fetchedData.googleMapLink) {
            // Extract lat/lng from URL like: https://maps.google.com/?q=13.1350875,77.56701559999999
            const match = fetchedData.googleMapLink.match(/q=([-\d.]+),([-\d.]+)/);
            if (match) {
              fetchedData = {
                ...fetchedData,
                latitude: parseFloat(match[1]),
                longitude: parseFloat(match[2])
              };
              console.log('Extracted coordinates from googleMapLink:', fetchedData.latitude, fetchedData.longitude);
            }
          }

          console.log('Final Latitude:', fetchedData.latitude, 'Longitude:', fetchedData.longitude);
          setOrgDetails(fetchedData);
        } catch (error) {
          console.error('Failed to fetch organization details:', error);
          toast.error('Failed to load organization details');
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchOrganizationDetails();
  }, [isOpen, organization.id]);

  // Sync local state when organization prop changes (only when not editing to preserve user input)
  useEffect(() => {
    if (!isEditing) {
      setLocalOrg(organization);
      setEditedOrg(organization);
    }
  }, [organization, isEditing]);

  // Reset editing state when modal closes or organization changes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setEditErrors({});
      setHasUnsavedChanges(false);
      setShowCloseConfirmation(false);
    }
  }, [isOpen]);

  // Reset editing state when organization changes
  useEffect(() => {
    setIsEditing(false);
    setEditErrors({});
    setHasUnsavedChanges(false);
  }, [organization.id]);

  const handleSendVerification = (email: string, userName: string) => {
    setSendingVerification(true);
    // Simulate sending verification email
    setTimeout(() => {
      setSendingVerification(false);
      toast.success(`Verification email sent to ${userName}. Once verified, default password will be sent to ${email}`);
    }, 1500);
  };

  const handleResetPassword = (userName: string, email: string) => {
    toast.success(`Password reset email sent to ${userName} (${email})`);
  };

  const handleDeactivateOrg = async () => {
    try {
      const orgId = orgDetails?._id || organization.id;

      await deactivateOrganization(orgId);

      // Refresh organization details
      const response = await getOrganizationById(orgId);
      setOrgDetails(response.data);

      const today = new Date().toISOString().split('T')[0];
      const updatedOrg = {
        ...localOrg,
        status: "Inactive" as const,
        deactivatedDate: today
      };
      setLocalOrg(updatedOrg);
      onUpdate?.(updatedOrg);
      setDeactivateDialogOpen(false);
      setDeactivationReason("");
      toast.success(`${organization.name} has been deactivated. All users have been logged out and access revoked`);
    } catch (error: any) {
      console.error('Failed to deactivate organization:', error);
      toast.error(error.message || 'Failed to deactivate organization. Please try again.');
    }
  };

  const handleActivateOrg = async () => {
    try {
      const orgId = orgDetails?._id || organization.id;

      await activateOrganization(orgId);

      // Refresh organization details
      const response = await getOrganizationById(orgId);
      setOrgDetails(response.data);

      const updatedOrg = { ...localOrg, status: "Active" as const };
      setLocalOrg(updatedOrg);
      onUpdate?.(updatedOrg);
      toast.success(`${organization.name} has been activated`);
    } catch (error: any) {
      console.error('Failed to activate organization:', error);
      toast.error(error.message || 'Failed to activate organization. Please try again.');
    }
  };

  const handleRevokeAccess = (userId: string) => {
    const user = localOrg.users.find(u => u.id === userId);
    if (user) {
      const updatedUsers = localOrg.users.map(u =>
        u.id === userId ? { ...u, isActive: false } : u
      );
      const updatedOrg = { ...localOrg, users: updatedUsers };
      setLocalOrg(updatedOrg);
      onUpdate?.(updatedOrg);
      setRevokeUserId(null);
      toast.success(`Access revoked for ${user.name}. User has been marked as inactive`);
    }
  };

  const handleGrantAccess = (userId: string) => {
    const user = localOrg.users.find(u => u.id === userId);
    if (user) {
      const updatedUsers = localOrg.users.map(u =>
        u.id === userId ? { ...u, isActive: true } : u
      );
      const updatedOrg = { ...localOrg, users: updatedUsers };
      setLocalOrg(updatedOrg);
      onUpdate?.(updatedOrg);
      setGrantUserId(null);
      toast.success(`Access granted to ${user.name}. User has been reactivated and can now access the system`);
    }
  };

  const handleAddUser = (newUser: Omit<User, "id" | "lastActive">) => {
    const user: User = {
      ...newUser,
      id: `u-${Date.now()}`,
      lastActive: "Never"
    };
    const updatedOrg = {
      ...localOrg,
      users: [...localOrg.users, user]
    };
    setLocalOrg(updatedOrg);
    onUpdate?.(updatedOrg);
    setAddUserModalOpen(false);
    toast.success(`${user.name} has been added. Verification email will be sent to ${user.email}`);
  };

  const handleSubscriptionUpdate = (updates: {
    subscriptionStatus: "Active" | "Expired";
    subscriptionExpiry: string;
  }) => {
    const updatedOrg = {
      ...localOrg,
      ...updates
    };
    setLocalOrg(updatedOrg);
    onUpdate?.(updatedOrg);
  };

  const handleEditOrganization = () => {
    // Use orgDetails if available for more accurate data, otherwise use localOrg
    // Use nullish coalescing to handle 0 as a valid value
    console.log('handleEditOrganization called');
    console.log('orgDetails:', orgDetails);
    console.log('localOrg:', localOrg);

    const lat = orgDetails?.latitude ?? localOrg.latitude;
    const lng = orgDetails?.longitude ?? localOrg.longitude;

    console.log('Using lat:', lat, 'lng:', lng);

    setEditedOrg({
      ...localOrg,
      latitude: lat,
      longitude: lng,
      checkInTime: orgDetails?.checkInTime || localOrg.checkInTime,
      checkOutTime: orgDetails?.checkOutTime || localOrg.checkOutTime,
      halfDayCheckOutTime: orgDetails?.halfDayCheckOutTime || localOrg.halfDayCheckOutTime,
      weeklyOffDay: orgDetails?.weeklyOffDay || localOrg.weeklyOffDay,
      timezone: orgDetails?.timezone || localOrg.timezone,
      subscriptionType: orgDetails?.subscriptionType || localOrg.subscriptionType,
    });
    setMapPosition({ lat, lng });
    setEditErrors({});
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      setConfirmationAction('cancel');
      setShowCloseConfirmation(true);
    } else {
      setIsEditing(false);
      setEditedOrg(localOrg);
      setMapPosition({ lat: localOrg.latitude, lng: localOrg.longitude });
      setEditErrors({});
    }
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    setEditedOrg(localOrg);
    setMapPosition({ lat: localOrg.latitude, lng: localOrg.longitude });
    setEditErrors({});
    setHasUnsavedChanges(false);
    setShowCloseConfirmation(false);

    // If we're closing the modal, close it after discarding
    if (confirmationAction === 'close') {
      onClose();
    }
  };

  const handleSaveAndContinue = async () => {
    if (validateEditForm()) {
      await handleSaveChanges();
      setShowCloseConfirmation(false);

      // If we're closing the modal, close it after saving
      if (confirmationAction === 'close') {
        onClose();
      }
    } else {
      toast.error("Please fix validation errors before saving");
    }
  };

  const handleCloseModal = () => {
    if (isEditing && hasUnsavedChanges) {
      setConfirmationAction('close');
      setShowCloseConfirmation(true);
    } else {
      onClose();
    }
  };

  

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editedOrg.name.trim()) {
      errors.name = "Organization name is required";
    } else if (!validateOrganizationName(editedOrg.name)) {
      errors.name = "Organization name can only contain letters and spaces";
    }

    if (!editedOrg.owner.trim()) {
      errors.owner = "Owner name is required";
    } else if (!validateName(editedOrg.owner)) {
      errors.owner = "Owner name can only contain letters, spaces, hyphens, and periods";
    }

    if (!editedOrg.ownerEmail.trim()) {
      errors.ownerEmail = "Owner email is required";
    } else if (!validateEmail(editedOrg.ownerEmail)) {
      errors.ownerEmail = "Please enter a valid email address";
    }

    if (!editedOrg.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(editedOrg.phone)) {
      errors.phone = "Phone number must be 10 digits.";
    }

    if (editedOrg.panVat && !validatePanVat(editedOrg.panVat)) {
      errors.panVat = "PAN/VAT can only contain digits (max 14)";
    }

    if (!editedOrg.address.trim()) {
      errors.address = "Address is required";
    }

    if (isNaN(Number(editedOrg.latitude))) {
      errors.latitude = "Latitude must be a valid number";
    }

    if (isNaN(Number(editedOrg.longitude))) {
      errors.longitude = "Longitude must be a valid number";
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateEditForm()) {
      toast.error("Please fix all validation errors before saving");
      return;
    }

    try {
      // Use the correct organization ID from orgDetails (backend uses _id)
      const orgId = orgDetails?._id || organization.id;

      // Call the API to update organization
      await updateOrganization({
        id: orgId,
        name: editedOrg.name,
        address: editedOrg.address,
        phone: editedOrg.phone,
        panVat: editedOrg.panVat,
        latitude: editedOrg.latitude,
        longitude: editedOrg.longitude,
        addressLink: `https://maps.google.com/?q=${editedOrg.latitude},${editedOrg.longitude}`,
        checkInTime: editedOrg.checkInTime,
        checkOutTime: editedOrg.checkOutTime,
        halfDayCheckOutTime: editedOrg.halfDayCheckOutTime,
        weeklyOffDay: editedOrg.weeklyOffDay,
        timezone: editedOrg.timezone,
        subscriptionType: editedOrg.subscriptionType,
      });

      // Refresh organization details from API
      const response = await getOrganizationById(orgId);
      setOrgDetails(response.data);

      setLocalOrg(editedOrg);
      onUpdate?.(editedOrg);
      setIsEditing(false);
      setEditErrors({});
      setHasUnsavedChanges(false);

      toast.success("Organization updated successfully. All changes have been saved");
    } catch (error: any) {
      console.error('Failed to update organization:', error);
      toast.error(error.message || "Failed to update organization. Please try again.");
    }
  };

  const handleTransferOwnership = () => {
    const currentOwner = localOrg.users.find(u => u.role === "Owner");
    if (!currentOwner) return;

    let updatedUsers: User[];
    let newOwnerName = "";

    if (transferType === "existing") {
      // Transfer to existing user
      if (!selectedNewOwnerId) {
        toast.error("Please select a new owner");
        return;
      }

      // Prevent selecting the current owner
      if (selectedNewOwnerId === currentOwner?.id) {
        toast.error("This user is already the owner");
        return;
      }

      const newOwner = localOrg.users.find(u => u.id === selectedNewOwnerId);
      if (!newOwner) return;

      newOwnerName = newOwner.name;
      updatedUsers = localOrg.users.map(u => {
        if (u.id === selectedNewOwnerId) {
          return { ...u, role: "Owner" as const };
        }
        if (u.role === "Owner") {
          return { ...u, role: "Admin" as const };
        }
        return u;
      });
    } else {
      // Transfer to new user
      const errors: Record<string, string> = {};

      if (!newOwnerData.name.trim()) {
        errors.name = "Name is required";
      } else if (!validateName(newOwnerData.name)) {
        errors.name = "Name can only contain letters, spaces, hyphens, and periods";
      }

      if (!newOwnerData.email.trim()) {
        errors.email = "Email is required";
      } else if (!validateEmail(newOwnerData.email)) {
        errors.email = "Please enter a valid email address";
      } else {
        // Check for duplicate email
        const existingUser = localOrg.users.find(
          u => u.email.toLowerCase() === newOwnerData.email.toLowerCase()
        );
        if (existingUser) {
          errors.email = "This email is already in use by another user";
        }
      }

      if (!newOwnerData.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(newOwnerData.phone)) {
        errors.phone = "Phone number must be 10 digits.";
      }

      if (newOwnerData.panVat && !validatePanVat(newOwnerData.panVat)) {
        errors.panVat = "PAN/VAT can only contain digits (max 14)";
      }

      if (!newOwnerData.citizenshipNumber.trim()) {
        errors.citizenshipNumber = "Citizenship number is required";
      } else if (!validateCitizenshipNumber(newOwnerData.citizenshipNumber)) {
        errors.citizenshipNumber = "Citizenship number can only contain alphanumeric characters and hyphens (max 20)";
      }

      if (!newOwnerData.address.trim()) {
        errors.address = "Address is required";
      }

      if (isNaN(Number(newOwnerData.latitude))) {
        errors.latitude = "Latitude must be a valid number";
      }

      if (isNaN(Number(newOwnerData.longitude))) {
        errors.longitude = "Longitude must be a valid number";
      }

      if (Object.keys(errors).length > 0) {
        setTransferErrors(errors);
        return;
      }

      newOwnerName = newOwnerData.name;

      // Create new owner user
      const newOwner: User = {
        id: `user-${Date.now()}`,
        name: newOwnerData.name,
        email: newOwnerData.email,
        role: "Owner",
        emailVerified: false,
        isActive: true,
        lastActive: "Never"
      };

      // Demote current owner and add new owner
      updatedUsers = [
        newOwner,
        ...localOrg.users.map(u => {
          if (u.role === "Owner") {
            return { ...u, role: "Admin" as const };
          }
          return u;
        })
      ];
    }

    const updatedOrg = {
      ...localOrg,
      users: updatedUsers
    };

    setLocalOrg(updatedOrg);
    onUpdate?.(updatedOrg);
    setTransferOwnershipOpen(false);
    setSelectedNewOwnerId(null);
    setNewOwnerData({
      name: "",
      email: "",
      phone: "",
      panVat: "",
      citizenshipNumber: "",
      address: "",
      latitude: 27.7172,
      longitude: 85.324
    });
    setTransferMapPosition({ lat: 27.7172, lng: 85.324 });
    setTransferErrors({});
    setTransferType("existing");

    toast.success(`Ownership transferred to ${newOwnerName}. ${currentOwner.name} is now an Admin`);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Admin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Manager":
        return "bg-green-100 text-green-700 border-green-200";
      case "Sales Rep":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Helper function to get organization status colors
  const getOrgStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return "bg-green-600 text-white";
      case 'inactive': return "bg-gray-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleCloseModal(); }}>
      <DialogContent className="!w-[96vw] !max-w-[96vw] !h-[96vh] overflow-hidden flex flex-col p-4">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-slate-900 flex items-center gap-3 flex-wrap">
                {localOrg.name}
                <Badge
                  className={getOrgStatusColor(localOrg.status)}
                >
                  {localOrg.status}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">
                {localOrg.id} • Created {new Date(localOrg.createdDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </DialogDescription>
            </div>
          </div>

          {/* Activate/Deactivate Button - Moved below header */}
          <div className="mt-3 flex justify-end">
            {localOrg.status === "Active" ? (
              <CustomButton
                variant="danger"
                onClick={() => setDeactivateDialogOpen(true)}
                className="text-xs py-1.5 px-4"
                disabled={isDeveloper}
                title={isDeveloper ? "Developers cannot deactivate organizations" : ""}
              >
                <Ban className="w-3 h-3 mr-1.5" />
                Deactivate Organization
              </CustomButton>
            ) : (
              <CustomButton
                variant="primary"
                onClick={handleActivateOrg}
                className="bg-green-600 hover:bg-green-700 text-xs py-1.5 px-4"
                disabled={isDeveloper}
                title={isDeveloper ? "Developers cannot activate organizations" : ""}
              >
                <CheckCircle2 className="w-3 h-3 mr-1.5" />
                Activate Organization
              </CustomButton>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-2 mt-2 overflow-y-auto flex-1">
          {/* Email Verification Alert */}
          {!localOrg.emailVerified && (
            <Alert className="border-amber-200 bg-amber-50 py-2">
              <Mail className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Owner email verification is pending</p>
                    <p className="text-xs mt-0.5">Will remain inactive until verified. Password will be sent after verification.</p>
                  </div>
                  <CustomButton
                    variant="outline"
                    className="ml-4 flex-shrink-0 text-xs py-1 px-4"
                    onClick={() => handleSendVerification(localOrg.ownerEmail, localOrg.owner)}
                    disabled={sendingVerification}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    {sendingVerification ? "Sending..." : "Resend"}
                  </CustomButton>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Subscription Info */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 space-y-2 border border-purple-100">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="w-4 h-4 text-purple-600" />
                Subscription Details
              </h3>
              <CustomButton
                variant="primary"
                onClick={() => setSubscriptionModalOpen(true)}
                className="text-xs py-1 px-4"
              >
                Manage
              </CustomButton>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-lg p-2">
                <p className="text-slate-500 text-xs mb-0.5">Status</p>
                <Badge
                  variant={localOrg.subscriptionStatus === "Active" ? "default" : "destructive"}
                  className={localOrg.subscriptionStatus === "Active" ? "bg-green-500" : ""}
                >
                  {localOrg.subscriptionStatus}
                </Badge>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-slate-500 text-xs mb-0.5">Expiry Date</p>
                <p className="text-slate-900 text-sm">
                  {new Date(localOrg.subscriptionExpiry).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-slate-500 text-xs mb-0.5">Days Remaining</p>
                <p className={`text-sm ${
                  Math.ceil((new Date(localOrg.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0
                    ? 'text-red-600'
                    : Math.ceil((new Date(localOrg.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 7
                    ? 'text-amber-600'
                    : 'text-green-600'
                }`}>
                  {Math.ceil((new Date(localOrg.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0 
                    ? 'Expired' 
                    : `${Math.ceil((new Date(localOrg.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                  }
                </p>
              </div>
            </div>
            {localOrg.deactivationReason && localOrg.deactivatedDate && (
              <Alert className="bg-white border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <p className="font-medium">Deactivation Details</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Date:</span> {new Date(localOrg.deactivatedDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Reason:</span> {localOrg.deactivationReason}
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Party Management */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 space-y-2 border border-green-100">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 flex items-center gap-2 text-sm font-semibold">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                Party Management
              </h3>
              <CustomButton
                variant="primary"
                onClick={() => setBulkUploadModalOpen(true)}
                className="text-xs py-1 px-4"
              >
                <FileSpreadsheet className="w-3 h-3 mr-1.5" />
                Import Excel
              </CustomButton>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-slate-600 text-xs mb-2">
                Bulk upload parties for this organization using an Excel spreadsheet
              </p>
              <ul className="list-disc ml-4 text-xs text-slate-600 space-y-1">
                <li>Download the Excel template</li>
                <li>Fill in party details (Company Name, Owner, Address, Email, etc.)</li>
                <li>Upload the completed file to add multiple parties at once</li>
              </ul>
            </div>
          </div>

          {/* Organization Details */}
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <h3 className="text-slate-900 flex items-center gap-2 text-sm font-semibold">
              <Building2 className="w-4 h-4" />
              Organization Details
            </h3>

            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600">Loading details...</span>
              </div>
            ) : isEditing ? (
              <div className="space-y-6">
                {/* Organization Information Section */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Organization Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Organization Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={editedOrg.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || validateOrganizationName(value)) {
                            setEditedOrg({ ...editedOrg, name: value });
                            setEditErrors(prev => ({ ...prev, name: "" }));
                            setHasUnsavedChanges(true);
                          } else {
                            setEditErrors(prev => ({ ...prev, name: "Organization name can only contain letters and spaces" }));
                          }
                        }}
                        className={editErrors.name ? "border-red-500" : ""}
                        placeholder="Enter organization name"
                      />
                      {editErrors.name && (
                        <p className="mt-1 text-sm text-red-500">{editErrors.name}</p>
                      )}
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={editedOrg.owner}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || validateName(value)) {
                            const sanitized = sanitizeInput(value);
                            setEditedOrg({ ...editedOrg, owner: sanitized });
                            setEditErrors(prev => ({ ...prev, owner: "" }));
                            setHasUnsavedChanges(true);
                          } else {
                            setEditErrors(prev => ({ ...prev, owner: "Owner name can only contain letters, spaces, hyphens, and periods" }));
                          }
                        }}
                        className={editErrors.owner ? "border-red-500" : ""}
                        placeholder="Enter owner name"
                      />
                      {editErrors.owner && (
                        <p className="mt-1 text-sm text-red-500">{editErrors.owner}</p>
                      )}
                    </div>

                    {/* PAN/VAT Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN/VAT Number
                      </label>
                      <Input
                        value={editedOrg.panVat}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || validatePanVat(value)) {
                            setEditedOrg({ ...editedOrg, panVat: value });
                            setEditErrors(prev => ({ ...prev, panVat: "" }));
                            setHasUnsavedChanges(true);
                          } else {
                            setEditErrors(prev => ({ ...prev, panVat: "PAN/VAT can only contain digits (max 14)" }));
                          }
                        }}
                        className={editErrors.panVat ? "border-red-500" : ""}
                        placeholder="Enter PAN/VAT number"
                        maxLength={14}
                      />
                      {editErrors.panVat && (
                        <p className="mt-1 text-sm text-red-500">{editErrors.panVat}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={editedOrg.phone}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, '');
                          if (numericValue.length <= 10) {
                            setEditedOrg({ ...editedOrg, phone: numericValue });
                            setEditErrors(prev => ({ ...prev, phone: "" }));
                            setHasUnsavedChanges(true);
                          }
                        }}
                        className={editErrors.phone ? "border-red-500" : ""}
                        placeholder="Enter 10-digit phone number"
                        maxLength={10}
                      />
                      {editErrors.phone && (
                        <p className="mt-1 text-sm text-red-500">{editErrors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={editedOrg.ownerEmail}
                        onChange={(e) => {
                          const value = e.target.value;
                          const sanitized = sanitizeInput(value);
                          setEditedOrg({ ...editedOrg, ownerEmail: sanitized });
                          setEditErrors(prev => ({ ...prev, ownerEmail: "" }));
                          setHasUnsavedChanges(true);
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value && !validateEmail(value)) {
                            setEditErrors(prev => ({ ...prev, ownerEmail: "Please enter a valid email address" }));
                          }
                        }}
                        className={editErrors.ownerEmail ? "border-red-500" : ""}
                        placeholder="Enter owner email"
                      />
                      {editErrors.ownerEmail && (
                        <p className="mt-1 text-sm text-red-500">{editErrors.ownerEmail}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Information Section */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Location Information
                  </h4>

                  {/* Interactive Map */}
                  <div className="mb-6 h-80 md:h-96 w-full">
                    <LocationMap
                      position={mapPosition}
                      onLocationChange={handleLocationChange}
                      onAddressGeocoded={handleAddressGeocoded}
                    />
                  </div>

                  {/* Address Fields */}
                  <div className="space-y-4">
                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={editedOrg.address}
                        readOnly
                        placeholder="Auto-filled from map"
                      />
                      {editErrors.address && (
                        <p className="mt-1 text-sm text-red-500">{editErrors.address}</p>
                      )}
                    </div>

                    {/* Latitude & Longitude */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latitude <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          step="any"
                          value={editedOrg.latitude}
                          readOnly // <-- FIX: Make read-only
                          className={`bg-gray-100 ${editErrors.latitude ? "border-red-500" : "border-gray-300"}`}
                          placeholder="Auto-filled from map"
                        />
                        {editErrors.latitude && (
                          <p className="mt-1 text-sm text-red-500">{editErrors.latitude}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitude <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          step="any"
                          value={editedOrg.longitude}
                          readOnly // <-- FIX: Make read-only
                          className={`bg-gray-100 ${editErrors.longitude ? "border-red-500" : "border-gray-300"}`}
                          placeholder="Auto-filled from map"
                        />
                        {editErrors.longitude && (
                          <p className="mt-1 text-sm text-red-500">{editErrors.longitude}</p>
                        )}
                      </div>
                    </div>

                    {/* Google Maps Link (Auto-generated) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Maps Link
                      </label>
                      <Input
                        type="text"
                        value={`https://maps.google.com/?q=${editedOrg.latitude},${editedOrg.longitude}`}
                        readOnly
                        className="bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500">Auto-generated from coordinates</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours & Settings Section */}
                {orgDetails && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Working Hours & Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Check-in Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Check-in Time <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="time"
                          value={editedOrg.checkInTime || orgDetails.checkInTime}
                          onChange={(e) => {
                            setEditedOrg({ ...editedOrg, checkInTime: e.target.value });
                            setEditErrors(prev => ({ ...prev, checkInTime: "" }));
                            setHasUnsavedChanges(true);
                          }}
                          className={editErrors.checkInTime ? "border-red-500" : ""}
                        />
                        {editErrors.checkInTime && (
                          <p className="mt-1 text-sm text-red-500">{editErrors.checkInTime}</p>
                        )}
                      </div>

                      {/* Check-out Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Check-out Time <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="time"
                          value={editedOrg.checkOutTime || orgDetails.checkOutTime}
                          onChange={(e) => {
                            setEditedOrg({ ...editedOrg, checkOutTime: e.target.value });
                            setEditErrors(prev => ({ ...prev, checkOutTime: "" }));
                            setHasUnsavedChanges(true);
                          }}
                          className={editErrors.checkOutTime ? "border-red-500" : ""}
                        />
                        {editErrors.checkOutTime && (
                          <p className="mt-1 text-sm text-red-500">{editErrors.checkOutTime}</p>
                        )}
                      </div>

                      {/* Half Day Check-out Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Half Day Check-out Time <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="time"
                          value={editedOrg.halfDayCheckOutTime || orgDetails.halfDayCheckOutTime}
                          onChange={(e) => {
                            setEditedOrg({ ...editedOrg, halfDayCheckOutTime: e.target.value });
                            setEditErrors(prev => ({ ...prev, halfDayCheckOutTime: "" }));
                            setHasUnsavedChanges(true);
                          }}
                          className={editErrors.halfDayCheckOutTime ? "border-red-500" : ""}
                        />
                        {editErrors.halfDayCheckOutTime && (
                          <p className="mt-1 text-sm text-red-500">{editErrors.halfDayCheckOutTime}</p>
                        )}
                      </div>

                      {/* Weekly Off Day */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weekly Off Day <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={editedOrg.weeklyOffDay || orgDetails.weeklyOffDay}
                          onChange={(e) => {
                            setEditedOrg({ ...editedOrg, weeklyOffDay: e.target.value });
                            setEditErrors(prev => ({ ...prev, weeklyOffDay: "" }));
                            setHasUnsavedChanges(true);
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${editErrors.weeklyOffDay ? "border-red-500" : "border-gray-300"}`}
                          aria-label="Weekly Off Day"
                        >
                          <option value="">Select a day</option>
                          <option value="Sunday">Sunday</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                        </select>
                        {editErrors.weeklyOffDay && (
                          <p className="mt-1 text-sm text-red-500">{editErrors.weeklyOffDay}</p>
                        )}
                      </div>

                      {/* Timezone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timezone <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={editedOrg.timezone || orgDetails.timezone}
                          onChange={(e) => {
                            setEditedOrg({ ...editedOrg, timezone: e.target.value });
                            setEditErrors(prev => ({ ...prev, timezone: "" }));
                            setHasUnsavedChanges(true);
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${editErrors.timezone ? "border-red-500" : "border-gray-300"}`}
                          aria-label="Timezone"
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata</option>
                          <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                          <option value="Asia/Dhaka">Asia/Dhaka</option>
                          <option value="Asia/Dubai">Asia/Dubai</option>
                          <option value="Asia/Singapore">Asia/Singapore</option>
                          <option value="Asia/Tokyo">Asia/Tokyo</option>
                          <option value="Europe/London">Europe/London</option>
                          <option value="America/New_York">America/New_York</option>
                          <option value="America/Los_Angeles">America/Los_Angeles</option>
                          <option value="Australia/Sydney">Australia/Sydney</option>
                        </select>
                        {editErrors.timezone && (
                          <p className="mt-1 text-sm text-red-500">{editErrors.timezone}</p>
                        )}
                      </div>

                      {/* Subscription Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subscription Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={editedOrg.subscriptionType || orgDetails.subscriptionType}
                          onChange={(e) => {
                            setEditedOrg({ ...editedOrg, subscriptionType: e.target.value });
                            setEditErrors(prev => ({ ...prev, subscriptionType: "" }));
                            setHasUnsavedChanges(true);
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${editErrors.subscriptionType ? "border-red-500" : "border-gray-300"}`}
                          aria-label="Subscription Type"
                        >
                          <option value="">Select subscription type</option>
                          <option value="6months">6 Months</option>
                          <option value="12months">12 Months</option>
                        </select>
                        {editErrors.subscriptionType && (
                          <p className="mt-1 text-sm text-red-500">{editErrors.subscriptionType}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {/* Owner Name */}
                <div className="space-y-0.5">
                  <p className="text-slate-500 text-xs">Owner</p>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-slate-400" />
                    <p className="text-slate-900 text-sm">{localOrg.owner}</p>
                  </div>
                </div>

                {/* Owner Email */}
                <div className="space-y-0.5">
                  <p className="text-slate-500 text-xs">Owner Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <p className="text-slate-900 text-sm break-all">{localOrg.ownerEmail}</p>
                    {localOrg.emailVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-0.5">
                  <p className="text-slate-500 text-xs">Phone</p>
                  <p className="text-slate-900 text-sm">{localOrg.phone}</p>
                </div>

                {/* PAN/VAT */}
                <div className="space-y-0.5">
                  <p className="text-slate-500 text-xs">PAN/VAT</p>
                  <p className="text-slate-900 text-sm">{localOrg.panVat || 'N/A'}</p>
                </div>

                {/* Address */}
                <div className="space-y-0.5">
                  <p className="text-slate-500 text-xs">Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-900 text-sm break-words">{localOrg.address}</p>
                  </div>
                </div>

                {/* Google Maps Link */}
                <div className="space-y-0.5">
                  <p className="text-slate-500 text-xs">Google Maps Link</p>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-3 h-3 text-slate-400" />
                    <a
                      href={sanitizeUrl(orgDetails?.googleMapLink || localOrg.addressLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate text-sm"
                    >
                      View on Map
                    </a>
                  </div>
                </div>

                {/* Coordinates */}
                {orgDetails && (
                  <>
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Latitude</p>
                      <p className="text-slate-900 text-sm">{orgDetails.latitude}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Longitude</p>
                      <p className="text-slate-900 text-sm">{orgDetails.longitude}</p>
                    </div>
                  </>
                )}

                {/* Additional fields from API */}
                {orgDetails && (
                  <>
                    {/* Check-in Time */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Check-in Time</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <p className="text-slate-900 text-sm">{orgDetails.checkInTime}</p>
                      </div>
                    </div>

                    {/* Check-out Time */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Check-out Time</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <p className="text-slate-900 text-sm">{orgDetails.checkOutTime}</p>
                      </div>
                    </div>

                    {/* Half Day Check-out Time */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Half Day Check-out Time</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <p className="text-slate-900 text-sm">{orgDetails.halfDayCheckOutTime}</p>
                      </div>
                    </div>

                    {/* Weekly Off Day */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Weekly Off Day</p>
                      <p className="text-slate-900 text-sm">{orgDetails.weeklyOffDay}</p>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Timezone</p>
                      <p className="text-slate-900 text-sm">{orgDetails.timezone}</p>
                    </div>

                    {/* Subscription Type */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Subscription Type</p>
                      <p className="text-slate-900 text-sm capitalize">{orgDetails.subscriptionType}</p>
                    </div>

                    {/* Subscription Start Date */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Subscription Start Date</p>
                      <p className="text-slate-900 text-sm">
                        {new Date(orgDetails.subscriptionStartDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Subscription End Date */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Subscription End Date</p>
                      <p className="text-slate-900 text-sm">
                        {new Date(orgDetails.subscriptionEndDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Created At */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Created At</p>
                      <p className="text-slate-900 text-sm">
                        {new Date(orgDetails.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Updated At */}
                    <div className="space-y-0.5">
                      <p className="text-slate-500 text-xs">Last Updated</p>
                      <p className="text-slate-900 text-sm">
                        {new Date(orgDetails.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Owner Details */}
                    {orgDetails.owner && (
                      <>
                        <div className="col-span-2 mt-2">
                          <Separator />
                        </div>
                        <div className="col-span-2">
                          <h4 className="text-slate-900 text-sm font-semibold mb-2">Owner Information</h4>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-slate-500 text-xs">Owner Name</p>
                          <p className="text-slate-900 text-sm">{orgDetails.owner.name}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-slate-500 text-xs">Owner Email</p>
                          <p className="text-slate-900 text-sm">{orgDetails.owner.email}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-slate-500 text-xs">Owner Role</p>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                            {orgDetails.owner.role}
                          </Badge>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <Separator className="my-2" />

          {/* Users & Access */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 flex items-center gap-2 text-sm font-semibold">
                <Users className="w-4 h-4" />
                Users & Access
                <Badge variant="secondary" className="ml-2 text-xs">
                  {localOrg.users.length} {localOrg.users.length === 1 ? 'User' : 'Users'}
                </Badge>
              </h3>
              <CustomButton
                variant="primary"
                onClick={() => setAddUserModalOpen(true)}
                className="text-xs py-1 px-4"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Add User
              </CustomButton>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs py-2">Name</TableHead>
                    <TableHead className="text-xs py-2">Email</TableHead>
                    <TableHead className="text-xs py-2">Role</TableHead>
                    <TableHead className="text-xs py-2">Status</TableHead>
                    <TableHead className="text-xs py-2">Last Active</TableHead>
                    <TableHead className="text-right text-xs py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localOrg.users.map((user) => (
                    <TableRow key={user.id} className={`text-sm ${!user.isActive ? 'bg-gray-50 opacity-60' : ''}`}>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${
                            user.isActive
                              ? 'bg-gradient-to-br from-slate-300 to-slate-400'
                              : 'bg-gradient-to-br from-gray-300 to-gray-400'
                          }`}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className={`text-sm truncate ${user.isActive ? 'text-slate-900' : 'text-gray-500'}`}>
                            {user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-sm py-2 max-w-[200px] truncate ${user.isActive ? 'text-slate-600' : 'text-gray-400'}`}>
                        {user.email}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className={`${getRoleBadgeColor(user.role)} text-xs`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        {!user.isActive ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <Ban className="w-3 h-3" />
                            <span className="text-xs font-medium">Inactive</span>
                          </div>
                        ) : user.emailVerified ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-xs">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-600">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">Pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className={`text-xs py-2 ${user.isActive ? 'text-slate-600' : 'text-gray-400'}`}>
                        {user.lastActive}
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <div className="flex items-center justify-end gap-2">
                          {!user.emailVerified && user.isActive && (
                            <CustomButton
                              variant="ghost"
                              onClick={() => handleSendVerification(user.email, user.name)}
                              className="text-xs py-1 px-3"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Verify
                            </CustomButton>
                          )}
                          {user.emailVerified && user.isActive && (
                            <CustomButton
                              variant="ghost"
                              onClick={() => handleResetPassword(user.name, user.email)}
                              className="text-xs py-1 px-3"
                            >
                              <Key className="w-3 h-3 mr-1" />
                              Reset
                            </CustomButton>
                          )}
                          {user.role === "Owner" ? (
                            <CustomButton
                              variant="ghost"
                              onClick={() => setTransferOwnershipOpen(true)}
                              className="text-xs py-1 px-3 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Transfer
                            </CustomButton>
                          ) : user.isActive ? (
                            <CustomButton
                              variant="danger"
                              onClick={() => setRevokeUserId(user.id)}
                              className="text-xs py-1 px-3 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Revoke
                            </CustomButton>
                          ) : (
                            <CustomButton
                              variant="primary"
                              onClick={() => setGrantUserId(user.id)}
                              className="text-xs py-1 px-3 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Grant Access
                            </CustomButton>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Verification & Password Info */}
            <Alert className="bg-blue-50 border-blue-200 py-2">
              <Key className="h-3 w-3 text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs">
                <p><span className="font-medium">Email Verification:</span> New users must verify email first. <span className="font-medium">Password Reset:</span> Only for verified users.</p>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2 pt-3 border-t flex-shrink-0">
          <CustomButton variant="outline" onClick={handleCloseModal}>
            Close
          </CustomButton>
          {isEditing ? (
            <>
              <CustomButton variant="outline" onClick={handleCancelEdit}>
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </CustomButton>
              <CustomButton variant="primary" onClick={handleSaveChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </CustomButton>
            </>
          ) : (
            <CustomButton variant="primary" onClick={handleEditOrganization}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Organization
            </CustomButton>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Deactivate Confirmation Dialog */}
    <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Organization?</AlertDialogTitle>
          <AlertDialogDescription>
            This will deactivate "{localOrg.name}" and revoke access for all {localOrg.users.length} users. 
            All active sessions will be terminated immediately. You can reactivate the organization later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Label htmlFor="deactivationReason">Deactivation Reason</Label>
          <Textarea
            id="deactivationReason"
            placeholder="e.g., Subscription expired - payment not received"
            value={deactivationReason}
            onChange={(e) => setDeactivationReason(e.target.value)}
            rows={3}
            className="mt-2"
          />
          <p className="text-xs text-slate-500 mt-1">
            This reason will be saved for record keeping and can be viewed later.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeactivationReason("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeactivateOrg}
            className="bg-red-600 hover:bg-red-700"
          >
            Deactivate Organization
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Revoke Access Confirmation Dialog */}
    <AlertDialog open={!!revokeUserId} onOpenChange={(open) => !open && setRevokeUserId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke User Access?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark {localOrg.users.find(u => u.id === revokeUserId)?.name} as inactive
            and immediately revoke their access. The user will remain in the organization list
            but will not be able to access the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => revokeUserId && handleRevokeAccess(revokeUserId)}
            className="bg-red-600 hover:bg-red-700"
          >
            Revoke Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Grant Access Confirmation Dialog */}
    <AlertDialog open={!!grantUserId} onOpenChange={(open) => !open && setGrantUserId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Grant User Access?</AlertDialogTitle>
          <AlertDialogDescription>
            This will reactivate {localOrg.users.find(u => u.id === grantUserId)?.name} and
            restore their access to the system. They will be able to log in and use the
            application with their previous role and permissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => grantUserId && handleGrantAccess(grantUserId)}
            className="bg-green-600 hover:bg-green-700"
          >
            Grant Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Add User Modal */}
    <AddUserModal
      isOpen={addUserModalOpen}
      onClose={() => setAddUserModalOpen(false)}
      onAdd={handleAddUser}
      organizationName={localOrg.name}
    />

    {/* Subscription Management Modal */}
    <SubscriptionManagementModal
      isOpen={subscriptionModalOpen}
      onClose={() => setSubscriptionModalOpen(false)}
      organizationId={localOrg.id}
      organizationName={localOrg.name}
      currentPlan="professional"
      subscriptionStatus={localOrg.subscriptionStatus}
      subscriptionExpiry={localOrg.subscriptionExpiry}
      onUpdate={handleSubscriptionUpdate}
    />

    {/* Bulk Upload Parties Modal */}
    <BulkUploadPartiesModal
      isOpen={bulkUploadModalOpen}
      onClose={() => setBulkUploadModalOpen(false)}
      organizationId={localOrg.id}
      organizationName={localOrg.name}
      onUploadSuccess={(count) => {
        toast.success(`Successfully uploaded ${count} parties. Parties have been added to the organization`);
      }}
    />

    {/* Transfer Ownership Modal */}
    <AlertDialog open={transferOwnershipOpen} onOpenChange={setTransferOwnershipOpen}>
      <AlertDialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <AlertDialogHeader className="flex-shrink-0">
          <AlertDialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            Transfer Ownership
          </AlertDialogTitle>
          <AlertDialogDescription>
            Transfer ownership of <span className="font-semibold">{localOrg.name}</span> to an existing user or add a new owner.
            The current owner will become an Admin.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 overflow-y-auto flex-1">
          {/* Toggle between existing and new user */}
          <div className="flex gap-2 mb-4 border-b">
            <CustomButton
              variant="ghost"
              onClick={() => {
                setTransferType("existing");
                setTransferErrors({});
              }}
              className={`rounded-none border-b-2 transition-colors hover:scale-100 ${
                transferType === "existing"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Existing User
            </CustomButton>
            <CustomButton
              variant="ghost"
              onClick={() => {
                setTransferType("new");
                setTransferErrors({});
              }}
              className={`rounded-none border-b-2 transition-colors hover:scale-100 ${
                transferType === "new"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              New Owner
            </CustomButton>
          </div>

          {transferType === "existing" ? (
            <div>
              <Label htmlFor="newOwner" className="text-sm font-medium mb-2 block">
                Select New Owner
              </Label>
              <select
                id="newOwner"
                value={selectedNewOwnerId || ""}
                onChange={(e) => setSelectedNewOwnerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select new owner"
              >
                <option value="">Choose a user...</option>
                {localOrg.users
                  .filter(u => u.role !== "Owner")
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.role} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Owner Information Section */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Owner Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <Label htmlFor="ownerName" className="text-sm font-medium mb-2 block">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ownerName"
                      type="text"
                      placeholder="Enter full name"
                      value={newOwnerData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || validateName(value)) {
                          const sanitized = sanitizeInput(value);
                          setNewOwnerData(prev => ({ ...prev, name: sanitized }));
                          setTransferErrors(prev => ({ ...prev, name: "" }));
                        } else {
                          setTransferErrors(prev => ({ ...prev, name: "Name can only contain letters, spaces, hyphens, and periods" }));
                        }
                      }}
                      className={transferErrors.name ? "border-red-500" : ""}
                    />
                    {transferErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{transferErrors.name}</p>
                    )}
                  </div>

                  {/* PAN/VAT */}
                  <div>
                    <Label htmlFor="ownerPanVat" className="text-sm font-medium mb-2 block">
                      PAN/VAT Number
                    </Label>
                    <Input
                      id="ownerPanVat"
                      type="text"
                      placeholder="Enter PAN/VAT number"
                      value={newOwnerData.panVat}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || validatePanVat(value)) {
                          setNewOwnerData(prev => ({ ...prev, panVat: value }));
                          setTransferErrors(prev => ({ ...prev, panVat: "" }));
                        } else {
                          setTransferErrors(prev => ({ ...prev, panVat: "PAN/VAT can only contain digits (max 14)" }));
                        }
                      }}
                      className={transferErrors.panVat ? "border-red-500" : ""}
                      maxLength={14}
                    />
                    {transferErrors.panVat && (
                      <p className="text-red-500 text-xs mt-1">{transferErrors.panVat}</p>
                    )}
                  </div>

                  {/* Citizenship Number */}
                  <div>
                    <Label htmlFor="ownerCitizenship" className="text-sm font-medium mb-2 block">
                      Citizenship Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ownerCitizenship"
                      type="text"
                      placeholder="Enter citizenship number"
                      value={newOwnerData.citizenshipNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || validateCitizenshipNumber(value)) {
                          setNewOwnerData(prev => ({ ...prev, citizenshipNumber: value }));
                          setTransferErrors(prev => ({ ...prev, citizenshipNumber: "" }));
                        } else {
                          setTransferErrors(prev => ({ ...prev, citizenshipNumber: "Citizenship number can only contain alphanumeric characters and hyphens (max 20)" }));
                        }
                      }}
                      className={transferErrors.citizenshipNumber ? "border-red-500" : ""}
                      maxLength={20}
                    />
                    {transferErrors.citizenshipNumber && (
                      <p className="text-red-500 text-xs mt-1">{transferErrors.citizenshipNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <Label htmlFor="ownerPhone" className="text-sm font-medium mb-2 block">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ownerPhone"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={newOwnerData.phone}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '');
                        if (numericValue.length <= 10) {
                          setNewOwnerData(prev => ({ ...prev, phone: numericValue }));
                          setTransferErrors(prev => ({ ...prev, phone: "" }));
                        }
                      }}
                      className={transferErrors.phone ? "border-red-500" : ""}
                      maxLength={10}
                    />
                    {transferErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{transferErrors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="ownerEmail" className="text-sm font-medium mb-2 block">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      placeholder="Enter email address"
                      value={newOwnerData.email}
                      onChange={(e) => {
                        const value = e.target.value;
                        const sanitized = sanitizeInput(value);
                        setNewOwnerData(prev => ({ ...prev, email: sanitized }));
                        setTransferErrors(prev => ({ ...prev, email: "" }));
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value && !validateEmail(value)) {
                          setTransferErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
                        }
                      }}
                      className={transferErrors.email ? "border-red-500" : ""}
                    />
                    {transferErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{transferErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information Section */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location Information
                </h4>

                {/* Interactive Map */}
                <div className="mb-6 h-80 md:h-96 w-full">
                  <LocationMap
                    position={transferMapPosition}
                    onLocationChange={handleTransferLocationChange}
                    onAddressGeocoded={handleTransferAddressGeocoded}
                  />
                </div>

                {/* Address Fields */}
                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <Label htmlFor="ownerAddress" className="text-sm font-medium mb-2 block">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="ownerAddress"
                      value={newOwnerData.address}
                      onChange={(e) => {
                        setNewOwnerData(prev => ({ ...prev, address: e.target.value }));
                        if (transferErrors.address) {
                          setTransferErrors(prev => ({ ...prev, address: "" }));
                        }
                      }}
                      rows={3}
                      className={transferErrors.address ? "border-red-500" : ""}
                      placeholder="Auto-filled from map or enter manually"
                    />
                    {transferErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{transferErrors.address}</p>
                    )}
                  </div>

                  {/* Latitude & Longitude */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerLatitude" className="text-sm font-medium mb-2 block">
                        Latitude <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="ownerLatitude"
                        type="number"
                        step="any"
                        value={newOwnerData.latitude}
                        onChange={(e) => {
                          const lat = parseFloat(e.target.value);
                          setNewOwnerData(prev => ({ ...prev, latitude: lat }));
                          if (!isNaN(lat)) {
                            setTransferMapPosition({ lat, lng: newOwnerData.longitude });
                            setTransferErrors(prev => ({ ...prev, latitude: "" }));
                          }
                        }}
                        className={transferErrors.latitude ? "border-red-500" : ""}
                        placeholder="Auto-filled from map"
                      />
                      {transferErrors.latitude && (
                        <p className="text-red-500 text-xs mt-1">{transferErrors.latitude}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="ownerLongitude" className="text-sm font-medium mb-2 block">
                        Longitude <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="ownerLongitude"
                        type="number"
                        step="any"
                        value={newOwnerData.longitude}
                        onChange={(e) => {
                          const lng = parseFloat(e.target.value);
                          setNewOwnerData(prev => ({ ...prev, longitude: lng }));
                          if (!isNaN(lng)) {
                            setTransferMapPosition({ lat: newOwnerData.latitude, lng });
                            setTransferErrors(prev => ({ ...prev, longitude: "" }));
                          }
                        }}
                        className={transferErrors.longitude ? "border-red-500" : ""}
                        placeholder="Auto-filled from map"
                      />
                      {transferErrors.longitude && (
                        <p className="text-red-500 text-xs mt-1">{transferErrors.longitude}</p>
                      )}
                    </div>
                  </div>

                  {/* Google Maps Link (Auto-generated) */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Google Maps Link
                    </Label>
                    <Input
                      type="text"
                      value={`https://maps.google.com/?q=${newOwnerData.latitude},${newOwnerData.longitude}`}
                      readOnly
                      className="bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated from coordinates</p>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  A verification email will be sent to the new owner's email address.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <Alert className="mt-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              <p className="font-medium mb-1">Warning: This action will:</p>
              <ul className="list-disc ml-4 text-xs space-y-1">
                <li>Transfer full ownership rights to the {transferType === "existing" ? "selected user" : "new owner"}</li>
                <li>Change the current owner to an Admin role</li>
                <li>This action cannot be undone without another transfer</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t flex-shrink-0">
          <CustomButton
            variant="outline"
            onClick={() => {
              setTransferOwnershipOpen(false);
              setSelectedNewOwnerId(null);
              setNewOwnerData({
                name: "",
                email: "",
                phone: "",
                panVat: "",
                citizenshipNumber: "",
                address: "",
                latitude: 27.7172,
                longitude: 85.324
              });
              setTransferMapPosition({ lat: 27.7172, lng: 85.324 });
              setTransferErrors({});
              setTransferType("existing");
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="primary"
            onClick={handleTransferOwnership}
          >
            Transfer Ownership
          </CustomButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>

    {/* Unsaved Changes Confirmation Dialog */}
    <AlertDialog open={showCloseConfirmation} onOpenChange={setShowCloseConfirmation}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Would you like to save them?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDiscardChanges}>
            Discard Changes
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSaveAndContinue}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
