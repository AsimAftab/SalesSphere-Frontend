import React from 'react';

interface StatItem {
    value: number;
    label: string;
    color: string;
}

interface AttendanceSummaryCardProps {
    percentage: number;
    stats: StatItem[];
    monthYear: string;
    totalWorkingDays: number;
}

const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
    percentage,
    stats,
    monthYear,
    totalWorkingDays
}) => {
    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 h-full">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Attendance Summary - {monthYear}
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
                <div className="w-full sm:w-1/3 text-center sm:text-left hidden sm:block"></div>
                <div className="w-full sm:w-1/3 text-center">
                    <p className="text-3xl md:text-4xl font-bold text-blue-600" >{percentage}%</p>
                    <p className="text-xs md:text-sm text-gray-500">Attendance Ratio</p>
                </div>

                <div className="w-full sm:w-1/3 text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <p className="text-lg md:text-xl font-bold text-gray-800">{totalWorkingDays}</p>
                    <p className="text-xs md:text-sm text-gray-500">Total Working Days</p>
                </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 text-left">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${stat.color} flex-shrink-0`}></span>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendanceSummaryCard;