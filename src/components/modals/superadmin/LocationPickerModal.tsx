import { useState,  useCallback } from 'react'; // <-- Added useCallback
import { XMarkIcon } from '@heroicons/react/24/outline';
import {createPortal} from 'react-dom';
import { LocationMap } from '../../maps/LocationMap';
import CustomButton from '../../UI/Button/Button';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export function LocationPickerModal({ isOpen, onClose, onLocationSelect }: LocationPickerModalProps) {
  const [position, setPosition] = useState({ lat: 27.7172, lng: 85.324 });
  const [address, setAddress] = useState(""); // <-- 1. Add state for address

  const handleLocationChange = (location: { lat: number; lng: number }) => {
    setPosition(location);
  };

  // --- 2. ADDED: Handler to receive address from map ---
  const handleAddressGeocoded = useCallback((newAddress: string) => {
    setAddress(newAddress);
  }, []);

  const handleSelectLocation = () => {
    // --- 3. FIX: Removed old 'fetch' logic ---
    // The address is now in our state, provided by the map.
    onLocationSelect({ ...position, address });
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Select Location</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {/* --- 4. FIX: Added height and required prop --- */}
          <div className="mb-6 h-80 md:h-96 w-full">
            <LocationMap 
              position={position} 
              onLocationChange={handleLocationChange} 
              onAddressGeocoded={handleAddressGeocoded} 
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
          <CustomButton
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="button"
            variant="primary"
           onClick={handleSelectLocation}
          >
            Select Location
          </CustomButton>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}