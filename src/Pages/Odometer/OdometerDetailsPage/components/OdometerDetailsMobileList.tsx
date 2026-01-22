import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { DailyOdometerStat } from '../../../../api/odometerService';
import { formatDateToLocalISO } from '../../../../utils/dateUtils';


interface OdometerDetailsMobileListProps {
    data: DailyOdometerStat[];
    onViewDetails: (tripId: string, tripCount: number) => void;
}

const OdometerDetailsMobileList: React.FC<OdometerDetailsMobileListProps> = ({ data, onViewDetails }) => {

    return (
        <div className="space-y-4 pb-20">
            {data.map((record) => (
                <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                    {/* Header: Date and Trips */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-gray-900">{formatDateToLocalISO(new Date(record.date))}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            {record.tripCount} Trips
                        </span>
                    </div>

                    <div className="border-t border-gray-50 my-1"></div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Total Distance</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                            {record.totalKm} KM
                        </span>
                    </div>

                    {/* Action Button */}
                    {/* Action Button */}
                    <button
                        onClick={() => onViewDetails(record.id, record.tripCount)}
                        className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                        View Details
                        <ChevronRight size={16} />
                    </button>
                </div>
            ))}
            {data.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-sm">
                    No daily records found.
                </div>
            )}
        </div>
    );
};

export default OdometerDetailsMobileList;
