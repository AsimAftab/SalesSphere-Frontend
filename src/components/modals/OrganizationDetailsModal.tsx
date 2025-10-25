import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../uix/dialog";
import { Badge } from "../uix/badge";
import CustomButton from "../UI/Button/Button";
import { Separator } from "../uix/separator";
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
  RefreshCw
} from "lucide-react";
import { Input } from "../uix/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../uix/table";
import { Alert, AlertDescription } from "../uix/alert";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../uix/alert-dialog";
import { AddUserModal } from "./AddUserModal";
import { Textarea } from "../uix/textarea";
import { Label } from "../uix/label";
import { CreditCard, FileSpreadsheet } from "lucide-react";
import { SubscriptionManagementModal } from "./SubscriptionManagementModal";
import { BulkUploadPartiesModal } from "./BulkUploadPartiesModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Admin" | "Sales Rep";
  emailVerified: boolean;
  lastActive: string;
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
  mapVersion: string;
  addressLink: string;
  status: "Active" | "Inactive";
  users: User[];
  createdDate: string;
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
  deactivationReason?: string;
  deactivatedDate?: string;
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
    email: ""
  });
  const [transferErrors, setTransferErrors] = useState<Record<string, string>>({});

  // Sync local state when organization prop changes (only when not editing to preserve user input)
  useEffect(() => {
    if (!isEditing) {
      setLocalOrg(organization);
      setEditedOrg(organization);
    }
  }, [organization, isEditing]);

  const handleSendVerification = (email: string, userName: string) => {
    setSendingVerification(true);
    // Simulate sending verification email
    setTimeout(() => {
      setSendingVerification(false);
      toast.success(`Verification email sent to ${userName}`, {
        description: `Once verified, default password will be sent to ${email}`
      });
    }, 1500);
  };

  const handleResetPassword = (userName: string, email: string) => {
    toast.success(`Password reset email sent to ${userName} (${email})`);
  };

  const handleDeactivateOrg = () => {
    const today = new Date().toISOString().split('T')[0];
    const updatedOrg = { 
      ...localOrg, 
      status: "Inactive" as const,
      deactivationReason: deactivationReason || "Manual deactivation by admin",
      deactivatedDate: today
    };
    setLocalOrg(updatedOrg);
    onUpdate?.(updatedOrg);
    setDeactivateDialogOpen(false);
    setDeactivationReason("");
    toast.success(`${organization.name} has been deactivated`, {
      description: "All users have been logged out and access revoked"
    });
  };

  const handleActivateOrg = () => {
    const updatedOrg = { ...localOrg, status: "Active" as const };
    setLocalOrg(updatedOrg);
    onUpdate?.(updatedOrg);
    toast.success(`${organization.name} has been activated`);
  };

  const handleRevokeAccess = (userId: string) => {
    const user = localOrg.users.find(u => u.id === userId);
    if (user) {
      const updatedUsers = localOrg.users.filter(u => u.id !== userId);
      const updatedOrg = { ...localOrg, users: updatedUsers };
      setLocalOrg(updatedOrg);
      onUpdate?.(updatedOrg);
      setRevokeUserId(null);
      toast.success(`Access revoked for ${user.name}`, {
        description: "User has been removed from the organization"
      });
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
    toast.success(`${user.name} has been added`, {
      description: `Verification email will be sent to ${user.email}`
    });
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
    setEditedOrg(localOrg);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedOrg(localOrg);
  };

  const handleSaveChanges = () => {
    setLocalOrg(editedOrg);
    onUpdate?.(editedOrg);
    setIsEditing(false);
    toast.success("Organization updated successfully", {
      description: "All changes have been saved"
    });
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
      }
      if (!newOwnerData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newOwnerData.email)) {
        errors.email = "Invalid email format";
      } else {
        // Check for duplicate email
        const existingUser = localOrg.users.find(
          u => u.email.toLowerCase() === newOwnerData.email.toLowerCase()
        );
        if (existingUser) {
          errors.email = "This email is already in use by another user";
        }
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
    setNewOwnerData({ name: "", email: "" });
    setTransferErrors({});
    setTransferType("existing");

    toast.success(`Ownership transferred to ${newOwnerName}`, {
      description: `${currentOwner.name} is now an Admin`
    });
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
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              >
                <Ban className="w-3 h-3 mr-1.5" />
                Deactivate Organization
              </CustomButton>
            ) : (
              <CustomButton
                variant="primary"
                onClick={handleActivateOrg}
                className="bg-green-600 hover:bg-green-700 text-xs py-1.5 px-4"
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
            <div className="grid grid-cols-2 gap-2">
              {/* Owner Name */}
              <div className="space-y-0.5">
                <p className="text-slate-500 text-xs">Owner</p>
                {isEditing ? (
                  <Input
                    value={editedOrg.owner}
                    onChange={(e) => setEditedOrg({ ...editedOrg, owner: e.target.value })}
                    className="text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-slate-400" />
                    <p className="text-slate-900 text-sm">{localOrg.owner}</p>
                  </div>
                )}
              </div>

              {/* Owner Email */}
              <div className="space-y-0.5">
                <p className="text-slate-500 text-xs">Owner Email</p>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedOrg.ownerEmail}
                    onChange={(e) => setEditedOrg({ ...editedOrg, ownerEmail: e.target.value })}
                    className="text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <p className="text-slate-900 text-sm break-all">{localOrg.ownerEmail}</p>
                    {localOrg.emailVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-0.5 col-span-2">
                <p className="text-slate-500 text-xs">Address</p>
                {isEditing ? (
                  <Input
                    value={editedOrg.address}
                    onChange={(e) => setEditedOrg({ ...editedOrg, address: e.target.value })}
                    className="text-sm"
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-900 text-sm break-words">{localOrg.address}</p>
                  </div>
                )}
              </div>

              {/* Map Version */}
              <div className="space-y-0.5">
                <p className="text-slate-500 text-xs">Map Version</p>
                {isEditing ? (
                  <Input
                    value={editedOrg.mapVersion}
                    onChange={(e) => setEditedOrg({ ...editedOrg, mapVersion: e.target.value })}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-slate-900 text-sm break-words">{localOrg.mapVersion}</p>
                )}
              </div>

              {/* Address Link */}
              <div className="space-y-0.5">
                <p className="text-slate-500 text-xs">Address Link</p>
                {isEditing ? (
                  <Input
                    value={editedOrg.addressLink}
                    onChange={(e) => setEditedOrg({ ...editedOrg, addressLink: e.target.value })}
                    className="text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-3 h-3 text-slate-400" />
                    <a
                      href={localOrg.addressLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate text-sm"
                    >
                      View on Map
                    </a>
                  </div>
                )}
              </div>
            </div>
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
                    <TableRow key={user.id} className="text-sm">
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-xs flex-shrink-0">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-slate-900 text-sm truncate">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm py-2 max-w-[200px] truncate">{user.email}</TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className={`${getRoleBadgeColor(user.role)} text-xs`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        {user.emailVerified ? (
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
                      <TableCell className="text-slate-600 text-xs py-2">{user.lastActive}</TableCell>
                      <TableCell className="text-right py-2">
                        <div className="flex items-center justify-end gap-2">
                          {!user.emailVerified && (
                            <CustomButton
                              variant="ghost"
                              onClick={() => handleSendVerification(user.email, user.name)}
                              className="text-xs py-1 px-3"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Verify
                            </CustomButton>
                          )}
                          {user.emailVerified && (
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
                          ) : (
                            <CustomButton
                              variant="danger"
                              onClick={() => setRevokeUserId(user.id)}
                              className="text-xs py-1 px-3 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Revoke
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
          <CustomButton variant="outline" onClick={onClose}>
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
            This will remove {localOrg.users.find(u => u.id === revokeUserId)?.name} from the organization 
            and immediately revoke their access. This action cannot be undone.
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
        toast.success(`Successfully uploaded ${count} parties`, {
          description: "Parties have been added to the organization"
        });
      }}
    />

    {/* Transfer Ownership Modal */}
    <AlertDialog open={transferOwnershipOpen} onOpenChange={setTransferOwnershipOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            Transfer Ownership
          </AlertDialogTitle>
          <AlertDialogDescription>
            Transfer ownership of <span className="font-semibold">{localOrg.name}</span> to an existing user or add a new owner.
            The current owner will become an Admin.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          {/* Toggle between existing and new user */}
          <div className="flex gap-2 mb-4 border-b">
            <button
              onClick={() => {
                setTransferType("existing");
                setTransferErrors({});
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                transferType === "existing"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Existing User
            </button>
            <button
              onClick={() => {
                setTransferType("new");
                setTransferErrors({});
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                transferType === "new"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              New Owner
            </button>
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="ownerName" className="text-sm font-medium mb-2 block">
                  New Owner Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerName"
                  type="text"
                  placeholder="Enter full name"
                  value={newOwnerData.name}
                  onChange={(e) => {
                    setNewOwnerData(prev => ({ ...prev, name: e.target.value }));
                    setTransferErrors(prev => ({ ...prev, name: "" }));
                  }}
                  className={transferErrors.name ? "border-red-500" : ""}
                />
                {transferErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{transferErrors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ownerEmail" className="text-sm font-medium mb-2 block">
                  New Owner Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={newOwnerData.email}
                  onChange={(e) => {
                    setNewOwnerData(prev => ({ ...prev, email: e.target.value }));
                    setTransferErrors(prev => ({ ...prev, email: "" }));
                  }}
                  className={transferErrors.email ? "border-red-500" : ""}
                />
                {transferErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{transferErrors.email}</p>
                )}
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

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setSelectedNewOwnerId(null);
            setNewOwnerData({ name: "", email: "" });
            setTransferErrors({});
            setTransferType("existing");
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleTransferOwnership}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Transfer Ownership
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
