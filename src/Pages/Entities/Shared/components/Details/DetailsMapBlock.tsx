// src/pages/Entities/Shared/components/Details/DetailsMapBlock.tsx
import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { LocationMap } from '../../../../../components/maps/LocationMap';
import Button from '../../../../../components/UI/Button/Button';

interface DetailsMapBlockProps {
  lat?: number | null;
  lng?: number | null;
}

export const DetailsMapBlock: React.FC<DetailsMapBlockProps> = ({ lat, lng }) => {
  const hasLocation = !!(lat && lng);
  const googleMapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col flex-1 h-full">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">Location</h3>
            </div>
          </div>
        </div>
        <div className="h-px bg-gray-300 -mx-6 my-3" />
      </div>

      {/* Content */}
      <div className="px-6 pb-6 flex-1 flex flex-col space-y-6">
        {/* Map */}
        {hasLocation ? (
          <div className="flex-1 min-h-[240px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-md">
            <LocationMap
              position={{ lat: lat!, lng: lng || 0 }}
              onLocationChange={() => {}}
              onAddressGeocoded={() => {}}
              isViewerMode={true}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-[240px] w-full rounded-xl overflow-hidden border border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50 gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <MapPinIcon className="w-7 h-7 text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-400">No Location Data</p>
              <p className="text-xs text-gray-300 mt-0.5">Coordinates not available</p>
            </div>
          </div>
        )}
        {googleMapsUrl && (
            <Button
              variant="primary"
              className="shadow-sm h-12 w-full"
              onClick={() => window.open(googleMapsUrl, '_blank')}
            >
              <MapPinIcon className="w-3.5 h-3.5 mr-2" />
              Open in Google Maps
            </Button>
          )}

      </div>
    </div>
  );
};
