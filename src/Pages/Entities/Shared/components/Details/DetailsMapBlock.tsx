// src/pages/Entities/Shared/components/Details/DetailsMapBlock.tsx
import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { LocationMap } from '../../../../../components/maps/LocationMap';
import Button from '../../../../../components/UI/Button/Button';

export const DetailsMapBlock: React.FC<{ lat?: number | null; lng?: number | null }> = ({ lat, lng }) => {
  // ✅ FIX: Corrected Google Maps URL interpolation
  const googleMapsUrl = lat && lng
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : '#';

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col flex-1 h-full">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-blue-600" /> Location Map
        </h3>
      </div>

      {/* ✅ FIX: Ensure relative z-10 for map visibility and flex-1 to fill space */}
      <div className="flex-1 min-h-[300px] relative z-0">
        {lat ? (
          <LocationMap
            isViewerMode={true}
            position={{ lat, lng: lng || 0 }}
            onLocationChange={() => { }}
            onAddressGeocoded={() => { }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
            No Location Data
          </div>
        )}
      </div>

      {lat && (
        <div className="p-4 bg-gray-50 border-t mt-auto">
          {/* ✅ FIX: Ensure target="_blank" and rel="noreferrer" are present */}
          <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="w-full block">
            <Button variant="secondary" className="w-full justify-center">
              <MapPinIcon className="w-4 h-4 mr-2" /> View on Google Maps
            </Button>
          </a>
        </div>
      )}
    </div>
  );
};