import React from 'react';
import { Calendar, Clock, ClipboardList, UserCheck } from "lucide-react";
import type { LeaveRequest } from '../../../api/leaveService';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';

interface LeaveMobileListProps {
  data: LeaveRequest[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onStatusClick: (leave: LeaveRequest) => void;
}

const LeaveMobileList: React.FC<LeaveMobileListProps> = ({
  data = [],
  selectedIds = [],
  onToggle,
  onStatusClick
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="md:hidden text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
        No leave requests found.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-10 md:hidden">
      {data.map((item) => {
        const isSelected = selectedIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={`p-4 rounded-xl border shadow-sm relative transition-all duration-200 ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
          >
            {/* Top Section: Selection, Employee, and Status */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                  checked={isSelected}
                  onChange={() => onToggle(item.id)}
                />
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Employee</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">{item.createdBy.name}</h3>
                </div>
              </div>
              <StatusBadge status={item.status} onClick={() => onStatusClick(item)} />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClipboardList size={14} className="text-secondary shrink-0" />
                <span className="font-semibold text-gray-900 uppercase">
                  {item.category.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                <span>{item.startDate} {item.endDate ? `to ${item.endDate}` : '(Single Day)'}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={14} className="text-gray-400 shrink-0" />
                <span className="font-medium">Total: {item.leaveDays} Days</span>
              </div>

              {/* UPDATED: Added Reviewer Section */}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <UserCheck size={14} className="text-gray-400 shrink-0" />
                <span>Reviewer: <span className="font-bold">{item.approvedBy?.name || "Under Review"}</span></span>
              </div>

              {/* Reason Section */}
              <div className="bg-gray-50 p-2 rounded text-[11px] text-gray-500 italic">
                "{item.reason}"
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaveMobileList;