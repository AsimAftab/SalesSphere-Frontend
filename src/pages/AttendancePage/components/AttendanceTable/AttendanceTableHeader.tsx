import React from 'react';
import type { CalendarDay } from '../../types';

interface AttendanceTableHeaderProps {
    days: CalendarDay[];
    employeeNameWidth: string;
    minDayContainerWidth: number;
    workingDaysWidth: string;
    onDayClick: (dayIndex: number) => void;
}

const AttendanceTableHeader: React.FC<AttendanceTableHeaderProps> = ({
    days,
    employeeNameWidth,
    minDayContainerWidth,
    workingDaysWidth,
    onDayClick,
}) => {
    return (
        <div className="flex border-b-2 border-gray-200 sticky top-0 z-30 bg-white">
            {/* Employee Name Header */}
            <div
                className="p-3 font-semibold text-left text-sm text-white bg-secondary flex items-center"
                style={{ width: employeeNameWidth, flexShrink: 0 }}
            >
                Employee Name
            </div>

            {/* Days Grid Header */}
            <div
                className="flex-1 grid"
                style={{
                    gridTemplateColumns: `repeat(${days.length}, 1fr)`,
                    minWidth: `${minDayContainerWidth}px`,
                    width: `${minDayContainerWidth}px`,
                }}
            >
                {days.map((day) => (
                    <div
                        key={day.day}
                        onClick={() => onDayClick(day.day - 1)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onDayClick(day.day - 1)}
                        role="button"
                        tabIndex={0}
                        className={`flex flex-col items-center justify-center p-1 text-xs border-l border-white/20 text-white cursor-pointer hover:bg-opacity-80 transition-colors ${day.isWeeklyOff ? 'bg-primary' : 'bg-secondary'
                            }`}
                        title="Click to mark holiday"
                    >
                        <span className="font-bold">{day.weekday}</span>
                        <span>{day.day}</span>
                    </div>
                ))}
            </div>

            {/* Working Days Header */}
            <div
                className="p-3 font-semibold text-center text-sm text-white bg-secondary border-l border-white/20 flex items-center justify-center"
                style={{ width: workingDaysWidth, flexShrink: 0 }}
            >
                Working Days
            </div>
        </div>
    );
};

export default AttendanceTableHeader;
