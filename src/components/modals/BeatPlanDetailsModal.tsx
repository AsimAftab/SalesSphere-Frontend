import React, { useState, useEffect } from 'react';
import { MapPin, X, Store, Building } from 'lucide-react';

export interface Directory {
  _id: string;
  name: string;
  ownerName: string;
  type: 'party' | 'site' | 'prospect';
  location: {
    address: string;
  };
}

export interface BeatPlanDetail {
  id: string;
  employeeName: string;
  employeeRole: string;
  employeeImageUrl: string;
  planName: string;
  dateAssigned: string;
  status: 'active' | 'pending' | 'completed';
  routeSummary: {
    totalDirectories: number;
  };
  assignedDirectories: Directory[];
}

interface BeatPlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BeatPlanDetail | null;
  isLoading: boolean;
}

const EmployeeAvatar: React.FC<{ name: string; imageUrl: string }> = ({ name, imageUrl }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const getInitial = (str: string) => {
    if (!str) return '?';
    return str.trim().charAt(0).toUpperCase();
  };

  if (!imageUrl || imgError) {
    return (
      <div className="h-12 w-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg border border-gray-200 shrink-0">
        {getInitial(name)}
      </div>
    );
  }

  return (
    <img
      className="h-12 w-12 rounded-full object-cover border border-gray-200 shrink-0"
      src={imageUrl}
      alt={name}
      onError={() => setImgError(true)} 
    />
  );
};

const DirectoryCard: React.FC<{ directory: Directory }> = ({ directory }) => {
  const getIcon = () => {
    switch (directory.type) {
      case 'party':
        return <Store size={18} className="text-blue-500" />;
      case 'site':
        return <Building size={18} className="text-orange-500" />;
      case 'prospect':
        return <Store size={18} className="text-green-500" />;
      default:
        return <MapPin size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex justify-between items-start p-4 border border-gray-200 rounded-lg transition duration-200 hover:border-blue-400 mb-3 last:mb-0">
      <div>
        <h4 className="font-semibold text-gray-800">{directory.name}</h4>
        <p className="text-xs text-gray-500 mb-1">{directory.location.address}</p>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-600">Owner: {directory.ownerName}</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              directory.type === 'party'
                ? 'bg-blue-100 text-blue-700'
                : directory.type === 'site'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {directory.type}
          </span>
        </div>
      </div>
      {getIcon()}
    </div>
  );
};

const BeatPlanDetailsModal: React.FC<BeatPlanDetailsModalProps> = ({
  isOpen,
  onClose,
  plan,
  isLoading,
}) => {
  if (!isOpen) return null;

  const size = 'max-w-2xl';
  const title = 'Beat Plan Details';

  if (isLoading || !plan) {
    return (
      <div
        className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 text-center text-blue-500 flex justify-center items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>
              {isLoading
                ? 'Loading plan details...'
                : 'Fetching plan details failed.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl ${size} w-full my-auto transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
      
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 mb-4">
            <EmployeeAvatar 
                name={plan.employeeName} 
                imageUrl={plan.employeeImageUrl} 
            />

            <div>
              <p className="font-semibold text-lg text-gray-800">
                {plan.employeeName}
              </p>
              <p className="text-sm text-gray-500">{plan.planName}</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-3">
              Assigned Directories ({plan.routeSummary.totalDirectories} Total)
            </h3>
            <div className="max-h-96 overflow-y-auto pr-2">
              {plan.assignedDirectories.map((dir) => (
                <DirectoryCard key={dir._id} directory={dir} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatPlanDetailsModal;