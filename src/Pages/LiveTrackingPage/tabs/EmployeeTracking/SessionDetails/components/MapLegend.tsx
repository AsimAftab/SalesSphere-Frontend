import { MapPin, Navigation } from "lucide-react";

interface MapLegendProps {
    showPlannedRoutes?: boolean;
    onTogglePlannedRoutes?: (show: boolean) => void;
}

const MapLegend: React.FC<MapLegendProps> = ({ showPlannedRoutes, onTogglePlannedRoutes }) => {
    return (
        <div className="bg-white p-3 rounded-lg shadow border border-gray-100 flex-shrink-0">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Map Legend</h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {/* Markers Column */}
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500 fill-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Party</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-green-500 fill-green-500" />
                    <span className="text-sm font-medium text-gray-700">Prospect</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-500 fill-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Site</span>
                </div>

                {/* Live Status */}
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-4 h-4">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        <div className="relative bg-red-600 rounded-full p-0.5">
                            <Navigation size={10} className="text-white fill-white" />
                        </div>
                    </div>
                    <span className="text-sm font-bold text-gray-800">Live</span>
                </div>

                {/* Routes Column */}
                <div className="flex items-center gap-2">
                    <div className="h-0.5 w-5 bg-red-500 relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Traveled</span>
                </div>

                {/* Interactive Planned Route Toggle - Spanning full width */}
                <label className={`flex items-center justify-between gap-3 cursor-pointer select-none group col-span-2 pt-2 border-t border-gray-100 ${onTogglePlannedRoutes ? '' : 'opacity-50 pointer-events-none'}`}>
                    <div className="flex items-center gap-2">
                        {/* Restored Blue Dashed Line */}
                        <div className="h-0.5 w-6 bg-blue-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #4285F4 0, #4285F4 4px, transparent 4px, transparent 8px)' }}></div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Planned Route</span>
                    </div>

                    {/* Toggle Switch on the RIGHT */}
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={!!showPlannedRoutes}
                            onChange={(e) => onTogglePlannedRoutes?.(e.target.checked)}
                            className="absolute opacity-0 w-0 h-0"
                        />
                        <div className={`h-4 w-7 rounded-full transition-colors flex items-center px-0.5 ${showPlannedRoutes ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform ${showPlannedRoutes ? 'translate-x-3' : 'translate-x-0'}`} />
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default MapLegend;
