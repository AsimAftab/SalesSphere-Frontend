import React from 'react';
import { Clock } from 'lucide-react';
import type { TimelineItem } from '../utils/sessionUtils';

interface SessionTimelineProps {
    items: TimelineItem[];
}

const SessionTimeline: React.FC<SessionTimelineProps> = ({ items }) => {
    if (items.length === 0) {
        return <div className="p-4 text-center text-gray-500 text-sm">Waiting for location updates...</div>;
    }

    return (
        <aside className="flex flex-col gap-3 lg:min-h-0 bg-white shadow-lg lg:shadow-none z-10 lg:z-auto">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 px-3 pt-3 flex items-center gap-2">
                <Clock size={14} />
                Activity Timeline
            </h3>
            <div className="overflow-y-auto flex-1 px-3 pb-3 space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-3 relative">
                        {/* Connecting Line */}
                        {index !== items.length - 1 && (
                            <div className="absolute left-[11px] top-7 bottom-[-16px] w-[2px] bg-gray-100 dark:bg-gray-700" />
                        )}

                        <div className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-white border-2 ${item.isCurrent ? "border-red-500" : "border-blue-500"}`}>
                            <item.icon size={12} className={item.color} />
                        </div>

                        <div className="flex-1 min-w-0 pb-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-900 truncate pr-2">
                                    {item.title}
                                </p>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {item.time}
                                </span>
                            </div>
                            {item.subtitle && (
                                <p className="text-xs text-gray-500 mt-0.5 break-words">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SessionTimeline;
