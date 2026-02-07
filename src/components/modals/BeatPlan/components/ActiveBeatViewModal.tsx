import React, { useMemo } from 'react';
import {
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import type { BeatPlan } from '@/api/beatPlanService';

// Icons
import partiesIcon from '@/assets/images/icons/parties-icon.svg';
import sitesIcon from '@/assets/images/icons/sites-icon.svg';
import prospectsIcon from '@/assets/images/icons/prospects-icon.svg';
import { Button, FormModal } from '@/components/ui';

interface ActiveBeatViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: BeatPlan | null;
    isLoading?: boolean;
}

const ActiveBeatViewModal: React.FC<ActiveBeatViewModalProps> = ({ isOpen, onClose, plan, isLoading = false }) => {
    const allStops = useMemo(() => {
        if (!plan) return [];
        return [
            ...(plan.parties || []).map(p => ({ ...p, type: 'party', name: p.partyName, uniqueId: p._id })),
            ...(plan.sites || []).map(s => ({ ...s, type: 'site', name: s.siteName, uniqueId: s._id })),
            ...(plan.prospects || []).map(p => ({ ...p, type: 'prospect', name: p.prospectName, uniqueId: p._id }))
        ];
    }, [plan]);

    if (!plan) return null;

    const getIconSrc = (type: string) => {
        switch (type) {
            case 'party': return partiesIcon;
            case 'site': return sitesIcon;
            case 'prospect': return prospectsIcon;
            default: return null;
        }
    };

    const getThemeColor = (type: string) => {
        switch (type) {
            case 'party': return { bg: 'bg-blue-50', text: 'text-blue-600', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700' };
            case 'site': return { bg: 'bg-orange-50', text: 'text-orange-600', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' };
            case 'prospect': return { bg: 'bg-green-50', text: 'text-green-600', badgeBg: 'bg-green-100', badgeText: 'text-green-700' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-600', badgeBg: 'bg-gray-100', badgeText: 'text-gray-600' };
        }
    };

    const footer = (
        <div className="flex justify-end">
            <Button onClick={onClose} variant="outline" className="bg-white">
                Close
            </Button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={plan.name}
            description={<>
                <span className="font-medium text-gray-700">Assigned to:</span>{' '}
                {plan.employees?.[0]?.name || 'Unassigned'}
            </>}
            size="lg"
            footer={footer}
        >

                    {/* Stats Bar */}
                    <div className="px-6 py-3 bg-white border-b border-gray-100 flex gap-6 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Date</span>
                            <span className="font-medium text-gray-900">
                                {new Date(plan.schedule.startDate).toLocaleDateString('en-US', {
                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Progress</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                    {plan.progress.visitedDirectories} / {plan.progress.totalDirectories} visited
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-0 bg-white">
                        {isLoading ? (
                            <div className="divide-y divide-gray-50">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                            <div className="h-3 w-1/2 bg-gray-200 rounded" />
                                        </div>
                                        <div className="w-16 h-6 bg-gray-200 rounded shrink-0" />
                                    </div>
                                ))}
                            </div>
                        ) : allStops.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No stops assigned to this plan.</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {allStops.map((stop) => {
                                    const visit = plan.visits?.find(v => v.directoryId === stop.uniqueId);
                                    const status = visit?.status || 'pending';
                                    const isVisited = status === 'visited';
                                    const visitedTime = visit?.visitedAt ? new Date(visit.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

                                    // Use theme logic from CreateBeatPlanForm
                                    const theme = getThemeColor(stop.type);

                                    return (
                                        <div
                                            key={stop.uniqueId}
                                            className={`
                                                group p-4 flex items-center gap-4 transition-all duration-200
                                                ${isVisited ? 'bg-green-50/40 hover:bg-green-50/60' : 'bg-white hover:bg-gray-50'}
                                            `}
                                        >
                                            {/* Status Icon (Replaces Checkbox) */}
                                            <div className={`
                                                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                                                ${isVisited ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}
                                            `}>
                                                {isVisited ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                            </div>

                                            {/* Type Icon (Themed) */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme.bg}`}>
                                                <div
                                                    className={`w-5 h-5 ${theme.text}`}
                                                    style={{
                                                        backgroundColor: 'currentColor',
                                                        mask: `url("${getIconSrc(stop.type)}") no-repeat center / contain`,
                                                        WebkitMask: `url("${getIconSrc(stop.type)}") no-repeat center / contain`
                                                    }}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className={`font-semibold text-sm truncate ${isVisited ? 'text-green-900' : 'text-gray-900'}`}>
                                                        {stop.name}
                                                    </h4>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${theme.badgeBg} ${theme.badgeText}`}>
                                                        {stop.type === 'party' ? 'Party' : stop.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                                    <span className="truncate">{stop.location?.address || 'No address'}</span>
                                                </div>
                                                {stop.ownerName && (
                                                    <p className="text-xs text-gray-400 mt-0.5">Owner: {stop.ownerName}</p>
                                                )}
                                            </div>

                                            {/* Visited Time / Owner Badge */}
                                            <div className="flex flex-col items-end gap-1">
                                                {isVisited ? (
                                                    <>
                                                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2.5 py-1 rounded-lg border border-green-200">
                                                            Visited
                                                        </span>
                                                        {visitedTime && (
                                                            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {visitedTime}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="hidden sm:block text-xs px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg border border-gray-100 font-medium">
                                                        {stop.ownerName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

        </FormModal>
    );
};

export default ActiveBeatViewModal;
