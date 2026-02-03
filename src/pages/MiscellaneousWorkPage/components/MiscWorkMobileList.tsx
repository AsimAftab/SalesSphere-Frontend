import React from "react";
import {
  Briefcase,
  Calendar,
  Images,
  MapPin,
  Trash2,
  User,
} from 'lucide-react';
import { type MiscWork as MiscWorkType } from "@/api/miscellaneousWorkService";

interface Props {
  data: MiscWorkType[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onViewImage: (images: string[]) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export const MiscWorkMobileList: React.FC<Props> = ({ data, selectedIds, onToggle, onViewImage, onDelete, canDelete }) => (
  <div className="space-y-4 px-1">
    {data.map((work) => (
      <div
        key={work._id}
        className={`p-4 rounded-xl border shadow-sm relative overflow-hidden transition-colors ${selectedIds.includes(work._id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {canDelete && (
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                checked={selectedIds.includes(work._id)}
                onChange={() => onToggle(work._id)}
              />
            )}
            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100">
              {work.employee?.name?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">{work.employee?.name || "N/A"}</h3>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{work.employee?.role || "Staff"}</span>
            </div>
          </div>
          {canDelete && (
            <button onClick={() => onDelete(work._id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={18} /></button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase size={14} className="text-secondary" />
            <span className="font-semibold text-gray-900">{work.natureOfWork || 'Miscellaneous Work'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar size={14} className="text-gray-400" />
            <span>{work.workDate ? new Date(work.workDate).toLocaleDateString('en-GB') : '-'}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{work.address || 'No Address Provided'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User size={14} className="text-gray-400" />
            <span>Assigned by: <span className="font-bold">{work.assignedBy?.name || "Admin"}</span></span>
          </div>
        </div>

        <button
          onClick={() => onViewImage(work.images)}
          disabled={!work.images?.length}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 disabled:opacity-50 active:scale-95 transition-transform"
        >
          <Images size={16} /> View Images ({work.images?.length || 0})
        </button>
      </div>
    ))}
  </div>
);