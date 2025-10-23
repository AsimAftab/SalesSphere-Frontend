import React from 'react';
import { MapPin, X } from 'lucide-react';

// --- TYPE DEFINITIONS (These are EXPORTED for use in BeatPlanPage.tsx) ---
export interface Shop {
    id: number;
    name: string;
    address: string;
    priority: 'High' | 'Medium' | 'Low';
    zone: string;
}

export interface BeatPlanDetail {
    id: number;
    employeeName: string;
    employeeRole: string;
    employeeImageUrl: string;
    planName: string;
    dateAssigned: string;
    status: 'active' | 'pending';
    routeSummary: {
        totalShops: number;
        highPriority: number;
    }
    assignedShops: Shop[];
}


interface BeatPlanDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: BeatPlanDetail | null;
}

// --- Helper component for a single shop card ---
const ShopCard: React.FC<{ shop: Shop }> = ({ shop }) => {
    const priorityClasses = {
        'High': 'text-red-600 bg-red-100',
        'Medium': 'text-yellow-600 bg-yellow-100',
        'Low': 'text-blue-600 bg-blue-100',
    };

    return (
        <div className="flex justify-between items-start p-4 border border-gray-200 rounded-lg transition duration-200 hover:border-blue-400 mb-3 last:mb-0">
            <div>
                <h4 className="font-semibold text-gray-800">{shop.name}</h4>
                <p className="text-xs text-gray-500 mb-1">{shop.address}</p>
                <div className="flex items-center space-x-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${priorityClasses[shop.priority]} font-medium`}>
                        {shop.priority}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{shop.zone}</span>
                </div>
            </div>
            <MapPin size={18} className="text-blue-500" />
        </div>
    );
};


const BeatPlanDetailsModal: React.FC<BeatPlanDetailsModalProps> = ({ isOpen, onClose, plan }) => {

    if (!isOpen) return null;

    const size = 'max-w-2xl';
    const title = "Beat Plan Details";

    // Fallback for null plan data
    if (!plan) return (
      <div
          className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
          onClick={onClose}
      >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="p-6 text-center text-red-500">Error: Beat Plan data could not be loaded.</div>
          </div>
      </div>
    );

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
                            Assigned Shops ({plan.assignedShops.length} shops)
                        </h3>
                        <div className="max-h-96 overflow-y-auto pr-2">
                            {plan.assignedShops.map(shop => (
                                <ShopCard key={shop.id} shop={shop} />
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default BeatPlanDetailsModal;