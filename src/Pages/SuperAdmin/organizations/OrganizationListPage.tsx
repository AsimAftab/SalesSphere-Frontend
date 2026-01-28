import { useState, useEffect } from 'react';
import {
    BuildingOfficeIcon,
    MagnifyingGlassIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { addOrganization } from '../../../api/SuperAdmin/organizationService';
import type { Organization } from '../../../api/SuperAdmin/organizationService';
import { getSystemOverview } from '../../../api/SuperAdmin/systemOverviewService';
import type { OrganizationFromAPI } from '../../../api/SuperAdmin/systemOverviewService';
import { Button } from '../../../components/UI/SuperadminComponents/button';
import { Input } from '../../../components/UI/SuperadminComponents/input';
import { Tabs, TabsList, TabsTrigger } from '../../../components/UI/SuperadminComponents/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/UI/SuperadminComponents/card';
import { Badge } from '../../../components/UI/SuperadminComponents/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { OrganizationDetailsModal } from '../../../components/modals/superadmin/OrganizationDetailsModal';
import { AddOrganizationModal } from '../../../components/modals/superadmin/AddOrganizationModal';

// Helper to transform API data to frontend model
const transformOrganization = (org: OrganizationFromAPI): Organization => {
    return {
        id: org.id || org._id,
        name: org.name,
        // Optional fields might be missing in API response, provide defaults
        address: org.address || '',
        phone: org.phone || '',
        emailVerified: true, // Defaulting as this might not be in the overview list
        // Map owner object to flattened fields
        owner: org.owner?.name || 'Unknown',
        ownerEmail: org.owner?.email || '',

        panVat: org.panVatNumber,
        latitude: 0, // Not in overview list
        longitude: 0, // Not in overview list
        addressLink: '', // Not in overview list

        status: org.isActive ? 'Active' : 'Inactive',
        subscriptionStatus: org.isSubscriptionActive ? "Active" : "Expired",
        subscriptionExpiry: org.subscriptionEndDate,
        createdDate: org.createdAt || new Date().toISOString(),

        // Populate required array with dummy or mapped data if needed
        users: org.owner ? [{
            id: org.owner.id || org.owner._id,
            name: org.owner.name,
            email: org.owner.email,
            role: 'Owner',
            emailVerified: true,
            isActive: true,
            lastActive: 'N/A'
        }] : []
    };
};

export default function OrganizationListPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // Modals
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const data = await getSystemOverview();

            // Fix: Access .list from the organizations object
            const orgList = data.organizations?.list || [];

            // Map strictly typed API response to Frontend model
            const mappedOrgs = orgList.map(transformOrganization);
            setOrganizations(mappedOrgs);
        } catch (error) {
            console.error("Error fetching organizations:", error);
            toast.error("Failed to load organizations");
        } finally {
            setLoading(false);
        }
    };

    const handleOrgClick = (org: Organization) => {
        setSelectedOrg(org);
        setIsDetailsModalOpen(true);
    };

    const handleAddOrganization = async (orgData: any) => {
        try {
            // Service expects the raw data object, not FormData
            await addOrganization(orgData);
            toast.success('Organization added successfully');
            setIsAddModalOpen(false);
            fetchOrganizations(); // Refresh list
        } catch (error: any) {
            console.error('Error adding organization:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to add organization');
        }
    };

    // Filtering Logic
    const filteredOrganizations = organizations.filter(org => {
        const matchesSearch =
            org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            org.owner.toLowerCase().includes(searchQuery.toLowerCase()); // owner is string name

        if (activeTab === "all") return matchesSearch;
        if (activeTab === "active") return matchesSearch && org.status === "Active";
        if (activeTab === "inactive") return matchesSearch && org.status === "Inactive";
        return matchesSearch;
    });

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Active': return 'default'; // usually green/primary
            case 'Inactive': return 'secondary';
            case 'Expired': return 'destructive';
            default: return 'outline';
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Organizations</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage all tenant organizations, subscriptions, and statuses.
                    </p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Organization
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-72">
                    <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search organizations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredOrganizations.map((org) => (
                    <Card
                        key={org.id}
                        className="cursor-pointer transition-all hover:shadow-md"
                        onClick={() => handleOrgClick(org)}
                    >
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BuildingOfficeIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">{org.name}</CardTitle>
                                    <CardDescription className="text-xs">
                                        Since {new Date(org.createdDate).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant={getStatusBadgeVariant(org.status)}>{org.status}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Owner:</span>
                                    <span className="font-medium">{org.owner || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-medium">{org.subscriptionStatus}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Location:</span>
                                    <span className="font-medium truncate max-w-[150px]">{org.address || 'N/A'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedOrg && (
                <OrganizationDetailsModal
                    organization={selectedOrg}
                    isOpen={isDetailsModalOpen}
                    onClose={() => {
                        setIsDetailsModalOpen(false);
                        setSelectedOrg(null);
                    }}
                    onUpdate={() => {
                        fetchOrganizations();
                        setIsDetailsModalOpen(false);
                    }}
                />
            )}

            {/* Add Modal */}
            <AddOrganizationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddOrganization}
            />
        </div>
    );
}
