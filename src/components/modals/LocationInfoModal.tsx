import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui';

// This type should match the 'Location' type defined in TerritoryView.tsx
type Location = {
  id: string;
  type: 'Prospect' | 'Party' | 'Site';
  name: string;
  address: string;
  status: 'Hot Lead' | 'Cold' | 'Warm';
  coords: { top: string; left: string };
};

type LocationInfoModalProps = {
  location: Location;
  onClose: () => void;
};

// Helper to get status colors
const getStatusClasses = (status: Location['status']) => {
  switch (status) {
    case 'Hot Lead':
      return 'bg-green-100 text-green-700';
    case 'Warm':
      return 'bg-yellow-100 text-yellow-700';
    case 'Cold':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const LocationInfoModal = ({ location, onClose }: LocationInfoModalProps) => {
  return (
    // Backdrop
    <div
      onClick={onClose}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
      role="button"
      tabIndex={0}
      className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal itself
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg shadow-xl w-full max-w-sm"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {location.type}
            </span>
            <h2 className="text-lg font-bold text-gray-800">{location.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-4">
            <span className="text-xs text-gray-500">Address</span>
            <p className="text-gray-700 flex items-center">
              <MapPin size={14} className="mr-2 text-gray-400" />
              {location.address}
            </p>
          </div>

          <div className="mb-2">
            <span className="text-xs text-gray-500">Status</span>
            <div
              className={`inline-block px-3 py-0.5 rounded-full text-sm font-semibold ${getStatusClasses(
                location.status
              )}`}
            >
              {location.status}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-gray-50 rounded-b-lg flex gap-3">
          <Button variant="primary" className="flex-1 !rounded-lg !py-2">
            View Details
          </Button>
          <Button variant="outline" className="flex-1 !rounded-lg !py-2">
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationInfoModal;