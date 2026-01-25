import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { LocationMap } from '../../../maps/LocationMap';
import { useFormContext } from 'react-hook-form';

export const LocationSection = () => {
  const { watch, setValue } = useFormContext();
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const address = watch('address');

  const readOnlyFieldClass = "w-full px-4 py-2.5 border rounded-xl bg-gray-50 text-gray-900 border-gray-300";

  const handleMapSync = (location: { lat: number; lng: number }) => {
    setValue('latitude', location.lat, { shouldDirty: true });
    setValue('longitude', location.lng, { shouldDirty: true });
  };

  const handleAddressSync = (addr: string) => {
    setValue('address', addr, { shouldDirty: true });
  };

  return (
    <div className="md:col-span-2 mt-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MapPinIcon className="w-5 h-5 text-blue-600" /> Location Details
      </h3>
      <div className="h-72 rounded-xl overflow-hidden shadow-sm">
        <LocationMap
          position={{ lat: latitude || 27.7172, lng: longitude || 85.324 }}
          onLocationChange={handleMapSync}
          onAddressGeocoded={handleAddressSync}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <p className={`${readOnlyFieldClass} min-h-[42px]`}>{address || 'Auto-filled from map'}</p>
        </div>
        <div>
          <label className="text-sm font-semibold flex items-center gap-1 text-gray-700 mb-1"><GlobeAltIcon className="w-4 h-4" /> Latitude</label>
          <p className={readOnlyFieldClass}>{latitude}</p>
        </div>
        <div>
          <label className="text-sm font-semibold flex items-center gap-1 text-gray-700 mb-1"><GlobeAltIcon className="w-4 h-4" /> Longitude</label>
          <p className={readOnlyFieldClass}>{longitude}</p>
        </div>
      </div>
    </div>
  );
};