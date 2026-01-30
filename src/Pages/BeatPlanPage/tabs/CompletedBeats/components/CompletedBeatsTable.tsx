import React from 'react';
import { StatusBadge } from '../../../../../components/UI/statusBadge/statusBadge';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import type { BeatPlan } from '../../../../../api/beatPlanService';
import { EmptyState } from '../../../../../components/UI/EmptyState/EmptyState';
import Pagination from '../../../../../components/UI/Page/Pagination';
import beatPlanIcon from '../../../../../assets/Image/icons/beat-plan-icon.svg';

interface CompletedBeatsTableProps {
    beatPlans: BeatPlan[];
    currentPage: number;
    itemsPerPage: number;
    totalPlans: number;
    onPageChange: (page: number) => void;
    onView: (plan: BeatPlan) => void;
    canViewDetails: boolean;
}

const CompletedBeatsTable: React.FC<CompletedBeatsTableProps> = ({
    beatPlans,
    currentPage,
    itemsPerPage,
    totalPlans,
    onPageChange,
    onView,
    canViewDetails,
}) => {
    if (beatPlans.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                    icon={<img src={beatPlanIcon} alt="No Completed Beats" className="w-12 h-12 grayscale opacity-50" />}
                    title="No Completed Beats Found"
                    description="Beat plans that have been completed will appear here."
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
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Completed By</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Completed Date</th>
                            {canViewDetails && (
                                <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                            )}
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {beatPlans.map((plan, index) => {
                            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                            const assignee = plan.employees?.[0];

                            return (
                                <motion.tr
                                    key={plan._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="hover:bg-gray-200 transition-colors"
                                >
                                    <td className="px-5 py-3 text-black text-sm">
                                        {serialNumber}
                                    </td>

                                    <td className="px-5 py-3 text-black text-sm">
                                        {plan.name}
                                    </td>

                                    <td className="px-5 py-3 text-black text-sm">
                                        {plan.progress?.visitedDirectories ?? 0} / {plan.progress?.totalDirectories ?? 0}
                                    </td>

                                    <td className="px-5 py-3 text-black text-sm">
                                        {assignee?.name || 'Unknown'}
                                    </td>

                                    <td className="px-5 py-3 text-black text-sm">
                                        {plan.completedAt
                                            ? new Date(plan.completedAt).toISOString().split('T')[0]
                                            : 'N/A'
                                        }
                                    </td>

                                    {canViewDetails && (
                                        <td className="px-5 py-3 text-sm">
                                            <button
                                                onClick={() => onView(plan)}
                                                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" /> View Details
                                            </button>
                                        </td>
                                    )}

                                    <td className="px-5 py-3">
                                        <StatusBadge status={plan.status} />
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                onPageChange={onPageChange}
                totalItems={totalPlans}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default CompletedBeatsTable;
