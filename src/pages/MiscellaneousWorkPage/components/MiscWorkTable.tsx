import React from "react";
import { Images, Trash2 } from 'lucide-react';
import { type MiscWork as MiscWorkType } from "@/api/miscellaneousWorkService";

interface MiscWorkTableProps {
  data: MiscWorkType[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewImage: (images: string[]) => void;
  onDelete: (id: string) => void;
  startIndex: number;
  canDelete: boolean;
}

/**
 * SRP: This component is strictly responsible for rendering the Desktop Table view.
 * It uses standardized design tokens to maintain the "Audit System" aesthetic.
 */
export const MiscWorkTable: React.FC<MiscWorkTableProps> = ({
  data,
  selectedIds,
  onToggle,
  onSelectAll,
  onViewImage,
  onDelete,
  startIndex,
  canDelete,
}) => {
  // Logic: "Select All" is checked only if all items visible on the current page are selected
  const isAllSelected = data.length > 0 && data.every((item) => selectedIds.includes(item._id));

  return (
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-secondary text-white text-sm">
            <tr>
              {canDelete && (
                <th className="px-4 py-4 text-center w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-white cursor-pointer transition-all"
                    onChange={(e) => onSelectAll(e.target.checked)}
                    checked={isAllSelected}
                  />
                </th>
              )}
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.No.</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Employee</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Nature of Work</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Work Date</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Address</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Assigner</th>
              <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Images</th>
              {canDelete && <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((work, index) => {
              const isSelected = selectedIds.includes(work._id);

              // Formatting date to YYYY-MM-DD
              const formattedDate = work.workDate
                ? new Date(work.workDate).toISOString().split('T')[0]
                : "—";

              return (
                <tr
                  key={work._id}
                  className={`transition-colors duration-200 ${isSelected ? "bg-blue-50" : "hover:bg-gray-200"
                    }`}
                >
                  {canDelete && (
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary cursor-pointer"
                        checked={isSelected}
                        onChange={() => onToggle(work._id)}
                      />
                    </td>
                  )}
                  <td className="px-5 py-3 text-black text-sm">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-5 py-3 text-black text-sm">
                    <div className="flex items-center gap-3">
                      {work.employee?.avatarUrl ? (
                        <img
                          src={work.employee.avatarUrl}
                          className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                          alt={work.employee.name}
                        />
                      ) : (
                        /* UPDATED FALLBACK: bg-secondary and text-white */
                        <div className="h-10 w-10 rounded-full bg-secondary text-white font-black flex items-center justify-center border border-secondary shrink-0 text-xs shadow-sm">
                          {work.employee?.name?.trim().charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-black text-black leading-tight">
                          {work.employee?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-500 tracking-tight">
                          {work.employee?.role || "Staff"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-black text-sm">
                    {work.natureOfWork || "—"}
                  </td>
                  <td className="px-5 py-3 text-black text-sm">
                    {formattedDate}
                  </td>
                  <td className="px-5 py-3 text-black text-sm max-w-lg">
                    <span title={work.address}>
                      {work.address || "No Address Provided"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-black text-sm">
                    {work.assignedBy?.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-sm">
                    <button
                      type="button"
                      onClick={() => onViewImage(work.images)}
                      className="flex items-center gap-1.5 text-blue-600 font-black text-xs hover:underline disabled:text-gray-300 disabled:no-underline transition-all"
                      disabled={!work.images || work.images.length === 0}
                    >
                      <Images size={14} strokeWidth={3} />
                      View ({work.images?.length || 0})
                    </button>
                  </td>
                  {canDelete && (
                    <td className="px-5 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => onDelete(work._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
                        title="Delete Entry"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};