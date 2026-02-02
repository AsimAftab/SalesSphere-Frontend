import React from 'react';
import { motion } from 'framer-motion';
import { Send, Eye } from 'lucide-react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { BeatPlanList } from '@/api/beatPlanService';
import beatPlanIcon from '@/assets/images/icons/beat-plan-icon.svg';

import type { BeatPlanPermissions } from '../../../hooks/useBeatPlanPermissions';
import { EmptyState, Pagination } from '@/components/ui';

interface BeatListTableProps {
    templates: BeatPlanList[];
    currentPage: number;
    itemsPerPage: number;
    totalTemplates: number;
    onPageChange: (page: number) => void;
    onAssign: (template: BeatPlanList) => void;
    onView: (template: BeatPlanList) => void;
    onEdit: (template: BeatPlanList) => void;
    onDelete: (id: string) => void;
    permissions: BeatPlanPermissions;
}

const BeatListTable: React.FC<BeatListTableProps> = ({
    templates,
    currentPage,
    itemsPerPage,
    totalTemplates,
    onPageChange,
    onAssign,
    onView,
    onEdit,
    onDelete,
    permissions
}) => {
    if (templates.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                    title="No Templates Found"
                    description="Create your first beat plan template to get started."
                    icon={
                        <img
                            src={beatPlanIcon}
                            alt="No Templates"
                            className="w-12 h-12"
                        />
                    }
                />
            </div>
        );
    }

    return (
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-secondary text-white text-sm">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Beat Plan Name</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Stops</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created Date</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created By</th>
                            {permissions.canViewTemplateDetails && (
                                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                            )}
                            {permissions.canAssign && (
                                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Assigned To</th>
                            )}
                            {(permissions.canUpdateTemplate || permissions.canDeleteTemplate) && (
                                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {templates.map((template, index) => (
                            <motion.tr
                                key={template._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-gray-200 transition-colors"
                            >
                                <td className="px-5 py-3 text-black text-sm">
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td className="px-5 py-3 text-black text-sm">
                                    {template.name}
                                </td>
                                <td className="px-5 py-3 text-black text-sm">
                                    {template.totalDirectories}
                                </td>
                                <td className="px-5 py-3 text-black text-sm">
                                    {template.createdAt ? new Date(template.createdAt).toISOString().split('T')[0] : '-'}
                                </td>
                                <td className="px-5 py-3 text-black text-sm">
                                    {template.createdBy?.name || 'Unknown'}
                                </td>

                                {permissions.canViewTemplateDetails && (
                                    <td className="px-5 py-3 text-black text-sm">
                                        <button
                                            onClick={() => onView(template)}
                                            className="group flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Eye className="w-5 h-5" />
                                            <span className="font-medium group-hover:underline">View Details</span>
                                        </button>
                                    </td>
                                )}
                                {permissions.canAssign && (
                                    <td className="px-5 py-3 text-black text-sm">
                                        <button
                                            onClick={() => onAssign(template)}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 w-fit"
                                        >
                                            <Send className="w-3 h-3" />
                                            Assign
                                        </button>
                                    </td>
                                )}
                                {(permissions.canUpdateTemplate || permissions.canDeleteTemplate) && (
                                    <td className="px-5 py-3 text-black text-sm">
                                        <div className="flex items-center gap-x-3">
                                            {permissions.canUpdateTemplate && (
                                                <button
                                                    onClick={() => onEdit(template)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit Template"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {permissions.canDeleteTemplate && (
                                                <button
                                                    onClick={() => onDelete(template._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete Template"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={totalTemplates}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default BeatListTable;
