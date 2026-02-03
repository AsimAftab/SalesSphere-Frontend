import React from 'react';
import { Link } from 'react-router-dom';
import { type Collection } from '@/api/collectionService';
import { Eye } from 'lucide-react';

interface PartyCollectionsTableProps {
    collections: Collection[];
    startIndex?: number;
    partyId: string;
}

const PartyCollectionsTable: React.FC<PartyCollectionsTableProps> = ({ collections, startIndex = 0, partyId }) => {

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-CA');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="hidden md:block lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-secondary text-white text-sm">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Payment Mode</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Amount</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created By</th>
                            <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">View Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {collections.map((collection, index) => (
                            <tr key={collection.id} className="hover:bg-gray-100 transition-colors">
                                <td className="px-5 py-3 whitespace-nowrap text-black">
                                    {startIndex + index + 1}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-black">
                                    {formatDate(collection.receivedDate)}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-black">
                                    {collection.paymentMode}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-black">
                                    RS {collection.paidAmount.toLocaleString('en-IN')}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-black">
                                    {collection.createdBy?.name || '-'}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <Link
                                        to={`/collection/${collection.id}`}
                                        state={{ from: 'party-details', partyId: partyId }}
                                        className="text-secondary hover:underline font-semibold flex items-center gap-2"
                                    >
                                        <Eye className="w-5 h-5" /> View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartyCollectionsTable;
