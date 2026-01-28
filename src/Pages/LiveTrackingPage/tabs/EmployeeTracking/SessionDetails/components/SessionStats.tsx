import React from 'react';
import type { SessionSummary } from '../../../../../../api/liveTrackingService';

interface SessionStatsProps {
    summary: SessionSummary['summary'];
}

const SessionStats: React.FC<SessionStatsProps> = ({ summary }) => {
    return (
        <div className="bg-white p-3 rounded-lg shadow flex-shrink-0 grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-blue-500 font-medium">Distance</p>
                <p className="text-sm font-bold text-gray-800">{summary.totalDistance.toFixed(2)} km</p>
            </div>
            <div className="bg-green-50 p-2 rounded">
                <p className="text-xs text-green-500 font-medium">Duration</p>
                <p className="text-sm font-bold text-gray-800">{Math.round(summary.totalDuration)} min</p>
            </div>

            <div className="bg-purple-50 p-2 rounded">
                <p className="text-xs text-purple-500 font-medium">Visits</p>
                <p className="text-sm font-bold text-gray-800">{summary.directoriesVisited}</p>
            </div>
        </div>
    );
};

export default SessionStats;
