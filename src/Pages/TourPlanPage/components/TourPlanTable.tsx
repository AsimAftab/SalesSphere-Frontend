import React from 'react';
import { type TourPlan } from '../../../api/tourPlanService';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../../components/UI/statusBadge'

interface Props {
  data: TourPlan[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusClick: (plan: TourPlan) => void;
  onViewDetails?: (plan: TourPlan) => void;
  startIndex: number;
  canDelete: boolean;
}

const TourPlanTable: React.FC<Props> = ({
  data,
  selectedIds,
  onToggle,
  onSelectAll,
  onStatusClick,
  startIndex,
  canDelete
}) => {

  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-secondary text-white text-sm">
          <tr>
            {canDelete && (
              <th className="px-5 py-4 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 accent-white cursor-pointer"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
            )}
            <th className="px-4 py-4 text-left font-semibold">S.NO.</th>
            <th className="px-5 py-4 text-left font-semibold">Place of Visit</th>
            <th className="px-5 py-4 text-left font-semibold">Start Date</th>
            <th className="px-5 py-4 text-left font-semibold">End Date</th>
            <th className="px-5 py-4 text-left font-semibold">Days</th>
            <th className="px-5 py-4 text-left font-semibold">Created By</th>
            <th className="px-5 py-4 text-left font-semibold">Details</th>
            <th className="px-5 py-4 text-left font-semibold">Reviewer</th>
            <th className="px-5 py-4 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50' : 'hover:bg-gray-200'}`}
            >
              {canDelete && (
                <td className="px-5 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-secondary cursor-pointer"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                  />
                </td>
              )}
              <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
              <td className="px-5 py-3 text-black text-sm">{item.placeOfVisit}</td>
              <td className="px-5 py-3 text-black text-sm">{item.startDate}</td>
              <td className="px-5 py-3 text-black text-sm">{item.endDate || '-'}</td>
              <td className="px-5 py-3 text-black text-sm">{item.numberOfDays}</td>
              <td className="px-5 py-3 text-black text-sm">
                {item.createdBy?.name || 'Unknown'}
              </td>
              <td className="px-5 py-3 text-sm">
                <Link
                  to={`/tour-plan/${item.id}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                >
                  View Details
                </Link>
              </td>
              <td className="px-5 py-3 text-black text-sm">{item.approvedBy?.name || ''}</td>
              <td className="px-5 py-3 text-sm">
                <StatusBadge
                  status={item.status}
                  onClick={() => onStatusClick(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TourPlanTable;