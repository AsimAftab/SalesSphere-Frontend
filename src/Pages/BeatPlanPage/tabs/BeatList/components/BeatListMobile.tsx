import React from 'react';
import { Send, Eye } from 'lucide-react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { BeatPlanList } from '../../../../../api/beatPlanService';
import type { BeatPlanPermissions } from '../../../hooks/useBeatPlanPermissions';

interface BeatListMobileProps {
    templates: BeatPlanList[];
    currentPage: number;
    itemsPerPage: number;
    onAssign: (template: BeatPlanList) => void;
    onView: (template: BeatPlanList) => void;
    onEdit: (template: BeatPlanList) => void;
    onDelete: (id: string) => void;
    permissions: BeatPlanPermissions;
}

const BeatListMobile: React.FC<BeatListMobileProps> = ({
    templates,
    currentPage,
    itemsPerPage,
    onAssign,
    onView,
    onEdit,
    onDelete,
    permissions
}) => {
    return (
        <div className="md:hidden space-y-4 pb-4">
            {templates.map((template, index) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

                return (
                    <div
                        key={template._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            {/* Header: Serial # + Name */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                                        S.NO.{serialNumber}
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        {template.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Grid: Stops & Created By */}
                            <div className="grid grid-cols-2 gap-y-3 pt-2 border-t border-gray-50 mt-2">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                        Total Stops
                                    </span>
                                    <div className="text-sm font-semibold text-gray-700 mt-0.5">
                                        {template.totalDirectories}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                        Created Date
                                    </span>
                                    <div className="text-sm font-semibold text-gray-700 mt-0.5">
                                        {template.createdAt ? new Date(template.createdAt).toISOString().split('T')[0] : '-'}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                        Created By
                                    </span>
                                    <div className="text-sm font-semibold text-gray-700 mt-0.5">
                                        {template.createdBy?.name || 'Unknown'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-100">
                            <div className="flex divide-x divide-gray-100">
                                {permissions.canViewTemplateDetails && (
                                    <button
                                        onClick={() => onView(template)}
                                        className="flex-1 py-2.5 bg-white text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                )}
                                {permissions.canUpdateTemplate && (
                                    <button
                                        onClick={() => onEdit(template)}
                                        className="flex-1 py-2.5 bg-white text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Edit
                                    </button>
                                )}
                                {permissions.canDeleteTemplate && (
                                    <button
                                        onClick={() => onDelete(template._id)}
                                        className="flex-1 py-2.5 bg-white text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Delete
                                    </button>
                                )}
                            </div>

                            {permissions.canAssign && (
                                <button
                                    onClick={() => onAssign(template)}
                                    className="w-full py-3 bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Assign Beat
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BeatListMobile;
