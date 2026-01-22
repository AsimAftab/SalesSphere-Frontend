import React from 'react';
import { formatDateToLocalISO } from '../../../../utils/dateUtils';
import type { OdometerStat } from '../../../../api/odometerService';

import { ChevronRight } from 'lucide-react';

interface OdometerMobileListProps {
    data: OdometerStat[];
    onViewDetails: (employeeId: string) => void;
}

const OdometerMobileList: React.FC<OdometerMobileListProps> = ({ data, onViewDetails }) => {
    return (
        <div className="space-y-4 pb-20">

            {data.map((item) => {
                const startDate = formatDateToLocalISO(new Date(item.dateRange.start));
                const endDate = formatDateToLocalISO(new Date(item.dateRange.end));
                const dateRangeStr = `${startDate} - ${endDate}`;

                return (
                    <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                        {/* Header: Employee Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {item.employee.avatarUrl ? (
                                    <img
                                        src={item.employee.avatarUrl}
                                        alt={item.employee.name}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-secondary text-white font-black flex items-center justify-center border border-secondary shrink-0 text-xs shadow-sm">
                                        {item.employee.name?.trim().charAt(0).toUpperCase() || "?"}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-black text-black leading-tight">{item.employee.name || "Unknown User"}</h3>
                                    <p className="text-xs text-gray-500 tracking-tight">{item.employee.role || "Staff"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-50 my-1"></div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Date Range</span>
                                <span className="text-xs text-gray-700 font-medium mt-1">{dateRangeStr}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Distance</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700 mt-1 border border-green-100">
                                    {item.totalDistance.toLocaleString()} KM
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => onViewDetails(item._id)}
                            className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                            View Details
                            <ChevronRight size={16} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default OdometerMobileList;
