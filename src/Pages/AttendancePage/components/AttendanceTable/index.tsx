import React from 'react';
import { motion } from 'framer-motion';
import type { FilteredEmployee, CalendarDay } from '../../types';
import { EmptyState } from '../../../../components/UI/EmptyState/EmptyState';
import AttendanceTableHeader from './AttendanceTableHeader';
import AttendanceTableRow from './AttendanceTableRow';

interface AttendanceTableProps {
    days: CalendarDay[];
    employees: FilteredEmployee[];
    isLoading: boolean;
    error: Error | null;
    isSearchActive: boolean;
    selectedMonth: string;
    currentYear: number;
    onCellClick: (employee: FilteredEmployee, dayIndex: number) => void;
    onDayClick: (dayIndex: number) => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({
    days,
    employees,
    isLoading,
    error,
    isSearchActive,
    selectedMonth,
    currentYear,
    onCellClick,
    onDayClick,
}) => {
    const employeeNameWidth = '200px';
    const workingDaysWidth = '110px';
    const minDayCellWidth = 35;
    const minDayContainerWidth = days.length * minDayCellWidth;
    const requiredMinWidth =
        parseInt(employeeNameWidth) +
        parseInt(workingDaysWidth) +
        minDayContainerWidth;

    if (error) {
        return (
            <div className="text-center p-10 text-red-600 bg-white rounded-xl shadow-md">
                {error.message}
            </div>
        );
    }

    if (employees.length === 0 && !isLoading) {
        return (
            <EmptyState
                title="No Attendance Records"
                description={isSearchActive
                    ? 'No employees found matching your search. Try adjusting your search criteria.'
                    : `No attendance records found for ${selectedMonth} ${currentYear}.`}
            />
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto custom-scrollbar"
        >
            <div style={{ minWidth: `${requiredMinWidth}px` }}>
                <AttendanceTableHeader
                    days={days}
                    employeeNameWidth={employeeNameWidth}
                    minDayContainerWidth={minDayContainerWidth}
                    workingDaysWidth={workingDaysWidth}
                    onDayClick={onDayClick}
                />
                <div>
                    {employees.map((employee) => (
                        <AttendanceTableRow
                            key={employee.id}
                            employee={employee}
                            days={days}
                            employeeNameWidth={employeeNameWidth}
                            minDayContainerWidth={minDayContainerWidth}
                            workingDaysWidth={workingDaysWidth}
                            onCellClick={onCellClick}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AttendanceTable;
