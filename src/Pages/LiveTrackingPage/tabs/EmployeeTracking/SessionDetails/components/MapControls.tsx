import React from 'react';

interface MapControlsProps {
    showPlannedRoutes: boolean;
    setShowPlannedRoutes: (show: boolean) => void;
}

const MapControls: React.FC<MapControlsProps> = ({ showPlannedRoutes, setShowPlannedRoutes }) => {
    return (
        <div className="bg-white p-3 rounded-lg shadow flex-shrink-0">
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={showPlannedRoutes}
                    onChange={(e) => setShowPlannedRoutes(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm font-semibold text-gray-700">Show Planned Route</span>
            </label>
        </div>
    );
};

export default MapControls;
