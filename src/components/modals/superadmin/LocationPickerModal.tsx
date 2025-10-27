import { useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { LocationMap } from '../maps/LocationMap';
import CustomButton from '../UI/Button/Button';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export function LocationPickerModal({ isOpen, onClose, onLocationSelect }: LocationPickerModalProps) {
  const [position, setPosition] = useState({ lat: 27.7172, lng: 85.324 });

  const handleLocationChange = (location: { lat: number; lng: number }) => {
    setPosition(location);
  };

  const handleSelectLocation = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || '';
      onLocationSelect({ ...position, address });
      onClose();
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
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
          <LocationMap position={position} onLocationChange={handleLocationChange} />
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
