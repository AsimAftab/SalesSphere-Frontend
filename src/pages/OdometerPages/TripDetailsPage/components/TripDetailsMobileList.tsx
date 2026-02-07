import React from 'react';
import { ChevronRight, Clock, Route } from 'lucide-react';
import type { TripOdometerDetails } from '@/api/odometerService';
import { MobileCardList } from '@/components/ui';

interface TripDetailsMobileListProps {
    trips: TripOdometerDetails[];
    activeTripId: string | null;
    onSelect: (id: string) => void;
}

const TripDetailsMobileList: React.FC<TripDetailsMobileListProps> = ({
    trips = [],
    activeTripId,
    onSelect
}) => {
    if (!trips || trips.length === 0) {
        return (
            <MobileCardList isEmpty emptyMessage="No trips found">
                {null}
            </MobileCardList>
        );
    }

    return (
        <MobileCardList>
            {trips.map((trip) => {
                const isActive = activeTripId === trip.id;

                return (
                    <div
                        key={trip.id}
                        onClick={() => onSelect(trip.id)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(trip.id)}
                        role="button"
                        tabIndex={0}
                        className={`p-4 rounded-xl border shadow-sm relative transition-all duration-200 cursor-pointer ${isActive ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-gray-200 hover:border-blue-100'
                            }`}
                    >
                        {/* Top Section: Trip # and Status */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    #{trip.tripNumber}
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Trip Detail</span>
                                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                                        Trip #{trip.tripNumber}
                                    </h3>
                                </div>
                            </div>
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${trip.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                    trip.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-gray-50 text-gray-700 border-gray-100'
                                    }`}>
                                    {trip.status}
                                </span>
                                {isActive && <ChevronRight size={16} className="text-blue-500" />}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-3">
                            {/* Distance */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Route size={14} className="text-blue-500 shrink-0" />
                                <span className="font-semibold text-gray-900">
                                    {trip.status === 'In Progress' ? 0 : (trip.endReading - trip.startReading)} {trip.distanceUnit === 'miles' ? 'Miles' : 'KM'}
                                </span>
                            </div>

                            {/* Time Range */}
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Clock size={14} className="text-gray-400 shrink-0" />
                                <span>
                                    {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {' - '}
                                    {new Date(trip.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Locations (Start -> End) */}
                            <div className="flex flex-col gap-2 mt-1">
                                <div className="flex items-start gap-2 text-xs text-gray-600">
                                    <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                    <span className="truncate">{trip.startLocation.address}</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-gray-600">
                                    <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                    <span className="truncate">{trip.endLocation.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </MobileCardList>
    );
};

export default TripDetailsMobileList;
