import React from 'react';
import type { OdometerStat } from '../../../../api/odometerService';
import { Eye } from 'lucide-react';

interface OdometerRecordsTableProps {
    data: OdometerStat[];
    startIndex: number;
    onViewDetails: (employeeId: string) => void;
}

/**
 * SRP: This component is strictly responsible for rendering the Desktop Table view.
 * It uses standardized design tokens to maintain consistency with MiscellaneousWork page,
 * but without checkboxes as requested.
 */
const OdometerRecordsTable: React.FC<OdometerRecordsTableProps> = ({ data, startIndex, onViewDetails }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-secondary text-white text-sm">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.No.</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Employee</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Date Range</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap text-center">Total Distance</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {data.map((item, index) => {
                            // Format dates
                            const formatDate = (dateString: string) => {
                                const date = new Date(dateString);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                return `${year}-${month}-${day}`;
                            };
                            const startDate = formatDate(item.dateRange.start);
                            const endDate = formatDate(item.dateRange.end);
                            const dateRangeStr = `${startDate} to ${endDate}`;

                            return (
                                <tr key={item._id} className="hover:bg-gray-200 transition-colors duration-200">
                                    {/* S.No */}
                                    <td className="px-5 py-3 text-black text-sm">
                                        {startIndex + index + 1}
                                    </td>

                                    {/* Employee */}
                                    <td className="px-5 py-3 text-black text-sm">
                                        <div className="flex items-center gap-3">
                                            {item.employee?.avatarUrl ? (
                                                <img
                                                    className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                                    src={item.employee.avatarUrl}
                                                    alt={item.employee.name}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-secondary text-white font-black flex items-center justify-center border border-secondary shrink-0 text-xs shadow-sm">
                                                    {item.employee?.name?.trim().charAt(0).toUpperCase() || "?"}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="text-sm font-black text-black leading-tight">{item.employee.name}</div>
                                                <div className="text-sm text-gray-500 tracking-tight">{item.employee.role}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date Range */}
                                    <td className="px-5 py-3 text-black text-sm">
                                        {dateRangeStr}
                                    </td>

                                    {/* Total Distance */}
                                    <td className="px-5 py-3 text-black text-sm text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                            {item.totalDistance.toLocaleString()} KM
                                        </span>
                                    </td>

                                    {/* View Details */}
                                    <td className="px-5 py-3 text-sm">
                                        <button

                                            onClick={() => onViewDetails(item._id)}
                                            className="text-blue-500 hover:underline font-black text-sm tracking-tighter flex items-center gap-1"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OdometerRecordsTable;
