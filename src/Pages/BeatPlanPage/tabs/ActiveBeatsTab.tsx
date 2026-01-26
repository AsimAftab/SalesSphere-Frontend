import React from 'react';
import { motion } from 'framer-motion';
import { useAssignedBeatPlans } from '../hooks/useAssignedBeatPlans';
import { Calendar, Trash2, MapPin } from 'lucide-react';

const ActiveBeatsTab: React.FC = () => {
    const { beatPlans: allPlans, loading: allLoading, handleDeletePlan: deletePlan } = useAssignedBeatPlans();

    const activeAndPendingPlans = allPlans.filter(p => p.status !== 'completed');

    if (allLoading) {
        return <div className="p-8 text-center text-gray-500">Loading active beats...</div>;
    }

    if (activeAndPendingPlans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <MapPin className="w-12 h-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Active Assignments</h3>
                <p className="max-w-sm mt-2">There are currently no active or pending beat plan assignments.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Name</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {activeAndPendingPlans.map((plan) => (
                            <motion.tr
                                key={plan._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{plan.name}</div>
                                    <div className="text-xs text-gray-500">{plan.parties.length + plan.sites.length + plan.prospects.length} stops</div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        {plan.employees[0]?.avatarUrl ? (
                                            <img src={plan.employees[0].avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                {plan.employees[0]?.name.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{plan.employees[0]?.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(plan.schedule.startDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                                        {plan.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="w-full max-w-[140px]">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.round(plan.progress.percentage)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${plan.progress.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button
                                        onClick={() => deletePlan(plan._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveBeatsTab;
