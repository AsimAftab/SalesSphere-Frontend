import React from 'react';
import type { FilteredEmployee, CalendarDay } from '../../types';
import { getWorkingDays } from '../../utils/attendanceHelpers';
import { STATUS_COLORS } from '../../utils/attendanceConstants';

interface AttendanceTableRowProps {
    employee: FilteredEmployee;
    days: CalendarDay[];
    employeeNameWidth: string;
    minDayContainerWidth: number;
    workingDaysWidth: string;
    onCellClick: (employee: FilteredEmployee, dayIndex: number) => void;
}

const AttendanceTableRow: React.FC<AttendanceTableRowProps> = ({
    employee,
    days,
    employeeNameWidth,
    minDayContainerWidth,
    workingDaysWidth,
    onCellClick,
}) => {
    const attendanceChars = employee.attendanceString.split('');

    return (
        <div className="flex border-b border-gray-200 hover:bg-gray-50 items-stretch transition-colors">
            {/* Employee Name */}
            <div
                className="p-3 text-sm font-medium text-gray-900 border-r border-gray-200 flex items-center bg-white"
                style={{ width: employeeNameWidth, flexShrink: 0 }}
            >
                <div className="truncate" title={employee.name}>
                    {employee.name}
                </div>
            </div>

            {/* Days Grid */}
            <div
                className="flex-1 grid"
                style={{
                    gridTemplateColumns: `repeat(${days.length}, 1fr)`,
                    minWidth: `${minDayContainerWidth}px`,
                    width: `${minDayContainerWidth}px`,
                }}
            >
                {days.map((day, index) => {
                    const status = attendanceChars[index];
                    const colorClass = STATUS_COLORS[status] || 'text-gray-400';
                    const isWeeklyOff = day.isWeeklyOff;

                    return (
                        <div
                            key={`${employee.id}-${day.day}`}
                            onClick={() => onCellClick(employee, index)}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCellClick(employee, index)}
                            role="button"
                            tabIndex={0}
                            className={`
                h-10 md:h-12 border-l border-gray-200 flex items-center justify-center
                cursor-pointer transition-colors text-xs sm:text-sm font-bold
                ${isWeeklyOff ? 'bg-gray-50' : ''}
                hover:bg-blue-50
                ${colorClass}
              `}
                        >
                            {status}
                        </div>
                    );
                })}
            </div>

            {/* Working Days Count */}
            <div
                className="p-3 text-sm font-semibold text-center text-gray-700 border-l border-gray-200 flex items-center justify-center bg-white"
                style={{ width: workingDaysWidth, flexShrink: 0 }}
            >
                {getWorkingDays(employee.attendanceString)}
            </div>
        </div>
    );
};

export default AttendanceTableRow;
