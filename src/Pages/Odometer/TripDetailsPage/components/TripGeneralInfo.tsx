import React from 'react';
import type { TripOdometerDetails } from '../../../../api/odometerService';
import { Clock, MapPin, FileText, Route, ExternalLink } from 'lucide-react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import InfoBlock from '../../../../components/UI/Page/InfoBlock';

interface TripGeneralInfoProps {
    data: TripOdometerDetails;
}

const TripGeneralInfo: React.FC<TripGeneralInfoProps> = ({ data }) => {

    // Format Date & Time
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const openGoogleMaps = (coordinates: string) => {
        if (!coordinates) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;
        window.open(url, '_blank');
    };

    const LocationValue = ({ address, coordinates }: { address: string, coordinates: string }) => (
        <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 text-sm font-bold text-[#202224]">{address}</p>
            <button
                onClick={() => openGoogleMaps(coordinates)}
                className="flex-shrink-0 p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="View on Google Maps"
            >
                <ExternalLink size={16} />
            </button>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Main Card Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 text-blue-600">
                        <FileText size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Trip Information</h2>
                </div>

                {/* Total Distance Badge */}
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    <Route size={16} className="text-blue-600" />
                    <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Total Distance:</span>
                    <span className="text-sm font-black text-blue-700">{data.endReading - data.startReading} KM</span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                {/* Left Column: Start Details */}
                <div className="flex flex-col gap-6 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-green-50 rounded text-green-600 border border-green-100">
                            <Clock size={14} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Odometer Start Details</h3>
                    </div>

                    <InfoBlock
                        icon={Clock}
                        label="Start Date and Time"
                        value={formatDateTime(data.startTime)}
                    />
                    <InfoBlock
                        icon={() => <PaperAirplaneIcon className="h-5 w-5 text-gray-400 -rotate-45" />}
                        label="Start Reading"
                        value={`${data.startReading} KM`}
                    />
                    <InfoBlock
                        icon={MapPin}
                        label="Start Location"
                        value={<LocationValue address={data.startLocation.address} coordinates={data.startLocation.coordinates} />}
                    />
                    <InfoBlock
                        icon={FileText}
                        label="Start Description"
                        value={data.startDescription ? `"${data.startDescription}"` : "No start description provided."}
                    />
                </div>

                {/* Right Column: End Details */}
                <div className="flex flex-col gap-6 p-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-red-50 rounded text-red-600 border border-red-100">
                            <Clock size={14} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Odometer End Details</h3>
                    </div>

                    <InfoBlock
                        icon={Clock}
                        label="End Date and Time"
                        value={formatDateTime(data.endTime)}
                    />
                    <InfoBlock
                        icon={() => <PaperAirplaneIcon className="h-5 w-5 text-gray-400 rotate-45" />}
                        label="End Reading"
                        value={`${data.endReading} KM`}
                    />
                    <InfoBlock
                        icon={MapPin}
                        label="End Location"
                        value={<LocationValue address={data.endLocation.address} coordinates={data.endLocation.coordinates} />}
                    />
                    <InfoBlock
                        icon={FileText}
                        label="End Description"
                        value={data.endDescription ? `"${data.endDescription}"` : "No end description provided."}
                    />
                </div>
            </div>
        </div>
    );
};

export default TripGeneralInfo;


