import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  FileText,
  IndianRupee,
  Tag,
  User,
} from 'lucide-react';
import { type Expense } from "@/api/expensesService";
import { StatusBadge } from '@/components/ui';

interface MobileListProps {
  data: Expense[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onBadgeClick: (expense: Expense) => void;
  permissions: {
    canDelete: boolean;
    canViewDetail: boolean;
  };
}

export const ExpenseMobileList: React.FC<MobileListProps> = ({
  data,
  selectedIds,
  onToggle,
  onBadgeClick,
  permissions
}) => {
  return (
    <div className="w-full space-y-4 pb-10 ">
      {data.map((exp) => {
        const isSelected = selectedIds.includes(exp.id);

        return (
          <div
            key={exp.id}
            className={`p-4 rounded-xl border shadow-sm relative overflow-hidden transition-all duration-200 ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
          >
            {/* Top Row: Submitter Info and Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {permissions.canDelete && (
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer shrink-0"
                    checked={isSelected}
                    onChange={() => onToggle(exp.id)}
                  />
                )}

                <div className="min-w-0">
                  <span className="text-xs uppercase tracking-wider font-bold text-gray-400">
                    Submitter
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                    {exp.createdBy?.name || "Unknown"}
                  </h3>
                </div>
              </div>

              <div className="shrink-0">
                <StatusBadge status={exp.status} onClick={() => onBadgeClick(exp)} />
              </div>
            </div>

            {/* Middle Content: Grid */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={14} className="text-secondary shrink-0" />
                <span className="font-semibold text-gray-900 truncate">{exp.title}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IndianRupee size={14} className="text-green-600 shrink-0" />
                <span className="font-black text-gray-900">
                  RS {exp.amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                <span className="font-medium">{exp.incurredDate}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Tag size={14} className="text-gray-400 shrink-0" />
                <span className="truncate">{exp.category}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User size={14} className="text-gray-400 shrink-0" />
                <span>Reviewer: <span className="font-bold">{exp.approvedBy?.name || "-"}</span></span>
              </div>
            </div>

            {/* Bottom Action Button */}
            {permissions.canViewDetail && (
              <Link
                to={`/expenses/${exp.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 active:scale-[0.98] transition-transform"
              >
                View Details
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};