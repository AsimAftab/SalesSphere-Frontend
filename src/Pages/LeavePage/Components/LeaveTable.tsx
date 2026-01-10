import React from 'react';
import type { LeaveRequest } from '../../../api/leaveService';
import { StatusBadge } from '../../../components/UI/statusBadge';

interface Props {
  data: LeaveRequest[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusClick: (leave: LeaveRequest) => void;
  startIndex: number;
  canDelete: boolean;
  canApprove: boolean;
}

const LeaveTable: React.FC<Props> = ({ data, selectedIds, onToggle, onSelectAll, onStatusClick, startIndex, canDelete, canApprove }) => (
  <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full border-collapse">
      <thead className="bg-secondary text-white text-sm">
        <tr>
          {canDelete && (
            <th className="px-5 py-4 text-left">
              <input
                type="checkbox"
                checked={selectedIds.length === data.length && data.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded accent-white cursor-pointer"
              />
            </th>
          )}
          <th className="px-4 py-4 text-left font-semibold">S.NO.</th>
          <th className="px-5 py-4 text-left font-semibold">Employee</th>
          <th className="px-5 py-4 text-left font-semibold">Category</th>
          <th className="px-5 py-4 text-left font-semibold">Start Date</th>
          <th className="px-5 py-4 text-left font-semibold">End Date</th>
          <th className="px-5 py-4 text-left font-semibold">Days</th>
          <th className="px-5 py-4 text-left font-semibold">Reason</th>
          <th className="px-5 py-4 text-left font-semibold">Reviewer</th>
          <th className="px-5 py-4 text-left font-semibold">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {data.map((item, index) => (
          <tr key={item.id} className={`transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50' : 'hover:bg-gray-200'}`}>
            {canDelete && (
              <td className="px-5 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onToggle(item.id)}
                  className="w-4 h-4 rounded text-secondary cursor-pointer"
                />
              </td>
            )}
            <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
            <td className="px-5 py-3 text-black text-sm">{item.createdBy.name}</td>
            <td className="px-5 py-3 text-black text-sm">{item.category.replace('_', ' ')}</td>
            <td className="px-5 py-3 text-black text-sm">{item.startDate}</td>
            <td className="px-5 py-3 text-black text-sm">{item.endDate || '-'}</td>
            <td className="px-5 py-3 text-black text-sm">{item.leaveDays}</td>
            <td className="px-5 py-3 text-black text-sm">{item.reason}</td>
            <td className="px-5 py-3 text-black text-sm">{item.approvedBy?.name || '-'}</td>
            <td className="px-5 py-3 text-sm">
              <StatusBadge
                status={item.status}
                onClick={canApprove ? () => onStatusClick(item) : undefined}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LeaveTable;