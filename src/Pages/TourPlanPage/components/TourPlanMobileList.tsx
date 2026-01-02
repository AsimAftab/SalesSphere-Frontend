import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  ClipboardList 
} from "lucide-react"; 
import { type TourPlan } from '../../../api/tourPlanService';

interface TourPlanMobileListProps {
  data: TourPlan[];
  selectedIds: string[];
  // UPDATED: Using hook handler instead of direct state setter
  onToggle: (id: string) => void;
  onStatusClick: (plan: TourPlan) => void;
}

const TourPlanMobileList: React.FC<TourPlanMobileListProps> = ({ 
  data = [], 
  selectedIds = [], 
  onToggle, // UPDATED
  onStatusClick 
}) => {
  
  // UPDATED: Logic simplified to call the centralized hook
  const handleToggle = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation();
    onToggle(id); 
  };

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="md:hidden text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
        No tour plans found.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-10">
      {data.map((item) => {
        const isSelected = (selectedIds || []).includes(item.id);

        return (
          <div 
            key={item.id} 
            className={`p-4 rounded-xl border shadow-sm relative overflow-hidden transition-all duration-200 ${
              isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
            }`}
          >
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="relative z-20 p-1 -m-1" 
                  onClick={(e) => handleToggle(e, item.id)}
                >
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer shrink-0" 
                    checked={isSelected} 
                    readOnly 
                  />
                </div>
                
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    Created By
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                    {item.createdBy?.name || "Unknown"}
                  </h3>
                </div>
              </div>

              <div className="shrink-0 z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusClick(item);
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border shadow-sm transition-transform active:scale-95 ${getStatusStyle(item.status)}`}
                >
                  {item.status || 'PENDING'}
                </button>
              </div>
            </div>

            {/* Middle Content */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-secondary shrink-0" />
                <span className="font-semibold text-gray-900 truncate">
                  {item.placeOfVisit || 'Not Specified'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClipboardList size={14} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-600 truncate italic">
                  "{item.purposeOfVisit || 'No purpose specified'}"
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                <span className="font-medium">Starts: {item.startDate || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={14} className="text-gray-400 shrink-0" />
                <span className="font-medium">{item.numberOfDays || 0} Days Duration</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User size={14} className="text-gray-400 shrink-0" />
                <span>Reviewer: <span className="font-bold">{item.approvedBy?.name || "-"}</span></span>
              </div>
            </div>

            {/* Bottom Action Button */}
            <Link 
              to={`/tour-plans/${item.id}`} 
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 active:scale-[0.98] transition-transform"
            >
              View Details 
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default TourPlanMobileList;