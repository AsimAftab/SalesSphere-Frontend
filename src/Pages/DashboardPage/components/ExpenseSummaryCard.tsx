// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getExpenses } from '../../../api/expensesService';
// import InfoCard from '../../../components/shared_cards/InfoCard';
// import { Link } from 'react-router-dom';
// import { Receipt } from 'lucide-react';
// import { EmptyState } from '../../../components/UI/EmptyState/EmptyState';
// import { DashboardMapper } from '../../../api/dashboardService';

// const ExpenseSummaryCard: React.FC = () => {
//     const { data: expenses = [], isLoading } = useQuery({
//         queryKey: ['expenses'],
//         queryFn: () => getExpenses(),
//         select: (data) => {
//             return [...data]
//                 .sort((a, b) => new Date(b.incurredDate).getTime() - new Date(a.incurredDate).getTime())
//                 .slice(0, 5);
//         },
//         staleTime: 1000 * 60 * 5,
//     });

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'approved': return 'bg-green-100 text-green-700';
//             case 'rejected': return 'bg-red-100 text-red-700';
//             default: return 'bg-yellow-100 text-yellow-700';
//         }
//     };

//     return (
//         <InfoCard
//             title="Recent Expenses"
//             footer={
//                 <Link to="/claims" className="block w-full text-center text-sm font-medium text-secondary hover:text-secondary/80">
//                     View All Expenses →
//                 </Link>
//             }
//         >
//             {isLoading ? (
//                 <div className="flex items-center justify-center h-full">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
//                 </div>
//             ) : expenses.length === 0 ? (
//                 <EmptyState
//                     title="No Expenses"
//                     description="No recent expense claims found."
//                     icon={<Receipt className="w-12 h-12 text-gray-300" />}
//                 />
//             ) : (
//                 <div className="space-y-4 overflow-y-auto pr-2 h-full">
//                     {expenses.map((expense) => (
//                         <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-100">
//                             <div className="flex-1 min-w-0 mr-3">
//                                 <p className="text-sm font-semibold text-gray-800 truncate">{expense.title}</p>
//                                 <div className="flex items-center text-xs text-gray-500 mt-1">
//                                     <span className="truncate">{expense.createdBy.name}</span>
//                                     <span className="mx-1">•</span>
//                                     <span className="truncate">{new Date(expense.incurredDate).toLocaleDateString()}</span>
//                                 </div>
//                             </div>
//                             <div className="text-right flex-shrink-0">
//                                 <p className="text-sm font-bold text-gray-900">
//                                     {DashboardMapper.formatCurrency(expense.amount)}
//                                 </p>
//                                 <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${getStatusColor(expense.status)}`}>
//                                     {expense.status}
//                                 </span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </InfoCard>
//     );
// };

// export default ExpenseSummaryCard;
