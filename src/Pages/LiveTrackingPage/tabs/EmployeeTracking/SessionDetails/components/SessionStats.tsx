import React from 'react';
import { Route, Clock, MapPinCheck } from 'lucide-react';
import type { SessionSummary } from '../../../../../../api/liveTrackingService';

interface SessionStatsProps {
    summary: SessionSummary['summary'];
}

const SessionStats: React.FC<SessionStatsProps> = ({ summary }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
            <div className="grid grid-cols-3 gap-4 divide-x divide-gray-100">
                {/* Distance */}
                <div className="flex flex-col items-center justify-center text-center px-2">
                    <div className="flex items-center gap-1.5 mb-1 text-blue-600">
                        <Route size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">Distance</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 leading-none">
                        {summary.totalDistance.toFixed(2)} <span className="text-xs font-medium text-gray-500">km</span>
                    </p>
                </div>

                {/* Duration */}
                <div className="flex flex-col items-center justify-center text-center px-2">
                    <div className="flex items-center gap-1.5 mb-1 text-green-600">
                        <Clock size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-green-600">Time</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 leading-none">
                        {Math.round(summary.totalDuration)} <span className="text-xs font-medium text-gray-500">min</span>
                    </p>
                </div>

                {/* Visits */}
                <div className="flex flex-col items-center justify-center text-center px-2">
                    <div className="flex items-center gap-1.5 mb-1 text-purple-600">
                        <MapPinCheck size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600">Visited</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 leading-none">
                        {summary.directoriesVisited}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SessionStats;
