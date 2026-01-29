import React from 'react';
import { Building2, Mail, Phone, MapPin, User, CreditCard, Clock, Globe, Shield, Calendar, Users as UsersIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/UI/SuperadminComponents/card';
import { Badge } from '../../../../components/UI/SuperadminComponents/badge';
import { Alert, AlertDescription } from '../../../../components/UI/SuperadminComponents/alert';
import { LocationMap } from '../../../../components/maps/LocationMap';
import type { OrganizationFromAPI } from '../../../../api/SuperAdmin/systemOverviewService';
import { OrganizationDetailsHeader } from './components/OrganizationDetailsHeader';

interface OrganizationContentSectionProps {
    organization: OrganizationFromAPI;
    onEdit: () => void;
    onDeactivate: () => void;
    onBulkImport: () => void;
}

const OrganizationContentSection: React.FC<OrganizationContentSectionProps> = ({
    organization,
    onEdit,
    onDeactivate,
    onBulkImport
}) => {
    // Type assertion to access extended properties
    const org = organization as any;

    const getStatusColor = (status: boolean) => {
        return status ? 'bg-green-600 text-white' : 'bg-gray-600 text-white';
    };

    const getSubscriptionColor = (status: boolean) => {
        return status ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
    };

    // Extract coordinates
    let lat = org.latitude || 0;
    let lng = org.longitude || 0;

    if ((lat === 0 || lng === 0) && org.googleMapLink) {
        const match = org.googleMapLink.match(/q=([-\d.]+),([-\d.]+)/);
        if (match) {
            lat = parseFloat(match[1]);
            lng = parseFloat(match[2]);
        }
    }

    const mapPosition = { lat, lng };

    // Calculate subscription days remaining
    const calculateDaysRemaining = () => {
        if (!organization.subscriptionEndDate) return null;
        const endDate = new Date(organization.subscriptionEndDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = calculateDaysRemaining();

    // Header actions
    const headerActions = [
        { label: 'Bulk Import', onClick: onBulkImport, variant: 'outline' as const },
        { label: 'Edit', onClick: onEdit, variant: 'primary' as const },
        {
            label: organization.isActive ? 'Deactivate' : 'Activate',
            onClick: onDeactivate,
            variant: 'outline' as const,
            className: organization.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <OrganizationDetailsHeader
                title="Organization Details"
                backPath="/system-admin/organizations"
                actions={headerActions}
            />

            {/* Header Card with Status */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{organization.name}</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">{organization._id}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge className={getStatusColor(organization.isActive)}>
                                {organization.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline" className={getSubscriptionColor(organization.isSubscriptionActive)}>
                                {organization.isSubscriptionActive ? 'Subscribed' : 'Expired'}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Subscription Alert */}
            {daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-800">
                        ⚠️ Subscription expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                    </AlertDescription>
                </Alert>
            )}

            {daysRemaining !== null && daysRemaining <= 0 && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                        ❌ Subscription expired {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 ? 's' : ''} ago
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Organization Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Organization Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Organization Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Owner Name
                                        </label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {organization.owner?.name || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Owner Email
                                        </label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {organization.owner?.email || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone Number
                                        </label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {organization.phone || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            PAN/VAT Number
                                        </label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {organization.panVatNumber || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Timezone
                                        </label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {org.timezone || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Created Date
                                        </label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {new Date(organization.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Working Hours */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Working Hours
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-500">Check-In Time</label>
                                    <p className="text-base font-semibold text-slate-900 mt-1">
                                        {org.checkInTime || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-500">Check-Out Time</label>
                                    <p className="text-base font-semibold text-slate-900 mt-1">
                                        {org.checkOutTime || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-500">Half Day Checkout</label>
                                    <p className="text-base font-semibold text-slate-900 mt-1">
                                        {org.halfDayCheckOutTime || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-500">Weekly Off Day</label>
                                    <p className="text-base font-semibold text-slate-900 mt-1">
                                        {org.weeklyOffDay || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-500">Geo-Fencing</label>
                                    <p className="text-base font-semibold text-slate-900 mt-1">
                                        {org.geoFencing ? 'Enabled' : 'Disabled'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users & Access */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-blue-600" />
                                Users & Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {organization.owner && (
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                                {organization.owner.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{organization.owner.name}</p>
                                                <p className="text-sm text-slate-500">{organization.owner.email}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-blue-600 text-white">Owner</Badge>
                                    </div>
                                )}
                                <p className="text-sm text-slate-500 italic mt-4">
                                    🔜 Full user management coming soon
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscription Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Subscription Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Status</span>
                                    <Badge className={getSubscriptionColor(organization.isSubscriptionActive)}>
                                        {organization.isSubscriptionActive ? 'Active' : 'Expired'}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-500">Subscription Type</label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {organization.subscriptionType || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-500">Start Date</label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {organization.subscriptionStartDate
                                                ? new Date(organization.subscriptionStartDate).toLocaleDateString()
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-500">End Date</label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">
                                            {organization.subscriptionEndDate
                                                ? new Date(organization.subscriptionEndDate).toLocaleDateString()
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {daysRemaining !== null && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-800">
                                            {daysRemaining > 0
                                                ? `📅 ${daysRemaining} days remaining`
                                                : `⏰ Expired ${Math.abs(daysRemaining)} days ago`
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Location */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-500">Address</label>
                                    <p className="text-base font-semibold text-slate-900 mt-1">
                                        {organization.address || 'N/A'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-500">Latitude</label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">{lat}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-500">Longitude</label>
                                        <p className="text-base font-semibold text-slate-900 mt-1">{lng}</p>
                                    </div>
                                </div>

                                {/* Map */}
                                {lat !== 0 && lng !== 0 && (
                                    <div className="h-80 w-full rounded-lg overflow-hidden border border-slate-200">
                                        <LocationMap
                                            position={mapPosition}
                                            onLocationChange={() => { }}
                                            onAddressGeocoded={() => { }}
                                            isViewerMode={true}
                                        />
                                    </div>
                                )}

                                {org.googleMapLink && (
                                    <div>
                                        <a
                                            href={org.googleMapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            Open in Google Maps
                                        </a>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrganizationContentSection;
