import React from 'react';
import { Link } from 'react-router-dom';
import { type Expense } from "@/api/expensesService";
import { StatusBadge } from '@/components/ui';
import { Eye } from 'lucide-react';

interface TableProps {
  data: Expense[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onBadgeClick: (exp: Expense) => void;
  startIndex: number;
  permissions: {
    canDelete: boolean;
    canViewDetail: boolean;
  };
}

export const ExpenseTable: React.FC<TableProps> = ({
  data,
  selectedIds,
  onToggle,
  onSelectAll,
  onBadgeClick,
  startIndex,
  permissions
}) => {
  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">

      <table className="w-full border-collapse">
        <thead className="bg-secondary text-white text-sm">
          <tr>
            {permissions.canDelete && (
              <th className="px-5 py-4 text-left w-12">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 accent-white cursor-pointer"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
            )}
            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">S.NO.</th>
            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Title</th>
            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Amount</th>
            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Incurred Date</th>
            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Category</th>
            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Submitted By</th>
            {permissions.canViewDetail && (
              <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">View Details</th>
            )}
            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Reviewer</th>
            <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((exp, index) => (
            <tr
              key={exp.id}
              className={`transition-colors ${selectedIds.includes(exp.id) ? 'bg-blue-50' : 'hover:bg-gray-200'}`}
            >
              {permissions.canDelete && (
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-secondary cursor-pointer"
                    checked={selectedIds.includes(exp.id)}
                    onChange={() => onToggle(exp.id)}
                  />
                </td>
              )}
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
              {permissions.canViewDetail && (
                <td className="px-5 py-3 text-sm">
                  <Link
                    to={`/expenses/${exp.id}`}
                    className="text-blue-500 hover:underline font-black text-sm inline-flex items-center gap-1"
                  >
                    <Eye className="w-5 h-5" /> View Details
                  </Link>
                </td>
              )}
              <td className="px-5 py-3 text-black text-sm">
                {exp.approvedBy?.name || "Under Review"}
              </td>
              <td className="px-5 py-3 text-sm">
                <StatusBadge status={exp.status} onClick={() => onBadgeClick(exp)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};