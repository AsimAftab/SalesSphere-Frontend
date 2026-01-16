import React from 'react';
import { CalendarDaysIcon, MapIcon, CircleStackIcon } from '@heroicons/react/24/outline';

interface OdometerEmployeeSummaryProps {
    employee: {
        name: string;
        role: string;
    };
    summary: {
        dateRange: { start: string; end: string };
        totalDistance: number;
        totalRecords: number;
    };
}

const OdometerEmployeeSummary: React.FC<OdometerEmployeeSummaryProps> = ({ employee, summary }) => {
    // Format dates for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const dateRangeStr = `${formatDate(summary.dateRange.start)} to ${formatDate(summary.dateRange.end)}`;

    return (
        <div className="bg-[#1976D2] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden w-full lg:w-3/4">
            {/* Background Decoration (Optional) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between min-h-[120px]">
                {/* Top Section: Employee Info */}
                <div>
                    <h2 className="text-xl font-bold tracking-tight">{employee.name}</h2>
                    <p className="text-blue-100 text-xs font-medium mt-0.5">{employee.role}</p>
                </div>

                {/* Bottom Section: Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {/* Date Range */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <CalendarDaysIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-200 font-medium mb-0.5">Date Range</p>
                            <p className="text-sm font-bold text-white whitespace-nowrap">{dateRangeStr}</p>
                        </div>
                    </div>

                    {/* Total Distance */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <MapIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-200 font-medium mb-0.5">Total Distance Travelled</p>
                            <p className="text-sm font-bold text-white">{summary.totalDistance.toLocaleString()} KM</p>
                        </div>
                    </div>

                    {/* Total Records */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <CircleStackIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-200 font-medium mb-0.5">Total Records</p>
                            <p className="text-sm font-bold text-white">{summary.totalRecords} Days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OdometerEmployeeSummary;
