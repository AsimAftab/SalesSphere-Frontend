import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Clock,
  MapPin,
  Route,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui';

export type EmployeeCardProps = {
    employee: {
        id: string;
        name: string;
        role: string;
        status: 'Active' | 'Completed';
        checkIn: string;
        lastLocation: string;
        beatPlanName?: string;
        avatar: string; // Initial if no URL
        avatarColor?: string;
        avatarUrl?: string;
        idleTime?: string;
    };
    linkTo?: string; // Add optional link prop
    locationLabel?: string;
    hideStatusDot?: boolean;
    checkOut?: string;
    canViewLocation?: boolean;
};

const EmployeeTrackingCard: React.FC<EmployeeCardProps> = ({
    employee,
    linkTo,
    locationLabel,
    hideStatusDot = false,
    checkOut,
    canViewLocation = true
}) => {
    return (
        <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 h-full flex flex-col">
            {/* Header section with User Info & Status */}
            <div className="p-5 pb-4 border-b border-gray-200 flex items-start justify-between ">
                <div className="flex gap-4">
                    <div className="relative shrink-0">
                        {employee.avatarUrl ? (
                            <img
                                src={employee.avatarUrl}
                                alt={employee.name}
                                className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100"
                            />
                        ) : (
                            <div className={`w-12 h-12 rounded-full ${employee.avatarColor || 'bg-slate-600'} flex items-center justify-center text-white font-bold shadow-sm text-lg`}>
                                {employee.avatar}
                            </div>
                        )}
                        {/* Status Indicator Dot */}
                        {!hideStatusDot && (
                            <span className={`absolute bottom-0.5 right-0.5 block h-3 w-3 rounded-full ring-2 ring-white ${employee.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        )}
                    </div>

                    <div className="max-w-[140px]">
                        <h3 className="font-semibold text-gray-900 text-base leading-tight truncate" title={employee.name}>
                            {employee.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium truncate" title={employee.role}>
                            {employee.role}
                        </p>
                    </div>
                </div>

                <StatusBadge status={employee.status} />
            </div>

            {/* Informational Body */}
            <div className="p-5 pt-4 space-y-4 flex-1">
                {/* Beat Plan Row */}
                <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Route size={16} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-1">Assigned Beat</p>
                        <p className="text-sm font-medium text-slate-900 leading-snug">
                            {employee.beatPlanName || <span className="text-slate-400 italic">Not Assigned</span>}
                        </p>
                    </div>
                </div>

                {/* Check In Row */}
                <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                        <Clock size={16} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-1">Check In</p>
                        <p className="text-sm font-medium text-slate-900 leading-snug">
                            {employee.checkIn}
                        </p>
                    </div>
                </div>

                {/* Check Out Row (Optional) */}
                {checkOut && (
                    <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Clock size={16} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-1">Check Out</p>
                            <p className="text-sm font-medium text-slate-900 leading-snug">
                                {checkOut}
                            </p>
                        </div>
                    </div>
                )}

                {/* Location Row - Permission Controlled */}
                {canViewLocation && (
                    <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                            <MapPin size={16} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider leading-none mb-1">
                                {locationLabel || 'Current Location'}
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed line-clamp-2" title={employee.lastLocation}>
                                {employee.lastLocation}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            {linkTo ? (
                <Link
                    to={linkTo}
                    className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between hover:bg-slate-50 transition-colors group/footer"
                >
                    <span className="text-xs font-semibold text-slate-600 group-hover/footer:text-blue-700 transition-colors">
                        View Live Session
                    </span>
                    <ChevronRight size={16} className="text-slate-400 group-hover/footer:text-blue-600 transition-transform group-hover/footer:translate-x-1" />
                </Link>
            ) : (
                <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between cursor-not-allowed opacity-70">
                    <span className="text-xs font-semibold text-slate-500">
                        View Live Session
                    </span>
                    <ChevronRight size={16} className="text-slate-300" />
                </div>
            )}
        </div>
    );
};

export default EmployeeTrackingCard;
