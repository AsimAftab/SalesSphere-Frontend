import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { LocationMap } from '../../../maps/LocationMap';

export const LocationSection = ({ formData, setFormData }: any) => {
  const readOnlyFieldClass = "w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 border-gray-300";

  const handleMapSync = (location: { lat: number; lng: number }) => {
    setFormData((prev: any) => ({ ...prev, latitude: location.lat, longitude: location.lng }));
  };

  const handleAddressSync = (address: string) => {
    setFormData((prev: any) => ({ ...prev, address: address }));
  };

  return (
    <div className="md:col-span-2 mt-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MapPinIcon className="w-5 h-5 text-blue-600" /> Location Details
      </h3>
      <div className="h-72 rounded-lg overflow-hidden ">
        <LocationMap 
          position={{ lat: formData.latitude, lng: formData.longitude }} 
          onLocationChange={handleMapSync} 
          onAddressGeocoded={handleAddressSync} 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <p className={`${readOnlyFieldClass} min-h-[42px]`}>{formData.address || 'Auto-filled from map'}</p>
        </div>
        <div>
          <label className="text-sm flex items-center gap-1"><GlobeAltIcon className="w-4 h-4"/> Latitude</label>
          <p className={readOnlyFieldClass}>{formData.latitude}</p>
        </div>
        <div>
          <label className="text-sm flex items-center gap-1"><GlobeAltIcon className="w-4 h-4"/> Longitude</label>
          <p className={readOnlyFieldClass}>{formData.longitude}</p>
        </div>
      </div>
    </div>
  );
};