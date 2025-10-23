import { useState } from "react";
import { Building2, Plus, Users, Mail, MapPin, Link as LinkIcon, Shield, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/uix/card";
import { Button } from "../components/uix/button";
import { Badge } from "../components/uix/badge";
import { Input } from "../components/uix/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/uix/tabs";
import { OrganizationDetailsModal } from "../components/modals/OrganizationDetailsModal";
import { AddOrganizationModal } from "../components/modals/AddOrganizationModal";

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
  mapVersion: string;
  addressLink: string;
  status: "Active" | "Inactive";
  users: User[];
  createdDate: string;
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired" | "Trial";
  subscriptionExpiry: string;
  deactivationReason?: string;
  deactivatedDate?: string;
}

// Mock data
const mockOrganizations: Organization[] = [
  {
    id: "org-001",
    name: "TechCorp Solutions",
    address: "123 Tech Street, San Francisco, CA 94105",
    owner: "John Anderson",
    ownerEmail: "john.anderson@techcorp.com",
    mapVersion: "Google Maps API v3.52",
    addressLink: "https://maps.google.com/?q=TechCorp+Solutions",
    status: "Active",
    emailVerified: true,
    createdDate: "2024-08-15",
    subscriptionStatus: "Active",
    subscriptionExpiry: "2025-08-15",
    users: [
      {
        id: "u-001",
        name: "John Anderson",
        email: "john.anderson@techcorp.com",
        role: "Owner",
        emailVerified: true,
        lastActive: "2 hours ago"
      },
      {
        id: "u-002",
        name: "Sarah Mitchell",
        email: "sarah.mitchell@techcorp.com",
        role: "Manager",
        emailVerified: true,
        lastActive: "5 minutes ago"
      },
      {
        id: "u-003",
        name: "Mike Johnson",
        email: "mike.johnson@techcorp.com",
        role: "Sales Rep",
        emailVerified: true,
        lastActive: "1 hour ago"
      },
      {
        id: "u-004",
        name: "Emily Davis",
        email: "emily.davis@techcorp.com",
        role: "Admin",
        emailVerified: true,
        lastActive: "30 minutes ago"
      }
    ]
  },
  {
    id: "org-002",
    name: "Global Retail Inc",
    address: "456 Commerce Ave, New York, NY 10001",
    owner: "Maria Garcia",
    ownerEmail: "maria.garcia@globalretail.com",
    mapVersion: "Mapbox GL v2.14",
    addressLink: "https://maps.google.com/?q=Global+Retail+Inc",
    status: "Active",
    emailVerified: true,
    createdDate: "2024-09-20",
    subscriptionStatus: "Active",
    subscriptionExpiry: "2025-09-20",
    users: [
      {
        id: "u-005",
        name: "Maria Garcia",
        email: "maria.garcia@globalretail.com",
        role: "Owner",
        emailVerified: true,
        lastActive: "10 minutes ago"
      },
      {
        id: "u-006",
        name: "Robert Chen",
        email: "robert.chen@globalretail.com",
        role: "Manager",
        emailVerified: true,
        lastActive: "3 hours ago"
      },
      {
        id: "u-007",
        name: "Lisa Wong",
        email: "lisa.wong@globalretail.com",
        role: "Manager",
        emailVerified: true,
        lastActive: "1 day ago"
      }
    ]
  },
  {
    id: "org-003",
    name: "ProSales Dynamics",
    address: "789 Business Blvd, Austin, TX 78701",
    owner: "David Thompson",
    ownerEmail: "david.thompson@prosales.com",
    mapVersion: "Google Maps API v3.52",
    addressLink: "https://maps.google.com/?q=ProSales+Dynamics",
    status: "Inactive",
    emailVerified: false,
    createdDate: "2024-10-10",
    subscriptionStatus: "Trial",
    subscriptionExpiry: "2024-10-24",
    users: [
      {
        id: "u-008",
        name: "David Thompson",
        email: "david.thompson@prosales.com",
        role: "Owner",
        emailVerified: false,
        lastActive: "Never"
      }
    ]
  },
  {
    id: "org-004",
    name: "Apex Distribution",
    address: "321 Logistics Lane, Chicago, IL 60601",
    owner: "Jennifer Lee",
    ownerEmail: "jennifer.lee@apexdist.com",
    mapVersion: "OpenStreetMap",
    addressLink: "https://maps.google.com/?q=Apex+Distribution",
    status: "Active",
    emailVerified: true,
    createdDate: "2024-07-05",
    subscriptionStatus: "Active",
    subscriptionExpiry: "2025-07-05",
    users: [
      {
        id: "u-009",
        name: "Jennifer Lee",
        email: "jennifer.lee@apexdist.com",
        role: "Owner",
        emailVerified: true,
        lastActive: "4 hours ago"
      },
      {
        id: "u-010",
        name: "James Wilson",
        email: "james.wilson@apexdist.com",
        role: "Admin",
        emailVerified: true,
        lastActive: "2 hours ago"
      },
      {
        id: "u-011",
        name: "Amanda Brown",
        email: "amanda.brown@apexdist.com",
        role: "Manager",
        emailVerified: true,
        lastActive: "45 minutes ago"
      },
      {
        id: "u-012",
        name: "Chris Martinez",
        email: "chris.martinez@apexdist.com",
        role: "Sales Rep",
        emailVerified: true,
        lastActive: "15 minutes ago"
      },
      {
        id: "u-013",
        name: "Patricia Taylor",
        email: "patricia.taylor@apexdist.com",
        role: "Sales Rep",
        emailVerified: true,
        lastActive: "1 hour ago"
      }
    ]
  },
  {
    id: "org-005",
    name: "Northwest Trading Co",
    address: "555 Market Street, Seattle, WA 98101",
    owner: "Michael Chang",
    ownerEmail: "michael.chang@nwtrading.com",
    mapVersion: "Mapbox GL v2.14",
    addressLink: "https://maps.google.com/?q=Northwest+Trading",
    status: "Inactive",
    emailVerified: true,
    createdDate: "2024-06-12",
    subscriptionStatus: "Expired",
    subscriptionExpiry: "2024-09-12",
    deactivationReason: "Subscription expired - payment not received",
    deactivatedDate: "2024-09-12",
    users: [
      {
        id: "u-014",
        name: "Michael Chang",
        email: "michael.chang@nwtrading.com",
        role: "Owner",
        emailVerified: true,
        lastActive: "2 weeks ago"
      },
      {
        id: "u-015",
        name: "Sandra Kim",
        email: "sandra.kim@nwtrading.com",
        role: "Manager",
        emailVerified: true,
        lastActive: "1 week ago"
      }
    ]
  }
];

