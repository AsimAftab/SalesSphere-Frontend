const MapLegend = () => {
    return (
        <div className="bg-white p-3 rounded-lg shadow flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Map Legend</h3>
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-4 bg-blue-500 rounded-t-full" style={{ borderRadius: '50% 50% 50% 0' }}></div>
                    <span className="text-xs text-gray-600">Party</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-4 bg-green-500 rounded-t-full" style={{ borderRadius: '50% 50% 50% 0' }}></div>
                    <span className="text-xs text-gray-600">Prospect</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-4 bg-orange-500 rounded-t-full" style={{ borderRadius: '50% 50% 50% 0' }}></div>
                    <span className="text-xs text-gray-600">Site</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-6 bg-red-500"></div>
                    <span className="text-xs text-gray-600">Traveled Route</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 bg-blue-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #4285F4 0, #4285F4 8px, transparent 8px, transparent 16px)' }}></div>
                    <span className="text-xs text-gray-600">To Destinations</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-3 h-3">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600">Live Position</span>
                </div>
            </div>
        </div>
    );
};

export default MapLegend;
