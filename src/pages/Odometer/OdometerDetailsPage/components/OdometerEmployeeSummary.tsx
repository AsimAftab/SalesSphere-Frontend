import React from 'react';
import {
    CalendarDaysIcon,
    MapIcon,
    UserIcon,
    BriefcaseIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { formatDateToLocalISO } from '@/utils/dateUtils';
import { InfoBlock } from '@/components/ui';

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
    const dateRangeStr = `${formatDateToLocalISO(new Date(summary.dateRange.start))} to ${formatDateToLocalISO(new Date(summary.dateRange.end))}`;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full lg:w-1/2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-black text-black">Odometer Summary</h3>
            </div>

            <hr className="border-gray-200 -mx-8 mb-5" />

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                <InfoBlock
                    icon={UserIcon}
                    label="Employee Name"
                    value={employee.name}
                />
                <InfoBlock
                    icon={BriefcaseIcon}
                    label="Role"
                    value={employee.role}
                />

                <InfoBlock
                    icon={CalendarDaysIcon}
                    label="Date Range"
                    value={dateRangeStr}
                />


                <InfoBlock
                    icon={MapIcon}
                    label="Total Distance Travelled"
                    value={`${summary.totalDistance.toLocaleString()} KM`}
                />
            </div>
        </div>
    );
};

export default OdometerEmployeeSummary;
