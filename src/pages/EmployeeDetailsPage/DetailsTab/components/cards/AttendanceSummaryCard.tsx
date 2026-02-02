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
    const pctColor = percentage >= 90 ? 'text-emerald-600' : percentage >= 75 ? 'text-blue-600' : percentage >= 50 ? 'text-amber-600' : 'text-red-600';
    const barColor = percentage >= 90 ? 'bg-emerald-500' : percentage >= 75 ? 'bg-blue-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500';
    const badgeLabel = percentage >= 90 ? 'Excellent' : percentage >= 75 ? 'Good' : percentage >= 50 ? 'Average' : 'Low';
    const badgeBg = percentage >= 90 ? 'bg-emerald-50 text-emerald-700' : percentage >= 75 ? 'bg-blue-50 text-blue-700' : percentage >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Attendance Summary</h3>
                <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-full">{monthYear}</span>
            </div>

            {/* Percentage + Bar */}
            <div className="mb-4">
                <div className="flex items-end justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold leading-none ${pctColor}`}>{percentage}%</span>
                        {percentage > 0 && <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBg}`}>{badgeLabel}</span>}
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{totalWorkingDays} Working Days</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                        className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-0.5 flex-1 border-t border-gray-100 pt-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${stat.color} flex-shrink-0`} />
                            <span className="text-sm text-gray-600">{stat.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendanceSummaryCard;
