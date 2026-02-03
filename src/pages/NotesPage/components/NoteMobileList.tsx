import React from 'react';
import { Calendar, ExternalLink, StickyNote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Note } from '@/api/notesService';

interface NoteMobileListProps {
  data: Note[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const NoteMobileList: React.FC<NoteMobileListProps> = ({
  data = [],
  selectedIds = [],
  onToggle,

}) => {

  /**
   * Helper to determine the "Linked To" badge style and label
   */
  const getLinkedBadge = (item: Note) => {
    if (item.partyName) return { label: 'Party', name: item.partyName, style: 'bg-blue-50 text-blue-600 border-blue-100' };
    if (item.prospectName) return { label: 'Prospect', name: item.prospectName, style: 'bg-green-50 text-green-600 border-green-100' };
    if (item.siteName) return { label: 'Site', name: item.siteName, style: 'bg-orange-50 text-orange-600 border-orange-100' };
    return { label: 'General', name: 'General Note', style: 'bg-gray-50 text-gray-600 border-gray-100' };
  };

  if (!data || data.length === 0) {
    return (
      <div className="md:hidden text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300 mx-4">
        No notes found.
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-4 px-1 pb-10">
      {data.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const badge = getLinkedBadge(item);

        return (
          <div
            key={item.id}
            className={`p-4 rounded-xl border shadow-sm relative overflow-hidden transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
          >
            {/* Header Row: Selection & Creator Info */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-2">
                {/* Line 1: Checkbox and Name */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer shrink-0"
                    checked={isSelected}
                    onChange={() => onToggle(item.id)}
                  />
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    {item.createdBy?.name || "N/A"}
                  </h3>
                </div>

                {/* Line 2: Badge */}
                <div className={`inline-flex items-center self-start px-2 py-0.5 rounded border text-xs font-bold  tracking-wider ${badge.style}`}>
                  {badge.label}: {badge.name}
                </div>
              </div>
            </div>

            {/* Note Content Grid */}
            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className="flex items-start gap-2 text-sm text-black">
                <StickyNote size={14} className="text-secondary mt-1 shrink-0" />
                <span className="font-semi-bold text-black block leading-tight">{item.title}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-black font-medium  tracking-widest">
                <Calendar size={12} />
                {/* Standardizes to YYYY-MM-DD format using ISO string logic */}
                <span>
                  {item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '—'}
                </span>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col gap-2">
              <Link
                to={`/notes/${item.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100  transition-transform"
              >
                <ExternalLink size={14} /> View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NoteMobileList;