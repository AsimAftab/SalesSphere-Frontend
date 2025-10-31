import { useState, useEffect } from "react";
import { Building2, Plus, Users, Mail, MapPin, Shield, Search, Loader2, AlertCircle, UserCog, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/uix/card";
import CustomButton from "../../components/UI/Button/Button";
import { Badge } from "../../components/uix/badge";
import { Input } from "../../components/uix/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/uix/tabs";
import { OrganizationDetailsModal } from "../../components/modals/superadmin/OrganizationDetailsModal";
import { AddOrganizationModal } from "../../components/modals/superadmin/AddOrganizationModal";
import { SuperAdminSettingsModal } from "../../components/modals/superadmin/SuperAdminSettingsModal";
import { ActivityLogModal } from "../../components/modals/superadmin/ActivityLogModal";
import SuperAdminStatCard from "../../components/cards/SuperAdmin_cards/SuperAdminStatCard";
import logo from "../../assets/Image/Logo-c.svg";
import {
  getAllOrganizations,
  addOrganization,
  updateOrganization,
} from "../../api/services/superadmin/organizationService";
import type {
  Organization,
  AddOrganizationRequest,
  UpdateOrganizationRequest
} from "../../api/services/superadmin/organizationService";
import { getAllSystemUsers } from "../../api/services/superadmin/systemUserService";
import type { SystemUser } from "../../api/services/superadmin/systemUserService";
import { useNavigate } from "react-router-dom";
import { AddSystemUserModal } from "../../components/modals/superadmin/AddSystemUserModal";
import toast from "react-hot-toast";
import ToastProvider from "../../components/UI/ToastProvider/ToastProvider";

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // System Users state
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [systemUsersLoading, setSystemUsersLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false);

  // Get current logged-in system user
  const currentUser = JSON.parse(localStorage.getItem('systemUser') || '{}');

  // Helper function to get animation delay class based on index
  const getAnimationDelayClass = (baseDelay: number, index: number, increment: number = 0.1): string => {
    const delayMs = Math.round((baseDelay + (index * increment)) * 1000);
    // Map to closest available delay class
    if (delayMs <= 375) return 'animation-delay-350';
    if (delayMs <= 450) return 'animation-delay-400';
    if (delayMs <= 550) return 'animation-delay-500';
    if (delayMs <= 650) return 'animation-delay-600';
    if (delayMs <= 750) return 'animation-delay-700';
    if (delayMs <= 850) return 'animation-delay-800';
    if (delayMs <= 950) return 'animation-delay-900';
    return 'animation-delay-1000';
  };
  const isSuperAdmin = currentUser.role === "Super Admin";

  // Filter out the current logged-in user from the badge list display
  const displaySystemUsers = systemUsers.filter(user => user.id !== currentUser.id);

  // Fetch organizations and system users on mount
  useEffect(() => {
    fetchOrganizations();
    fetchSystemUsers();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrganizations();
      setOrganizations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch organizations";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemUsers = async () => {
    try {
      setSystemUsersLoading(true);
      const data = await getAllSystemUsers();
      setSystemUsers(data);
    } catch (err) {
      toast.error("Failed to fetch system users");
      console.error("Error fetching system users:", err);
    } finally {
      setSystemUsersLoading(false);
    }
  };

  const handleOrgClick = (org: Organization) => {
    setSelectedOrg(org);
    setIsDetailsModalOpen(true);
  };

  const handleOrgUpdate = async (updatedOrg: Organization) => {
    try {
      const updateData: UpdateOrganizationRequest = {
        id: updatedOrg.id,
        name: updatedOrg.name,
        address: updatedOrg.address,
        owner: updatedOrg.owner,
        ownerEmail: updatedOrg.ownerEmail,
        phone: updatedOrg.phone,
        panVat: updatedOrg.panVat,
        latitude: updatedOrg.latitude,
        longitude: updatedOrg.longitude,
        addressLink: updatedOrg.addressLink,
        status: updatedOrg.status,
        emailVerified: updatedOrg.emailVerified,
        subscriptionStatus: updatedOrg.subscriptionStatus,
        subscriptionExpiry: updatedOrg.subscriptionExpiry,
        deactivationReason: updatedOrg.deactivationReason,
        deactivatedDate: updatedOrg.deactivatedDate,
        users: updatedOrg.users
      };

      const updated = await updateOrganization(updateData);
      setOrganizations(orgs =>
        orgs.map(org => org.id === updated.id ? updated : org)
      );
      setSelectedOrg(updated);
      toast.success(`Organization "${updated.name}" updated successfully!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update organization";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating organization:", err);
    }
  };
  //

  const handleAddOrganization = async (newOrg: AddOrganizationRequest) => {
    try {
      const organization = await addOrganization(newOrg);
      setOrganizations([...organizations, organization]);
      setIsAddModalOpen(false);
      toast.success(`Organization "${newOrg.name}" added successfully!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add organization";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error adding organization:", err);
    }
  };

  // Generate cryptographically secure random password
  const generateSecurePassword = (length: number = 8): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => charset[byte % charset.length]).join('');
  };

  const handleAddSystemUser = async (newUser: {
    name: string;
    email: string;
    phone: string;
    role: "Super Admin" | "Developer";
    position: string;
  }) => {
    try {
      // Create a new system user
      const systemUser: SystemUser = {
        id: `su-${String(systemUsers.length + 1).padStart(3, '0')}`,
        name: newUser.name,
        email: newUser.email,
        password: `TempPass@${generateSecurePassword()}`, // Cryptographically secure temporary password
        role: newUser.role,
        phone: newUser.phone,
        position: newUser.position,
        dob: "",
        pan: "",
        citizenship: "",
        gender: "Male",
        location: "",
        photoPreview: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&size=300&background=${newUser.role === "Super Admin" ? "3b82f6" : "10b981"}&color=fff`,
        createdDate: new Date().toISOString().split('T')[0],
        lastActive: "Never",
        isActive: true
      };

      setSystemUsers([...systemUsers, systemUser]);
      setShowAddUserModal(false);

      // Show success message
      toast.success(`System user "${newUser.name}" added successfully! Verification email sent to ${newUser.email}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add system user";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error adding system user:", err);
    }
  };

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && org.status === "Active") ||
                      (activeTab === "inactive" && org.status === "Inactive");
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: organizations.length,
    active: organizations.filter(o => o.status === "Active").length,
    inactive: organizations.filter(o => o.status === "Inactive").length,
    expired: organizations.filter(o => o.subscriptionStatus === "Expired").length
  };

  // Helper function to get organization status colors
  const getOrgStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return "bg-green-600 text-white";
      case 'inactive': return "bg-gray-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  // Helper function to get subscription status colors
  const getSubscriptionStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return "border-green-500 text-green-700";
      case 'expired': return "border-red-500 text-red-700";
      default: return "border-gray-500 text-gray-700";
    }
  };

  // Helper function to get email verification status colors
  const getEmailVerificationColor = (verified: boolean): string => {
    return verified ? "border-green-500 text-green-700" : "border-amber-500 text-amber-700";
  };

  // Helper function to calculate remaining days and get color
  const getRemainingDaysInfo = (expiryDate: string): { text: string; color: string } => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // Expired
      const expiredDays = Math.abs(diffDays);
      return {
        text: `Expired ${expiredDays} ${expiredDays === 1 ? 'day' : 'days'} ago`,
        color: "border-red-500 text-red-700 bg-red-50"
      };
    } else if (diffDays < 30) {
      // Less than 30 days - red
      return {
        text: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`,
        color: "border-red-500 text-red-700 bg-red-50"
      };
    } else if (diffDays <= 60) {
      // 30-60 days - yellow
      return {
        text: `${diffDays} days left`,
        color: "border-amber-500 text-amber-700 bg-amber-50"
      };
    } else {
      // More than 60 days - green
      return {
        text: `${diffDays} days left`,
        color: "border-green-500 text-green-700 bg-green-50"
      };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-slate-600">Loading organizations...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ToastProvider />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Logo and Brand with Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 ">
            <img className="h-16 w-auto" src={logo} alt="SalesSphere" />
            <span className=" text-4xl font-bold">
              <span className="text-secondary">Sales</span>
              <span className="text-gray-800">Sphere</span>
            </span>
          </div>

          {/* Current User Profile and Settings */}
          {currentUser && currentUser.id && (
            <div className="flex items-center gap-3">
              {/* Activity Log Button */}
              <CustomButton
                variant="outline"
                onClick={() => setIsActivityLogModalOpen(true)}
                className="px-3 py-2"
                title="Activity Logs"
              >
                <Activity className="w-5 h-5" />
              </CustomButton>

              {/* Settings Button */}
              <CustomButton
                variant="outline"
                onClick={() => setIsSettingsModalOpen(true)}
                className="px-3 py-2"
                title="Settings"
              >
                <UserCog className="w-5 h-5" />
              </CustomButton>

              {/* User Profile */}
              <div
                onClick={() => navigate(`/system-users/${currentUser.id}`)}
                className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-md border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-purple-200">
                    {currentUser.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">{currentUser.name || 'User'}</p>
                    <Badge
                      className={`text-xs ${currentUser.role === "Super Admin" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}
                    >
                      {currentUser.role || 'User'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-900 font-medium">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <CustomButton
                  variant="outline"
                  onClick={fetchOrganizations}
                  className="text-sm py-2 px-4"
                >
                  Retry
                </CustomButton>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="ml-4">
            <h1 className="text-slate-900 flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-blue-600" />
              Super Admin Dashboard
            </h1>
            <p className="text-slate-600">
              Manage organizations, users, and system access
            </p>
          </div>
          <CustomButton onClick={() => setIsAddModalOpen(true)} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </CustomButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SuperAdminStatCard
            title="Total Organizations"
            value={stats.total}
            valueColor="text-slate-900"
            animationDelay="0s"
          />
          <SuperAdminStatCard
            title="Active"
            value={stats.active}
            valueColor="text-green-600"
            animationDelay="0.1s"
          />
          <SuperAdminStatCard
            title="Inactive/Deactivated"
            value={stats.inactive}
            valueColor="text-slate-500"
            animationDelay="0.2s"
          />
          <SuperAdminStatCard
            title="Subscription Expired"
            value={stats.expired}
            valueColor="text-red-600"
            animationDelay="0.3s"
          />
        </div>

        {/* System Users Section */}
        <Card className="animate-fade-in animation-delay-350 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">System Users</CardTitle>
                  <CardDescription>Manage super admins and developers</CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <Badge variant="outline" className="text-purple-700 border-purple-500">
                  {displaySystemUsers.length} {displaySystemUsers.length === 1 ? 'User' : 'Users'}
                </Badge>
                {isSuperAdmin && (
                  <CustomButton
                    variant="primary"
                    onClick={()=> setShowAddUserModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </CustomButton>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {systemUsersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : displaySystemUsers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No other system users found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displaySystemUsers.map((user, index) => (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/system-users/${user.id}`)}
                    className={`bg-gradient-to-br p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer animate-fade-in ${getAnimationDelayClass(0.4, index)} ${
                      user.isActive
                        ? 'from-slate-50 to-slate-100 border-slate-200 hover:border-purple-300 hover:shadow-lg'
                        : 'from-red-50 to-red-100 border-red-200 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold mb-3 ring-2 ${
                          user.isActive
                            ? 'from-purple-400 to-purple-600 ring-purple-200'
                            : 'from-gray-400 to-gray-600 ring-gray-200'
                        }`}
                      >
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{user.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={user.role === "Super Admin" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}
                        >
                          {user.role}
                        </Badge>
                        {!user.isActive && (
                          <Badge variant="destructive" className="bg-red-600 text-white">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-1">{user.email}</p>
                      <p className="text-xs text-slate-500">Last active: {user.lastActive}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="animate-fade-in animation-delay-400 shadow-md">
          <CardHeader className="py-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mx-auto max-w-6xl px-4">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search organizations or owners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full h-11 text-base"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org, index) => (
            <Card
              key={org.id}
              className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-200 animate-fade-in ${getAnimationDelayClass(0.5, index)}`}
              onClick={() => handleOrgClick(org)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900">{org.name}</CardTitle>
                      <p className="text-slate-500 text-sm">{org.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge
                      className={getOrgStatusColor(org.status)}
                    >
                      {org.status}
                    </Badge>
                    {org.subscriptionStatus === "Expired" && (
                      <Badge variant="outline" className={`${getSubscriptionStatusColor(org.subscriptionStatus)} text-xs`}>
                        Subscription Expired
                      </Badge>
                    )}
                    {!org.emailVerified && (
                      <Badge variant="outline" className={`${getEmailVerificationColor(org.emailVerified)} text-xs`}>
                        <Mail className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    <Badge variant="outline" className={`${getRemainingDaysInfo(org.subscriptionExpiry).color} text-xs`}>
                      {getRemainingDaysInfo(org.subscriptionExpiry).text}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{org.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600">{org.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 truncate">{org.ownerEmail}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 text-sm">{org.users.length} Users</span>
                    </div>
                    <div className="flex -space-x-2">
                      {org.users.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white flex items-center justify-center text-white text-xs"
                          title={user.name}
                        >
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {org.users.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-xs">
                          +{org.users.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Created: {new Date(org.createdDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrgs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No organizations found</p>
              <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      {selectedOrg && (
        <OrganizationDetailsModal
          organization={selectedOrg}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdate={handleOrgUpdate}
        />
      )}
      {
        showAddUserModal && (
          <AddSystemUserModal
            isOpen={showAddUserModal}
            onClose={() => setShowAddUserModal(false)}
            onAdd={handleAddSystemUser}
          />
        )
      }

      <AddOrganizationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddOrganization}
      />

      <SuperAdminSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <ActivityLogModal
        isOpen={isActivityLogModalOpen}
        onClose={() => setIsActivityLogModalOpen(false)}
      />
      </div>
    </>
  );
}
