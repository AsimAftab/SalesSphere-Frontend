import React from 'react';
import { StatusBadge } from '../../../../../components/UI/statusBadge/statusBadge';
import { motion } from 'framer-motion';
import { Eye, Trash2 } from 'lucide-react';
import type { BeatPlan } from '../../../../../api/beatPlanService';
import { EmptyState } from '../../../../../components/UI/EmptyState/EmptyState';
import Pagination from '../../../../../components/UI/Page/Pagination';
import beatPlanIcon from '../../../../../assets/Image/icons/beat-plan-icon.svg';
import { toast } from 'react-hot-toast';

interface ActiveBeatsTableProps {
    beatPlans: BeatPlan[];
    currentPage: number;
    itemsPerPage: number;
    totalPlans: number;
    onPageChange: (page: number) => void;
    onView: (plan: BeatPlan) => void;
    onDelete: (id: string) => void;
}

const ActiveBeatsTable: React.FC<ActiveBeatsTableProps> = ({
    beatPlans,
    currentPage,
    itemsPerPage,
    totalPlans,
    onPageChange,
    onView,
    onDelete,
}) => {
    if (beatPlans.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                    icon={<img src={beatPlanIcon} alt="No Active Assignments" className="w-12 h-12" />}
                    title="No Active Assignments Found"
                    description="Try adjusting your filters or search query."
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
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Assigned To</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Beat Date</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {beatPlans.map((plan, index) => {
                            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                            const assignee = plan.employees[0]; // Assuming single assignee for now or primary

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
                                        {plan.progress.totalDirectories}
                                    </td>

                                    <td className="px-5 py-3 text-black text-sm">
                                        {assignee.name}
                                    </td>

                                    <td className="px-5 py-3 text-black text-sm">
                                        {new Date(plan.schedule.startDate).toISOString().split('T')[0]}
                                    </td>

                                    <td className="px-5 py-3 text-sm">
                                        <button
                                            onClick={() => onView(plan)}
                                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" /> View Details
                                        </button>
                                    </td>

                                    <td className="px-5 py-3">
                                        <StatusBadge status={plan.status} />
                                    </td>

                                    <td className="px-5 py-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (plan.status === 'active') {
                                                    toast.error("You cannot delete an Active beat plan.");
                                                } else {
                                                    onDelete(plan._id);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete Beat Plan"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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

export default ActiveBeatsTable;
