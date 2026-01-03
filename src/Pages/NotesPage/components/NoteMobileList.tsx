import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  ChevronRight,
} from "lucide-react"; 
import { type Note } from '../../../api/notesService';

interface NoteMobileListProps {
  data: Note[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const NoteMobileList: React.FC<NoteMobileListProps> = ({ 
  data = [], 
  selectedIds = [], 
  onToggle 
}) => {
  
  const handleToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggle(id); 
  };

  /**
   * Helper to determine the "Linked To" badge style and label
   */
  const getLinkedBadge = (item: Note) => {
    if (item.partyName) return { label: item.partyName, style: 'bg-purple-100 text-purple-700' };
    if (item.prospectName) return { label: item.prospectName, style: 'bg-orange-100 text-orange-700' };
    if (item.siteName) return { label: item.siteName, style: 'bg-blue-100 text-blue-700' };
    return { label: 'General', style: 'bg-gray-100 text-gray-700' };
  };

  if (!data || data.length === 0) {
    return (
      <div className="md:hidden text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300 mx-4">
        No interaction notes found.
      </div>
    );
  }

  return (
    <div className="md:hidden w-full space-y-4 pb-10">
      {data.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const badge = getLinkedBadge(item);

        return (
          <div 
            key={item.id} 
            className={`p-4 rounded-xl border shadow-sm transition-all duration-200 ${
              isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
            }`}
          >
            {/* Header Row: Selection & Badge */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer shrink-0" 
                  checked={isSelected} 
                  onChange={(e) => handleToggle(e as any, item.id)} 
                />
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${badge.style}`}>
                  {badge.label}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Title & Description */}
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 italic">
                {item.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-y-2 mb-4 border-t border-gray-50 pt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User size={14} className="text-gray-400" />
                <span className="truncate">{item.createdBy.name}</span>
              </div>
              
            </div>

            {/* View Details Action */}
            <Link 
              to={`/notes/${item.id}`} 
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-blue-600 text-xs font-bold rounded-lg border border-gray-200 transition-colors"
            >
              View Full Details 
              <ChevronRight size={14} />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default NoteMobileList;