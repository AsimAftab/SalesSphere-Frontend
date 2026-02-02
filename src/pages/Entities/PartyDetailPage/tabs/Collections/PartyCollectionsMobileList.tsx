import React from 'react';
import { Link } from 'react-router-dom';
import type { Collection } from '@/api/collectionService';
import { formatDisplayDate } from '@/utils/dateUtils';

interface PartyCollectionsMobileListProps {
    collections: Collection[];
    partyId: string;
}

export const PartyCollectionsMobileList: React.FC<PartyCollectionsMobileListProps> = ({ collections, partyId }) => {
    return (
        <div className="md:hidden space-y-4">
            {collections.map((collection) => (
                <div key={collection.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Date</span>
                            <span className="font-medium text-gray-900">
                                {collection.receivedDate ? formatDisplayDate(collection.receivedDate) : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block mb-1 text-right">Created By</span>
                            <span className="font-medium text-gray-900 text-right block">
                                {collection.createdBy?.name || '-'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-500 text-xs block">Payment Mode</span>
                            <span className="text-gray-700 font-medium">
                                {collection.paymentMode}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-xs block">Amount</span>
                            <span className="text-gray-900 font-bold">RS {collection.paidAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-50">
                        <Link
                            to={`/collection/${collection.id}`}
                            state={{ from: 'party-details', partyId: partyId }}
                            className="block w-full text-center py-2 text-sm font-medium text-secondary bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};
