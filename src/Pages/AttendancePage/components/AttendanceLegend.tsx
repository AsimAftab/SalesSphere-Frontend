import React from 'react';
import { LEGEND_ITEMS } from '../utils/attendanceConstants';

const AttendanceLegend: React.FC = () => {
    return (
        <div className="pt-4 border-t border-gray-100 mt-4 md:hidden">
            <span className="font-semibold text-sm text-gray-700">
                Legend:
            </span>
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-700 mt-2">
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
        </div>
    );
};

export default AttendanceLegend;
