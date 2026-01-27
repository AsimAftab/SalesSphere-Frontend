import React from 'react';
import { Eye, Calendar, Trash2 } from 'lucide-react';
import type { BeatPlan } from '../../../../../api/beatPlanService';
import { toast } from 'react-hot-toast';

interface ActiveBeatsMobileProps {
    beatPlans: BeatPlan[];
    currentPage: number;
    itemsPerPage: number;
    onView: (plan: BeatPlan) => void;
    onDelete: (id: string) => void;
}

const ActiveBeatsMobile: React.FC<ActiveBeatsMobileProps> = ({
    beatPlans,
    currentPage,
    itemsPerPage,
    onView,
    onDelete
}) => {
    return (
        <div className="md:hidden space-y-4 pb-4">
            {beatPlans.map((plan, index) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                const assignee = plan.employees[0];

                return (
                    <div
                        key={plan._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            {/* Header: S.No + Status */}
                            <div className="flex justify-between items-start">
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                    S.NO. {serialNumber}
                                </div>
                                <span className={`
                                    inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                    ${plan.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                                        plan.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}
                                `}>
                                    {plan.status}
                                </span>
                            </div>

                            {/* Plan Name */}
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                                {plan.name}
                            </h3>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
                                {/* Assigned To */}
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                                        Assigned To
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {assignee ? (
                                            <>
                                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                    {assignee.name.charAt(0)}
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700 truncate max-w-[80px]">
                                                    {assignee.name}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Unassigned</span>
                                        )}
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                                        Date
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                        {new Date(plan.schedule.startDate).toISOString().split('T')[0]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
                            <button
                                onClick={() => onView(plan)}
                                className="py-2.5 bg-white text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (plan.status === 'active') {
                                        toast.error("You cannot delete an Active beat plan.");
                                    } else {
                                        onDelete(plan._id);
                                    }
                                }}
                                className="py-2.5 bg-white text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                title="Delete Beat Plan"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActiveBeatsMobile;
