import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import type { TimelineItem } from '../utils/sessionUtils';

interface SessionTimelineProps {
    items: TimelineItem[];
}

const SessionTimeline: React.FC<SessionTimelineProps> = ({ items }) => {
    const [showVisitsOnly, setShowVisitsOnly] = useState(false);

    const filteredItems = showVisitsOnly
        ? items.filter(i => i.type === 'visit')
        : items;

    if (items.length === 0) {
        return <div className="p-4 text-center text-gray-500 text-sm">Waiting for location updates...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="flex items-center justify-between px-4 pt-4 mb-2 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock size={15} className="text-gray-500" />
                    Activity Timeline
                </h3>

                {/* Custom Toggle Switch */}
                <button
                    onClick={() => setShowVisitsOnly(!showVisitsOnly)}
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <span className={`text-xs font-medium transition-colors ${showVisitsOnly ? 'text-blue-600' : 'text-gray-500'}`}>
                        Visits Only
                    </span>
                    <div className={`w-8 h-4 flex items-center bg-gray-300 rounded-full p-0.5 duration-300 ease-in-out ${showVisitsOnly ? 'bg-blue-600' : ''}`}>
                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${showVisitsOnly ? 'translate-x-4' : ''}`} />
                    </div>
                </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 pb-3 space-y-0">
                {filteredItems.map((item, index) => {
                    const isVisit = item.type === 'visit';
                    const isLast = index === filteredItems.length - 1;

                    return (
                        <div key={index} className="flex gap-3 relative pb-6 last:pb-0">
                            {/* Connecting Line */}
                            {!isLast && (
                                <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gray-200" />
                            )}

                            {/* Icon Marker */}
                            <div className={`
                            relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-sm mt-0.5
                            ${isVisit ? "bg-green-100 border-green-600" : "bg-white"}
                            ${!isVisit && item.isCurrent ? "border-red-500 bg-red-50" : ""}
                            ${!isVisit && !item.isCurrent ? "border-blue-400" : ""}
                        `}>
                                <item.icon size={isVisit ? 13 : 10} className={isVisit ? "text-green-700" : item.color} />
                            </div>

                            {/* Content Card */}
                            <div className={`flex-1 min-w-0 transition-all duration-200 ${isVisit ? "bg-white p-3 rounded-lg border border-green-100 shadow-sm -mt-1 ml-1" : "pt-0.5"}`}>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex flex-col min-w-0">
                                        {isVisit && item.directoryType && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-0.5">
                                                {item.directoryType} Visited
                                            </span>
                                        )}
                                        <p className={`text-sm leading-snug break-words ${isVisit ? "font-bold text-gray-900" : "font-medium text-gray-700"} line-clamp-2`}>
                                            {item.title}
                                        </p>
                                    </div>
                                    <span className={`text-xs whitespace-nowrap flex-shrink-0 pt-0.5 ${isVisit ? "font-bold text-green-700" : "text-gray-500 font-medium"}`}>
                                        {item.time}
                                    </span>
                                </div>

                                {item.subtitle && (
                                    <p className={`text-xs mt-1 break-words leading-relaxed ${isVisit ? "text-gray-600" : "text-gray-500"}`}>
                                        {isVisit && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 mb-0.5"></span>}
                                        {item.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SessionTimeline;
