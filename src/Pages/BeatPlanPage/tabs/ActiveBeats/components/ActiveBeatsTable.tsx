import React from 'react';
import { motion } from 'framer-motion';
import { Eye} from 'lucide-react';
import type { BeatPlan } from '../../../../../api/beatPlanService';
import { EmptyState } from '../../../../../components/UI/EmptyState/EmptyState';
import Pagination from '../../../../../components/UI/Page/Pagination';
import beatPlanIcon from '../../../../../assets/Image/icons/beat-plan-icon.svg';

interface ActiveBeatsTableProps {
    beatPlans: BeatPlan[];
    currentPage: number;
    itemsPerPage: number;
    totalPlans: number;
    onPageChange: (page: number) => void;
    onView: (plan: BeatPlan) => void;
}

const ActiveBeatsTable: React.FC<ActiveBeatsTableProps> = ({
    beatPlans,
    currentPage,
    itemsPerPage,
    totalPlans,
    onPageChange,
    onView,
}) => {
    if (beatPlans.length === 0) {
        return (
            <div className="rounded-xl shadow-sm">
                <EmptyState
                    icon={beatPlanIcon}
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
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
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
                                        {serialNumber.toString().padStart(2, '0')}
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
                                    
                                    <td className="py-4 px-6 text-sm text-gray-700">
                                        {new Date(plan.schedule.startDate).toISOString().split('T')[0]}
                                        
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`
                                            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border
                                            ${plan.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : plan.status === 'completed'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                                                ${plan.status === 'active'
                                                    ? 'bg-emerald-500'
                                                    : plan.status === 'completed'
                                                        ? 'bg-blue-500'
                                                        : 'bg-amber-500'}
                                            `}></span>
                                            {plan.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => onView(plan)}
                                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" /> View Details
                                        </button>
                                    </td>

                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-100 bg-white p-4">
                <Pagination
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    totalItems={totalPlans}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    );
};

export default ActiveBeatsTable;
