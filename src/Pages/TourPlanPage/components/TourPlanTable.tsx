import React from 'react';
import { type TourPlan, type TourStatus } from '../../../api/tourPlanService';

interface Props {
  data: TourPlan[];
  selectedIds: string[];
  // UPDATED: Using hook handlers instead of direct state setter
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusClick: (plan: TourPlan) => void;
  onViewDetails?: (plan: TourPlan) => void;
  startIndex: number;
}

const TourPlanTable: React.FC<Props> = ({ 
  data, 
  selectedIds, 
  onToggle, 
  onSelectAll, 
  onStatusClick, 
  onViewDetails,
  startIndex 
}) => {
  const getStatusStyle = (status: TourStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
              <td className="px-5 py-4">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-secondary cursor-pointer" 
                  checked={selectedIds.includes(item.id)} 
                  // UPDATED: Directly calls the hook's toggle logic
                  onChange={() => onToggle(item.id)} 
                />
              </td>
              <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
              <td className="px-5 py-3 text-black text-sm">{item.placeOfVisit}</td>
              <td className="px-5 py-3 text-black text-sm">{item.startDate}</td>
              <td className="px-5 py-3 text-black text-sm">{item.endDate || '-'}</td>
              <td className="px-5 py-3 text-black text-sm">{item.numberOfDays}</td>
              <td className="px-5 py-3 text-black text-sm">
                {item.createdBy?.name || 'Unknown'}
              </td>
              <td className="px-5 py-3 text-sm">
                <button 
                  onClick={() => onViewDetails?.(item)}
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                >
                  View Details
                </button>
              </td>
              <td className="px-5 py-3 text-black text-sm">{item.approvedBy?.name || ''}</td>
              <td className="px-5 py-3">
                <button 
                  onClick={() => onStatusClick(item)}
                  className={`px-3 py-1 text-xs min-w-[85px] font-bold uppercase rounded-full border shadow-sm transition-transform active:scale-95 ${getStatusStyle(item.status)}`}
                >
                  {item.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TourPlanTable;