import { useState, useEffect } from "react";
import { Building2, Plus, Users, Mail, MapPin, Link as LinkIcon, Shield, Search, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/uix/card";
import CustomButton from "../components/UI/Button/Button";
import { Badge } from "../components/uix/badge";
import { Input } from "../components/uix/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/uix/tabs";
import { OrganizationDetailsModal } from "../components/modals/OrganizationDetailsModal";
import { AddOrganizationModal } from "../components/modals/AddOrganizationModal";
import {
  getAllOrganizations,
  addOrganization,
  updateOrganization,
} from "../api/organizationService";
import type {
  Organization,
  AddOrganizationRequest,
  UpdateOrganizationRequest
} from "../api/organizationService";

export default function SuperAdminPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch organizations");
      console.error("Error fetching organizations:", err);
    } finally {
      setLoading(false);
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
        mapVersion: updatedOrg.mapVersion,
        addressLink: updatedOrg.addressLink,
        status: updatedOrg.status,
        emailVerified: updatedOrg.emailVerified,
        subscriptionStatus: updatedOrg.subscriptionStatus,
        subscriptionExpiry: updatedOrg.subscriptionExpiry,
        deactivationReason: updatedOrg.deactivationReason,
        deactivatedDate: updatedOrg.deactivatedDate
      };

      const updated = await updateOrganization(updateData);
      setOrganizations(orgs =>
        orgs.map(org => org.id === updated.id ? updated : org)
      );
      setSelectedOrg(updated);
    } catch (err) {
      console.error("Error updating organization:", err);
      setError(err instanceof Error ? err.message : "Failed to update organization");
    }
  };

  const handleAddOrganization = async (newOrg: AddOrganizationRequest) => {
    try {
      const organization = await addOrganization(newOrg);
      setOrganizations([...organizations, organization]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error adding organization:", err);
      setError(err instanceof Error ? err.message : "Failed to add organization");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <div>
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
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Organizations</CardDescription>
              <CardTitle className="text-slate-900">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-green-600">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Inactive/Deactivated</CardDescription>
              <CardTitle className="text-slate-500">{stats.inactive}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Subscription Expired</CardDescription>
              <CardTitle className="text-red-600">{stats.expired}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search organizations or owners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
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
          {filteredOrgs.map((org) => (
            <Card
              key={org.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200"
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
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600">{org.mapVersion}</span>
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

      <AddOrganizationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddOrganization}
      />
    </div>
  );
}
