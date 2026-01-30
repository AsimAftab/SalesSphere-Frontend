import React from 'react';
import { LocationMap } from '../../../../../components/maps/LocationMap';
import { MapPin, Globe } from 'lucide-react';
import Button from '../../../../../components/UI/Button/Button';
import type { Organization } from '../../../../../api/SuperAdmin/organizationService';

interface OrganizationLocationCardProps {
    organization: Organization;
}

export const OrganizationLocationCard: React.FC<OrganizationLocationCardProps> = ({ organization }) => {
    // Computed Google Maps URL
    const googleMapsUrl = organization.addressLink ||
        (organization.latitude && organization.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${organization.latitude},${organization.longitude}`
            : null);

    const mapPosition = {
        lat: organization.latitude || 0,
        lng: organization.longitude || 0
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-6 pb-0">
                <div className="flex flex-row items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">Location</h3>
                        </div>
                    </div>
                    {googleMapsUrl && (
                        <Button
                            size="default"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9 px-4"
                            onClick={() => window.open(googleMapsUrl, '_blank')}
                        >
                            <MapPin className="w-3.5 h-3.5 mr-2" />
                            Open in Google Maps
                        </Button>
                    )}
                </div>
                <div className="h-px bg-gray-300 -mx-6 my-3" />
            </div>
            <div className="p-6 pt-0 flex-1 flex flex-col space-y-5">
                {/* Map - Now First */}
                {mapPosition.lat !== 0 && mapPosition.lng !== 0 && (
                    <div className="flex-1 min-h-[240px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-md">
                        <LocationMap
                            position={mapPosition}
                            onLocationChange={() => { }}
                            onAddressGeocoded={() => { }}
                            isViewerMode={true}
                        />
                    </div>
                )}

                <div>
                    <label className="text-xs font-bold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Full Address
                    </label>
                    <p className="text-sm font-medium text-slate-900 leading-relaxed pl-5">
                        {organization.address || 'N/A'}
                    </p>
                </div>

                <div className="grid grid-cols-2 pt-2">
                    <div>
                        <label className="text-xs font-bold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            Latitude
                        </label>
                        <div className="pl-5">
                            <p className="text-sm font-mono font-medium text-slate-700 inline-block">
                                {organization.latitude || 'N/A'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" />
                            Longitude
                        </label>
                        <div className="pl-5">
                            <p className="text-sm font-mono font-medium text-slate-700 inline-block">
                                {organization.longitude || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
