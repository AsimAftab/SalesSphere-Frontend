import React from 'react';
import { Link } from 'react-router-dom';
import { type Note } from '@/api/notesService';
import { Eye } from 'lucide-react';

const formatDate = (dateString: string) => {
  if (!dateString) return '—';

  return new Date(dateString).toISOString().split('T')[0];
};

const getEntityConfig = (item: Note) => {
  if (item.partyName) return { label: 'Party', name: item.partyName, color: 'bg-blue-50 text-blue-600' };
  if (item.prospectName) return { label: 'Prospect', name: item.prospectName, color: 'bg-green-50 text-green-600' };
  if (item.siteName) return { label: 'Site', name: item.siteName, color: 'bg-orange-50 text-orange-600' };
  return { label: 'General', name: '—', color: 'bg-gray-50 text-gray-600' };
};

interface Props {
  data: Note[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  startIndex: number;
}

const NoteTable: React.FC<Props> = ({ data, selectedIds, onToggle, onSelectAll, startIndex }) => {
  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-secondary text-white text-sm">
          <tr>
            <th className="px-5 py-4 text-left">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-white cursor-pointer"
                checked={selectedIds.length === data.length && data.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th className="px-4 py-4 text-left font-semibold">S.NO.</th>
            <th className="px-5 py-4 text-left font-semibold">Title</th>
            <th className="px-5 py-4 text-left font-semibold">Date</th>
            <th className="px-5 py-4 text-left font-semibold">Entity Type</th>
            <th className="px-5 py-4 text-left font-semibold">Entity Name</th>
            <th className="px-5 py-4 text-left font-semibold">Created By</th>
            <th className="px-5 py-4 text-left font-semibold">View Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((item, index) => {
            const { label, name, color } = getEntityConfig(item);
            const isSelected = selectedIds.includes(item.id);

            return (
              <tr
                key={item.id}
                className={`transition-colors duration-150 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-200'}`}
              >
                <td className="px-5 py-4 align-top">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(item.id)}
                    className="w-4 h-4 text-secondary cursor-pointer mt-1"
                  />
                </td>
                <td className="px-5 py-4 text-black text-sm align-top">{startIndex + index + 1}</td>
                <td className="px-5 py-4 text-black text-sm align-top font-medium">{item.title}</td>
                <td className="px-5 py-4 text-black text-sm align-top whitespace-nowrap">{formatDate(item.createdAt)}</td>

                <td className="px-5 py-4 text-sm align-top">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color} inline-block`}>
                    {label}
                  </span>
                </td>
                <td className="px-5 py-4 text-black text-sm align-top">{name}</td>
                <td className="px-5 py-4 text-black text-sm align-top">{item.createdBy.name}</td>
                <td className="px-5 py-4 align-top">
                  <Link
                    to={`/notes/${item.id}`}
                    className="text-blue-500 hover:text-blue-700 hover:underline font-semibold text-sm inline-flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-5 h-5" /> View Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NoteTable;