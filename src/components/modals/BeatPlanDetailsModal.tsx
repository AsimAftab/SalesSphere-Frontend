import React from 'react';
import { MapPin, X } from 'lucide-react';

export interface Shop {
    _id: string; 
    partyName: string;
    ownerName: string;
    location: {
        address: string;
    };
}

export interface BeatPlanDetail {
    id: string; // Plan ID is string
    employeeName: string;
    employeeRole: string;
    employeeImageUrl: string;
    planName: string;
    dateAssigned: string;
    status: 'active' | 'pending' | 'completed';
    routeSummary: {
        totalShops: number;
    }
    assignedShops: Shop[]; // Shops now use the adapted Shop interface
}

interface BeatPlanDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: BeatPlanDetail | null;
    isLoading: boolean;
}

// --- Helper component for a single shop card (ADAPTED) ---
const ShopCard: React.FC<{ shop: Shop }> = ({ shop }) => {
    return (
        <div className="flex justify-between items-start p-4 border border-gray-200 rounded-lg transition duration-200 hover:border-blue-400 mb-3 last:mb-0">
            <div>
                <h4 className="font-semibold text-gray-800">{shop.partyName}</h4>
                <p className="text-xs text-gray-500 mb-1">{shop.location.address}</p>
                <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-600">Owner: {shop.ownerName}</span>
                </div>
            </div>
            <MapPin size={18} className="text-blue-500" />
        </div>
    );
};


const BeatPlanDetailsModal: React.FC<BeatPlanDetailsModalProps> = ({ isOpen, onClose, plan, isLoading }) => {

    if (!isOpen) return null;

    const size = 'max-w-2xl';
    const title = "Beat Plan Details";

    // Show loading state if open and data is loading
    if (isLoading || !plan) {
      return (
        <div
            className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <div className="p-6 text-center text-blue-500 flex justify-center items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>{isLoading ? 'Loading plan details...' : 'Fetching plan details failed.'}</span>
                </div>
            </div>
        </div>
      );
    }
  
    // --- MAIN MODAL RENDER ---
    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            {/* Modal Content Box */}
            <div
                className={`bg-white rounded-xl shadow-2xl ${size} w-full my-auto transform transition-all`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
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

                {/* Body Content */}
                <div className="p-6">
                    {/* Employee Info Section */}
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 mb-4">
                        <img className="h-12 w-12 rounded-full object-cover" src={plan.employeeImageUrl} alt={plan.employeeName} />
                        <div>
                            <p className="font-semibold text-lg text-gray-800">{plan.employeeName}</p>
                            <p className="text-sm text-gray-500">{plan.planName}</p> 
                        </div>
                    </div>

                    {/* Assigned Shops Section (now full width) */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-700 mb-3">
                            Assigned Parties ({plan.assignedShops.length} Parties)
                        </h3>
                        <div className="max-h-96 overflow-y-auto pr-2">
                            {plan.assignedShops.map(shop => (
                                <ShopCard key={shop._id} shop={shop} />
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default BeatPlanDetailsModal;