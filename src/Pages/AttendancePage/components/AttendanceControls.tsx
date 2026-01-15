import React from 'react';
import { motion } from 'framer-motion';
import { MONTH_NAMES, LEGEND_ITEMS } from '../utils/attendanceConstants';
import Button from '../../../components/UI/Button/Button';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

interface AttendanceControlsProps {
    selectedMonth: string;
    onMonthChange: (month: string) => void;
    currentYear: number;
    // For future year selection if needed
    onYearChange?: (year: number) => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

import { useWebAttendance } from '../hooks/useWebAttendance';

const AttendanceControls: React.FC<AttendanceControlsProps> = ({
    selectedMonth,
    onMonthChange,
    currentYear,
}) => {
    const {
        attendanceState,
        isCheckInEnabled,
        canHalfDayCheckOut,
        canFullDayCheckOut,
        handleCheckIn,
        handleCheckOut,
        checkInPending,
        checkOutPending,
        isLoading,
        timeWindowMessage
    } = useWebAttendance();

    const isPending = checkInPending || checkOutPending;

    const renderActionButton = () => {
        if (isLoading) return <Button variant="ghost" disabled>Loading...</Button>;

        // Container for Button + Message
        const content = (() => {
            if (attendanceState.type === 'COMPLETED') {
                return (
                    <div className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg border border-green-200">
                        Attendance Completed
                    </div>
                );
            }

            if (attendanceState.type === 'CHECK_OUT') {
                return (
                    <div className="flex gap-2">
                        {/* Half Day Checkout Button */}
                        <Button
                            variant="secondary"
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm ${!canHalfDayCheckOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleCheckOut(true)}
                            disabled={!canHalfDayCheckOut || isPending}
                            title={!canHalfDayCheckOut ? "Available 30 mins before half-day time" : "Mark Half Day"}
                        >
                            <GlobeAltIcon className="w-4 h-4" />
                            Half Day
                        </Button>

                        {/* Full Day Checkout Button */}
                        <Button
                            variant="primary"
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm ${!canFullDayCheckOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleCheckOut(false)}
                            disabled={!canFullDayCheckOut || isPending}
                            title={!canFullDayCheckOut ? "Available 30 mins before check-out time" : "Check Out"}
                        >
                            <GlobeAltIcon className="w-4 h-4" />
                            Check Out
                        </Button>
                    </div>
                );
            }

            // Default: Check In
            return (
                <Button
                    variant="primary"
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm ${!isCheckInEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleCheckIn}
                    disabled={!isCheckInEnabled || isPending}
                    title={!isCheckInEnabled ? "Check-in window: 2 hrs before to 30 mins after start time" : "Web Check-in"}
                >
                    <GlobeAltIcon className="w-4 h-4" />
                    {isPending ? 'Processing...' : 'Web Check-in'}
                </Button>
            );
        })();

        return (
            <div className="flex items-center gap-3">
                {timeWindowMessage && (
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                        {timeWindowMessage}
                    </span>
                )}
                {content}
            </div>
        );
    };

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4"
        >
            {/* LEFT: Legends */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
                <span className="font-semibold">Legend:</span>
                {LEGEND_ITEMS.map((item) => (
                    <div key={item.code} className="flex items-center gap-x-2">
                        <span
                            className={`font-bold w-5 h-5 flex items-center justify-center rounded-md text-white text-xs ${item.colorClass}`}
                        >
                            {item.code}
                        </span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            {/* RIGHT: Date Controls & Web Check-in */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <select
                        value={selectedMonth}
                        onChange={(e) => onMonthChange(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-auto focus:ring-secondary focus:border-secondary"
                    >
                        {MONTH_NAMES.map((month) => (
                            <option key={month}>{month}</option>
                        ))}
                    </select>
                    <span className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 font-medium">
                        {currentYear}
                    </span>
                </div>

                {renderActionButton()}
            </div>
        </motion.div>
    );
};

export default AttendanceControls;
