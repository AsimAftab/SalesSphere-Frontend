import React from 'react';
import { Link } from 'react-router-dom';
import { type Note } from '../../../api/notesService';

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
            <th className="px-5 py-4 text-left font-semibold">Description</th>
            <th className="px-5 py-4 text-left font-semibold">Actions</th>
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
                <td className="px-5 py-4">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => onToggle(item.id)}
                    className="w-4 h-4 text-secondary cursor-pointer"
                  />
                </td>
                <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
                <td className="px-5 py-3 text-black text-sm">{item.title}</td>
                <td className="px-5 py-3 text-black text-sm">{formatDate(item.createdAt)}</td>
                
                <td className="px-5 py-3 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
                    {label}
                  </span>
                </td>
                <td className="px-5 py-3 text-black text-sm ">{name}</td>
                <td className="px-5 py-3 text-black text-sm">{item.createdBy.name}</td>
                <td className="px-5 py-3 text-black text-sm max-w-[360px]" title={item.description}>
                  {item.description}
                </td>
                <td className="px-5 py-4">
                  <Link 
                    to={`/notes/${item.id}`} 
                    className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors"
                  >
                    View Details
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