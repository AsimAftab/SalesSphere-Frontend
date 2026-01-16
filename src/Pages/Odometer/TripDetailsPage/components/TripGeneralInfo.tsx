import React from 'react';
import type { TripOdometerDetails } from '../../../../api/odometerService';
import { Clock, MapPin, FileText, Route, ExternalLink } from 'lucide-react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

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

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-full">
            {/* Main Card Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 text-blue-600">
                    <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Trip Information</h2>
            </div>

            <div className="border-t border-gray-200 -mx-8 mb-8"></div>

            <div className="flex flex-col gap-8">
                {/* 1. Trip Timeline */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Clock size={16} /> TIMELINE
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group relative p-6 bg-green-50/50 rounded-2xl border border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
                                    <Clock size={14} />
                                </div>
                                <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Start Time</p>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{formatDateTime(data.startTime)}</p>
                        </div>
                        <div className="group relative p-6 bg-red-50/50 rounded-2xl border border-red-100 hover:border-red-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                                    <Clock size={14} />
                                </div>
                                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">End Time</p>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{formatDateTime(data.endTime)}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 -mx-8"></div>

                {/* 2. Odometer Readings */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <PaperAirplaneIcon className="h-4 w-4 -rotate-45" /> READINGS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Start Reading */}
                        <div className="group relative p-6 bg-blue-50/50 rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                    <PaperAirplaneIcon className="h-3.5 w-3.5 -rotate-45" />
                                </div>
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Start Reading</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-black text-gray-900">{data.startReading}</p>
                                <span className="text-sm font-semibold text-gray-500">KM</span>
                            </div>
                        </div>

                        {/* End Reading */}
                        <div className="group relative p-6 bg-red-50/50 rounded-2xl border border-red-100 hover:border-red-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                                    <PaperAirplaneIcon className="h-3.5 w-3.5 rotate-45" />
                                </div>
                                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">End Reading</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-black text-gray-900">{data.endReading}</p>
                                <span className="text-sm font-semibold text-gray-500">KM</span>
                            </div>
                        </div>

                        {/* Total Distance */}
                        <div className="group relative p-6 bg-green-50/50 rounded-2xl border border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
                                    <Route size={14} />
                                </div>
                                <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Total Distance</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-black text-gray-900">{data.endReading - data.startReading}</p>
                                <span className="text-sm font-semibold text-gray-500">KM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 -mx-8"></div>

                {/* 3. Locations */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <MapPin size={16} /> LOCATIONS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Location */}
                        <div
                            className="group flex gap-4 p-5 rounded-2xl border border-gray-300 bg-white hover:border-green-300 hover:shadow-md transition-all duration-300 cursor-pointer relative"
                            onClick={() => openGoogleMaps(data.startLocation.coordinates)}
                        >
                            <div className="absolute top-5 right-5">
                                <ExternalLink size={16} className="text-green-600" />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-50 group-hover:ring-green-100 transition-all"></div>
                                <div className="w-0.5 flex-1 bg-gradient-to-b from-green-500/50 to-transparent rounded-full"></div>
                            </div>
                            <div className="flex-1 pr-6">
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1.5">From</p>
                                <p className="text-sm font-bold text-gray-900 leading-relaxed mb-1 line-clamp-2">{data.startLocation.address}</p>
                                <p className="text-xs text-gray-400 font-mono bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100 hover:bg-gray-100 transition-colors">
                                    {data.startLocation.coordinates}
                                </p>
                            </div>
                        </div>

                        {/* End Location */}
                        <div
                            className="group flex gap-4 p-5 rounded-2xl border border-gray-300 bg-white hover:border-red-300 hover:shadow-md transition-all duration-300 cursor-pointer relative"
                            onClick={() => openGoogleMaps(data.endLocation.coordinates)}
                        >
                            <div className="absolute top-5 right-5">
                                <ExternalLink size={16} className="text-red-600" />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-50 group-hover:ring-red-100 transition-all"></div>
                                <div className="w-0.5 flex-1 bg-gradient-to-b from-red-500/50 to-transparent rounded-full"></div>
                            </div>
                            <div className="flex-1 pr-6">
                                <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1.5">To</p>
                                <p className="text-sm font-bold text-gray-900 leading-relaxed mb-1 line-clamp-2">{data.endLocation.address}</p>
                                <p className="text-xs text-gray-400 font-mono bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100 hover:bg-gray-100 transition-colors">
                                    {data.endLocation.coordinates}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 -mx-8"></div>

                {/* 4. Trip Descriptions */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <FileText size={16} /> DESCRIPTIONS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Notes */}
                        <div className="group relative p-6 bg-amber-50/50 rounded-2xl border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
                                    <FileText size={14} />
                                </div>
                                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Start Notes</p>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                "{data.startDescription}"
                            </p>
                        </div>

                        {/* End Notes */}
                        <div className="group relative p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                                    <FileText size={14} />
                                </div>
                                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">End Notes</p>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                "{data.endDescription}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripGeneralInfo;
