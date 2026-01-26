import React from 'react';
import { motion } from 'framer-motion';
import { useAssignedBeatPlans } from '../hooks/useAssignedBeatPlans';
import { Calendar, CheckCircle } from 'lucide-react';

const CompletedBeatsTab: React.FC = () => {
    const { beatPlans: allPlans, loading } = useAssignedBeatPlans(); // Helper filters? No, we filter here.

    const completedPlans = allPlans.filter(p => p.status === 'completed');

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading completed beats...</div>;
    }

    if (completedPlans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mb-4 text-green-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Completed Beats</h3>
                <p className="max-w-sm mt-2">Completed beat plans will appear here for your review.</p>
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
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed By</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Completed</th>
                            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {completedPlans.map((plan) => (
                            <motion.tr
                                key={plan._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{plan.name}</div>
                                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                        <CheckCircle className="w-3 h-3" /> Could add extra details
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        {plan.employees[0]?.avatarUrl ? (
                                            <img src={plan.employees[0].avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                                                {plan.employees[0]?.name.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{plan.employees[0]?.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        {plan.completedAt
                                            ? new Date(plan.completedAt).toLocaleDateString()
                                            : 'N/A'}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{plan.progress.visitedDirectories}</span>
                                            <span className="text-gray-500"> / {plan.progress.totalDirectories} visited</span>
                                        </div>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompletedBeatsTab;
