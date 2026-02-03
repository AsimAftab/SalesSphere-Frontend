import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

interface Estimate {
    id: string;
    _id: string;
    estimateNumber: string;
    partyName: string;
    totalAmount: number;
    dateTime: string;
    createdBy: { name: string };
}

interface EstimateListMobileProps {
    estimates: Estimate[];
    selection: {
        selectedIds: string[];
    };
    onToggleSelect: (id: string) => void;
    onDelete: (id: string) => void;
    canDelete?: boolean;
    canBulkDelete?: boolean;
}

const EstimateListMobile: React.FC<EstimateListMobileProps> = ({
    estimates,
    selection,
    onToggleSelect,
    onDelete,
    canDelete = true,
    canBulkDelete = true
}) => {
    return (
        <div className="md:hidden space-y-4 px-1">
            {estimates.map((est: Estimate) => (
                <div key={est._id || est.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            {canBulkDelete && <input type="checkbox" checked={selection.selectedIds.includes(est._id || est.id)} onChange={() => onToggleSelect(est._id || est.id)} className="rounded mt-1" />}
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estimate Number</span>
                                <span className="text-sm font-bold text-gray-900">{est.estimateNumber}</span>
                            </div>
                        </div>
                        {canDelete && (
                            <button onClick={() => onDelete(est._id || est.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-y-3">
                        <div className="col-span-2">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Party Name</span>
                            <span className="text-sm text-gray-800 font-medium">{est.partyName}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Created By</span>
                            <span className="text-xs text-gray-600">{est.createdBy?.name || '-'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
                            <span className="text-sm font-bold text-secondary">RS {est.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2 flex justify-end pt-2">
                            <Link to={`/estimate/${est._id || est.id}`} className="text-blue-500 text-xs font-bold hover:underline">View Details →</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EstimateListMobile;
