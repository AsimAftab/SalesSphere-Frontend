import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/SuperadminComponents/AlertDialog";
import { Label } from "@/components/ui/SuperadminComponents/label";
import { Alert, AlertDescription } from "@/components/ui/SuperadminComponents/alert";
import {
  AlertCircle,
  RefreshCw,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { AddUserModal } from "./AddUserModal";
import { Button as CustomButton } from '@/components/ui';

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

interface TransferOwnershipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organizationName: string;
  users: User[];
  onTransferToExisting: (userId: string) => void;
  onTransferToNew: (userData: Record<string, unknown>) => void;
}

export function TransferOwnershipDialog({
  isOpen,
  onClose,
  organizationName,
  users,
  onTransferToExisting,
  onTransferToNew,
}: TransferOwnershipDialogProps) {
  const [transferType, setTransferType] = useState<"existing" | "new">("existing");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const handleTransfer = () => {
    if (transferType === "existing") {
      if (!selectedUserId) {
        return;
      }
      onTransferToExisting(selectedUserId);
      handleClose();
    } else {
      // Open AddUserModal
      setShowAddUserModal(true);
    }
  };

  const handleAddNewOwner = (userData: Record<string, unknown>) => {
    onTransferToNew(userData);
    setShowAddUserModal(false);
    handleClose();
  };

  const handleClose = () => {
    setSelectedUserId("");
    setTransferType("existing");
    onClose();
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={handleClose}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              Transfer Ownership
            </AlertDialogTitle>
            <AlertDialogDescription>
              Transfer ownership of <span className="font-semibold">{organizationName}</span> to an
              existing user or create a new owner. The current owner will become an Admin.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            {/* Toggle between existing and new user */}
            <div className="flex gap-2 mb-6 border-b">
              <CustomButton
                variant="ghost"
                onClick={() => setTransferType("existing")}
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
                onClick={() => setTransferType("new")}
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
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select new owner"
                >
                  <option value="">Choose a user...</option>
                  {users
                    .filter((u) => u.role !== "Owner")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.role} ({user.email})
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserPlus className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Create New Owner</h3>
                <p className="text-gray-600 mb-4">
                  Click the button below to add a new user who will become the owner of this
                  organization.
                </p>
              </div>
            )}

            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <p className="font-medium mb-1">Warning: This action will:</p>
                <ul className="list-disc ml-4 text-xs space-y-1">
                  <li>
                    Transfer full ownership rights to the{" "}
                    {transferType === "existing" ? "selected user" : "new owner"}
                  </li>
                  <li>Change the current owner to an Admin role</li>
                  <li>This action cannot be undone without another transfer</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <CustomButton variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton
              variant="primary"
              onClick={handleTransfer}
              disabled={transferType === "existing" && !selectedUserId}
            >
              {transferType === "existing" ? "Transfer Ownership" : "Add New Owner"}
            </CustomButton>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* AddUserModal for creating new owner */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAdd={handleAddNewOwner}
        organizationName={organizationName}
      />
    </>
  );
}
