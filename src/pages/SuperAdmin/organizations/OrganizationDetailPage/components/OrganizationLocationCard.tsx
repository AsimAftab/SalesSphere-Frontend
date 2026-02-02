import React from 'react';
import { LocationMap } from '@/components/maps/LocationMap';
import { MapPin, Globe, Earth } from 'lucide-react';
import type { Organization } from '@/api/SuperAdmin/organizationService';
import { Button, EmptyState, InfoBlock } from '@/components/ui';

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
                {/* Map or Empty State */}
                {mapPosition.lat !== 0 && mapPosition.lng !== 0 ? (
                    <div className="flex-1 min-h-[240px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-md">
                        <LocationMap
                            position={mapPosition}
                            onLocationChange={() => { }}
                            onAddressGeocoded={() => { }}
                            isViewerMode={true}
                        />
                    </div>
                ) : (
                    <div className="flex-1 min-h-[240px] w-full flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                        <EmptyState
                            title="No Location Data"
                            description="Location coordinates are missing for this organization."
                            icon={<MapPin className="w-10 h-10 text-slate-300" />}
                        />
                    </div>
                )}

                <InfoBlock icon={MapPin} label="Full Address" value={organization.address} />

                <div className="grid grid-cols-2 pt-2 gap-4">
                    <InfoBlock icon={Globe} label="Latitude" value={organization.latitude} />
                    <InfoBlock icon={Earth} label="Longitude" value={organization.longitude} />
                </div>
            </div>
        </div>
    );
};
