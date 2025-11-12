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
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Attendance Summary - {monthYear} 
            </h3>
            
            <div className="flex items-center justify-between mb-4">
                <div className="w-1/3 text-left"></div> 
                <div className="w-1/3 text-center">
                    <p className="text-4xl font-bold text-blue-600" >{percentage}%</p>
                    <p className="text-sm text-gray-500">Attendance Ratio</p>
                </div>
                
                <div className="w-1/3 text-right">
                    <p className="text-xl font-bold text-gray-800">{totalWorkingDays}</p>
                    <p className="text-sm text-gray-500">Total Working Days</p>
                </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 text-left">
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