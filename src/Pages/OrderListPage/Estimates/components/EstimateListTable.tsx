import React from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';

interface Estimate {
    id: string;
    _id: string;
    estimateNumber: string;
    partyName: string;
    totalAmount: number;
    dateTime: string;
    createdBy: { name: string };
}

interface EstimateListTableProps {
    estimates: Estimate[];
    startIndex: number;
    selection: {
        selectedIds: string[];
        isAllSelected: boolean;
    };
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onDelete: (id: string) => void;
    canDelete?: boolean;
    canBulkDelete?: boolean;
}

const EstimateListTable: React.FC<EstimateListTableProps> = ({
    estimates,
    startIndex,
    selection,
    onToggleSelect,
    onToggleSelectAll,
    onDelete,
    canDelete = true,
    canBulkDelete = true
}) => {
    return (
         <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-secondary text-white text-sm">
                        <tr>
                            {canBulkDelete && (
                                <th className="px-5 py-3 text-left">
                                    <input type="checkbox" className="rounded border-gray-300" checked={selection.isAllSelected} onChange={onToggleSelectAll} />
                                </th>
                            )}
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Estimate Number</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created By</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Amount</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Details</th>
                            {canDelete && <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {estimates.map((est: Estimate, index: number) => (
                            <tr key={est.id || est._id} className={`${selection.selectedIds.includes(est.id || est._id) ? 'bg-blue-50' : 'hover:bg-gray-200'} transition-colors`}>
                                {canBulkDelete && (
                                    <td className="px-5 py-3">
                                        <input type="checkbox" checked={selection.selectedIds.includes(est.id || est._id)} onChange={() => onToggleSelect(est.id || est._id)} className="rounded" />
                                    </td>
                                )}
                                <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
                                <td className="px-5 py-3 text-black text-sm">{est.estimateNumber}</td>
                                <td className="px-5 py-3 text-black text-sm">{est.partyName}</td>
                                <td className="px-5 py-3 text-black text-sm">{est.createdBy?.name || '-'}</td>
                                <td className="px-5 py-3 text-black text-sm">RS {est.totalAmount.toLocaleString()}</td>
                                <td className="px-5 py-4 text-sm">
                                    <Link to={`/estimate/${est.id || est._id}`} className="text-blue-500 hover:underline font-semibold">View Details</Link>
                                </td>
                                {canDelete && (
                                    <td className="px-5 py-3">
                                        <button onClick={() => onDelete(est.id || est._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EstimateListTable;
