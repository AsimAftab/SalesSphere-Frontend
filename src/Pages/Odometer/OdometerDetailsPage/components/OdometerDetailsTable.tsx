import React from 'react';
import { Eye } from 'lucide-react';
import type { DailyOdometerStat } from '../../../../api/odometerService';

interface OdometerDetailsTableProps {
    data: DailyOdometerStat[];
    onViewDetails: (tripId: string, tripCount: number) => void;
}

const OdometerDetailsTable: React.FC<OdometerDetailsTableProps> = ({ data, onViewDetails }) => {
    // Helper for Consistent Date Formatting (YYYY-MM-DD)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-secondary text-white text-sm">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.No.</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                            <th className="px-5 py-3 text-center font-semibold whitespace-nowrap">Total Distance</th>
                            <th className="px-5 py-3 text-center font-semibold whitespace-nowrap">No. of Trips</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {data.map((record, index) => (
                            <tr key={record.id} className="hover:bg-gray-200 transition-colors duration-200">
                                <td className="px-5 py-3 text-sm text-black">
                                    {index + 1}
                                </td>
                                <td className="px-5 py-3 text-sm text-black font-black leading-tight">
                                    {formatDate(record.date)}
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                        {record.totalKm} KM
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                        {record.tripCount} Trips
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                    <button
                                        onClick={() => onViewDetails(record.id, record.tripCount)}
                                        className="text-blue-500 hover:underline font-black text-sm tracking-tighter flex items-center gap-1"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="py-12 text-center text-gray-500 text-sm">
                        No daily records found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OdometerDetailsTable;