export default function SuperAdminPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleOrgClick = (org: Organization) => {
    setSelectedOrg(org);
    setIsDetailsModalOpen(true);
  };

  const handleOrgUpdate = (updatedOrg: Organization) => {
    setOrganizations(orgs => 
      orgs.map(org => org.id === updatedOrg.id ? updatedOrg : org)
    );
    setSelectedOrg(updatedOrg);
  };

  const handleAddOrganization = (newOrg: Omit<Organization, "id" | "createdDate" | "users">) => {
    const organization: Organization = {
      ...newOrg,
      id: `org-${String(organizations.length + 1).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      users: [
        {
          id: `u-${Date.now()}`,
          name: newOrg.owner,
          email: newOrg.ownerEmail,
          role: "Owner",
          emailVerified: false,
          lastActive: "Never"
        }
      ]
    };
    setOrganizations([...organizations, organization]);
    setIsAddModalOpen(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </Button>
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
                      variant={org.status === "Active" ? "default" : "secondary"}
                      className={org.status === "Active" ? "bg-green-500 hover:bg-green-600" : "bg-slate-400"}
                    >
                      {org.status}
                    </Badge>
                    {org.subscriptionStatus === "Expired" && (
                      <Badge variant="outline" className="border-red-500 text-red-700 text-xs">
                        Subscription Expired
                      </Badge>
                    )}
                    {org.subscriptionStatus === "Trial" && (
                      <Badge variant="outline" className="border-blue-500 text-blue-700 text-xs">
                        Trial
                      </Badge>
                    )}
                    {!org.emailVerified && (
                      <Badge variant="outline" className="border-amber-500 text-amber-700 text-xs">
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
                      {org.users.slice(0, 3).map((user, idx) => (
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
