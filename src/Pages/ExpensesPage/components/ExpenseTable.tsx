import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../../components/UI/statusBadge'; 
import { type Expense } from "../../../api/expensesService";

interface TableProps {
  data: Expense[];
  selectedIds: string[];
  // UPDATED: Using hook handlers instead of direct state setter
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onBadgeClick: (exp: Expense) => void;
  startIndex: number; 
}

export const ExpenseTable: React.FC<TableProps> = ({ 
  data, 
  selectedIds, 
  onToggle, 
  onSelectAll,
  onBadgeClick,
  startIndex 
}) => {
  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-secondary text-white text-sm">
            <tr>
              <th className="px-5 py-4 text-left">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 accent-white cursor-pointer" 
                  // Logic remains: checked if all visible data items are in selectedIds
                  checked={selectedIds.length === data.length && data.length > 0} 
                  // UPDATED: Directly calls the hook's selectAll logic
                  onChange={(e) => onSelectAll(e.target.checked)} 
                />
              </th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Title</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Amount</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Incurred Date</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Category</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Submitted By</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Details</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Reviewer</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((exp, index) => (
              <tr 
                key={exp.id} 
                className={`transition-colors ${selectedIds.includes(exp.id) ? 'bg-blue-50' : 'hover:bg-gray-200'}`}
              >
                <td className="px-5 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-secondary cursor-pointer" 
                    checked={selectedIds.includes(exp.id)} 
                    // UPDATED: Directly calls the hook's toggle logic
                    onChange={() => onToggle(exp.id)} 
                  />
                </td>
                <td className="px-5 py-3 text-black text-sm">
                  {startIndex + index + 1}
                </td>
                <td className="px-5 py-3 text-black text-sm max-w-[180px]">
                  {exp.title}
                </td>
                <td className="px-5 py-3 text-black text-sm">
                  RS {exp.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-3 text-black text-sm">
                  {exp.incurredDate}
                </td>
                <td className="px-5 py-3 text-black text-sm">
                    {exp.category}
                </td>
                <td className="px-5 py-3 text-black text-sm">
                  {exp.createdBy.name}
                </td>
                <td className="px-5 py-3 text-sm">
                  <Link 
                    to={`/expenses/${exp.id}`} 
                    className="text-blue-500 hover:underline font-black text-sm tracking-tighter"
                  >
                    View Details 
                  </Link>
                </td>
                <td className="px-5 py-3 text-black text-sm">
                  {exp.approvedBy?.name || ""}
                </td>
                <td className="px-5 py-3 text-sm">
                  <StatusBadge status={exp.status} onClick={() => onBadgeClick(exp)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};