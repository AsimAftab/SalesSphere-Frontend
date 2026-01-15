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

const AttendanceControls: React.FC<AttendanceControlsProps> = ({
    selectedMonth,
    onMonthChange,
    currentYear,
}) => {
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

                {/* New Web Check-in Button */}
                <Button
                    variant="primary"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm"
                    onClick={() => console.log('Web check-in clicked')} // Placeholder action
                >
                    <GlobeAltIcon className="w-4 h-4" />
                    Web Check-in
                </Button>
            </div>
        </motion.div>
    );
};

export default AttendanceControls;
